import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Brain, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = (url) => `agnix_chat_${btoa(url || '').slice(0, 20)}`;

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I have full context on this repository. Ask me about the architecture, specific files, how to set it up, or anything else you're curious about.",
};

const QUICK_PROMPTS = [
  'How does this project work?',
  'What is the entry point?',
  'How do I run this project?',
  'What are the main dependencies?',
];

export default function Chatbot({ repositoryUrl, provider }) {
  const storageKey = STORAGE_KEY(repositoryUrl);

  // Load chat history from localStorage on mount
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [INITIAL_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detect if memory was restored
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 1) {
          setMemoryLoaded(true);
          setTimeout(() => setMemoryLoaded(false), 4000);
        }
      }
    } catch {}
  }, [storageKey]);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Pass full history (excluding the initial greeting) to the backend
      const historyForBackend = newMessages
        .filter(m => m !== INITIAL_MESSAGE)
        .slice(-12); // Last 12 messages for context

      const response = await axios.post(`${API_URL}/api/analyze/chat`, {
        githubUrl: repositoryUrl,
        provider,
        question: userMessage,
        history: historyForBackend.slice(0, -1), // all except the last user message
      });

      if (response.data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.data.response }]);
      } else {
        throw new Error('Chat response failed');
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, messages, repositoryUrl, provider]);

  const handleClearHistory = () => {
    const fresh = [INITIAL_MESSAGE];
    setMessages(fresh);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  const storedCount = messages.filter(m => m.role !== 'assistant' || m !== INITIAL_MESSAGE).length;

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                Repo Agent
              </h3>
              <Sparkles size={12} style={{ color: '#FCD34D' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>
              Ask anything about this codebase
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Memory indicator */}
          {storedCount > 1 && (
            <div className="flex items-center gap-1.5 badge badge-indigo">
              <Brain size={11} />
              <span className="text-xs">{Math.floor(storedCount / 2)} msgs</span>
            </div>
          )}
          {/* Online dot */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: '#10B981',
                boxShadow: '0 0 6px rgba(16,185,129,0.8)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#064E3B' }}>
              Live
            </span>
          </div>
          <button
            onClick={handleClearHistory}
            title="Clear chat history"
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text4)'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Memory restored toast */}
      <AnimatePresence>
        {memoryLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 text-xs flex items-center gap-2"
            style={{ background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.15)', color: '#A5B4FC' }}
          >
            <Brain size={12} />
            Previous conversation loaded from memory
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ background: 'transparent' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
                    : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: `0 0 12px ${msg.role === 'user' ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.3)'}`,
                }}
              >
                {msg.role === 'user'
                  ? <User size={14} className="text-white" />
                  : <Bot size={14} className="text-white" />
                }
              </div>

              {/* Bubble */}
              <div
                className="max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.role === 'user' ? {
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.25))',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#E2E8F0',
                  borderTopRightRadius: '4px',
                } : {
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  borderTopLeftRadius: '4px',
                }}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={`${i > 0 ? 'mt-1.5' : ''} ${line.startsWith('- ') || line.match(/^\d+\./) ? 'ml-3' : ''}`}>
                    {msg.role === 'assistant'
                      ? line.split('**').map((part, j) =>
                          j % 2 === 1
                            ? <strong key={j} style={{ color: 'var(--text)' }}>{part}</strong>
                            : part
                        )
                      : line
                    }
                  </p>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                <Bot size={14} className="text-white" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                {[0, 150, 300].map(delay => (
                  <motion.div
                    key={delay}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#6366F1' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts (show only if few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl transition-all duration-150 font-medium"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                color: '#6366F1',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                e.currentTarget.style.color = '#A5B4FC';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                e.currentTarget.style.color = '#6366F1';
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        className="p-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <MessageSquare size={14} style={{ color: 'var(--text4)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about architecture, files, setup..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text)', caretColor: '#6366F1' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0"
            style={{
              background: !input.trim() || isLoading
                ? 'var(--card-bg)'
                : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: '1px solid var(--border)',
              boxShadow: !input.trim() || isLoading ? 'none' : '0 4px 16px rgba(99,102,241,0.4)',
            }}
          >
            {isLoading
              ? <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text3)' }} />
              : <Send size={16} style={{ color: !input.trim() ? 'var(--text4)' : 'white', marginLeft: '1px' }} />
            }
          </button>
        </form>
      </div>
    </div>
  );
}
