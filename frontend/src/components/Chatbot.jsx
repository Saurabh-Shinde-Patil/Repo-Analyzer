import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot({ repositoryUrl, provider }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I have context on this repository. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/analyze/chat`, {
        githubUrl: repositoryUrl,
        provider: provider,
        question: userMessage
      });

      if (response.data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.data.response }]);
      } else {
        throw new Error('Chatbot response failed');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the server. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f172a]/95 rounded-2xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Bot size={22} className="text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-bold text-white text-[15px] drop-shadow-sm flex items-center gap-2">Repo Agent <Sparkles size={14} className="text-yellow-300" /></h3>
            <p className="text-emerald-50 text-xs opacity-90">Ask me anything about code</p>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shadow-[0_0_8px_rgba(110,231,183,1)]"></div>
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'user' 
                  ? 'bg-blue-600 outline outline-2 outline-blue-200 dark:outline-blue-500/30' 
                  : 'bg-emerald-500 outline outline-2 outline-emerald-200 dark:outline-emerald-500/30'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm border border-blue-700/50' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-white/10'
              }`}>
                {/* Parse basic markdown (just split by newlines for paragraphs for now) */}
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={`mb-1 ${line.startsWith('-') || line.startsWith('1.') ? 'ml-4' : ''}`}>
                    {msg.role === 'assistant' ? (
                      // Super simplified markdown bold handling just for quick UI
                      line.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 dark:text-white">{part}</strong> : part)
                    ) : (
                       line
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                 <Bot size={16} className="text-white" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-white dark:bg-[#1e293b]/90 border-t border-slate-200 dark:border-white/10 backdrop-blur-md">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about architecture, functions..."
            disabled={isLoading}
            className="w-full bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-full pl-5 pr-12 py-3 sm:py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:focus:ring-emerald-500/40 text-slate-800 dark:text-slate-200 placeholder-slate-500 transition-all shadow-inner disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              !input.trim() || isLoading 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
