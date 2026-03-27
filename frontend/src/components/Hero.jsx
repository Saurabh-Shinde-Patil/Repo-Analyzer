import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Loader2, Zap, Sparkles, Terminal, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_REPOS = [
  { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
  { label: 'facebook/react', url: 'https://github.com/facebook/react' },
  { label: 'expressjs/express', url: 'https://github.com/expressjs/express' },
];

const TYPEWRITER_TEXTS = ['repositories.', 'codebases.', 'architectures.', 'any repo.'];

// Terminal demo lines — types: cmd | ok | loading | blank | divider | kv | cursor
const TERMINAL_SEQUENCE = [
  { type: 'cmd',     text: 'agnix analyze github.com/vercel/next.js',  delay: 200 },
  { type: 'blank',   delay: 250 },
  { type: 'ok',      text: 'Connected to GitHub API  (18ms)',           delay: 450 },
  { type: 'ok',      text: 'Loaded 2,847 files in 312 dirs',            delay: 550 },
  { type: 'ok',      text: 'Stack: TypeScript · React · Node.js',       delay: 500 },
  { type: 'loading', text: 'Running Groq AI analysis...',               delay: 350 },
  { type: 'ok',      text: 'Analysis complete  (21.4s)',                 delay: 1700 },
  { type: 'blank',   delay: 150 },
  { type: 'divider', delay: 100 },
  { type: 'kv',      key: 'Architecture',  value: 'App Router · Monorepo',    delay: 180 },
  { type: 'kv',      key: 'Security',      value: '0 critical · 2 warnings',  delay: 150 },
  { type: 'kv',      key: 'API Routes',    value: '47 endpoints mapped',       delay: 150 },
  { type: 'kv',      key: 'Dependencies',  value: '148 packages installed',    delay: 150 },
  { type: 'divider', delay: 100 },
  { type: 'cursor',  delay: 300 },
];

function TypewriterText() {
  const [text, setText] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const current = TYPEWRITER_TEXTS[lineIdx];
    const speed = isDeleting ? 30 : 75;
    const t = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setIsPaused(true);
          setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 2000);
          return;
        }
        setCharIdx(c => c + 1);
      } else {
        setText(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setIsDeleting(false);
          setLineIdx(i => (i + 1) % TYPEWRITER_TEXTS.length);
          setCharIdx(0);
          return;
        }
        setCharIdx(c => c - 1);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [charIdx, isDeleting, lineIdx, isPaused]);

  return (
    <span>
      <span className="gradient-text">{text}</span>
      <span className="cursor-blink" style={{ color: '#818CF8', WebkitTextFillColor: '#818CF8' }}>|</span>
    </span>
  );
}

function TerminalSpinner() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % frames.length), 80);
    return () => clearInterval(t);
  }, []);
  return <span style={{ color: '#6366F1' }}>{frames[i]}</span>;
}

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setVisibleLines([]);
    const timers = [];
    let cumDelay = 0;

    TERMINAL_SEQUENCE.forEach((line, idx) => {
      cumDelay += line.delay;
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, { ...line, id: idx }]);
      }, cumDelay);
      timers.push(t);
    });

    // Restart
    const restartT = setTimeout(() => setCycle(c => c + 1), cumDelay + 3000);
    timers.push(restartT);

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const renderLine = (line) => {
    switch (line.type) {
      case 'cmd':
        return (
          <div key={line.id} className="term-line flex items-center gap-2">
            <span style={{ color: '#6366F1', fontWeight: 600 }}>$</span>
            <span style={{ color: '#FAFAFA' }}>{line.text}</span>
          </div>
        );
      case 'ok':
        return (
          <div key={line.id} className="term-line flex items-center gap-2">
            <span style={{ color: '#22C55E' }}>✓</span>
            <span style={{ color: '#A1A1AA' }}>{line.text}</span>
          </div>
        );
      case 'loading':
        return (
          <div key={line.id} className="term-line flex items-center gap-2">
            <TerminalSpinner />
            <span style={{ color: '#A1A1AA' }}>{line.text}</span>
          </div>
        );
      case 'blank':
        return <div key={line.id} className="term-line h-3" />;
      case 'divider':
        return (
          <div key={line.id} className="term-line" style={{ color: '#3F3F46', userSelect: 'none' }}>
            {'─'.repeat(40)}
          </div>
        );
      case 'kv':
        return (
          <div key={line.id} className="term-line flex items-center gap-2">
            <span style={{ color: '#71717A', minWidth: '100px', fontFamily: 'var(--font-mono)' }}>
              {line.key}
            </span>
            <span style={{ color: '#FAFAFA' }}>{line.value}</span>
          </div>
        );
      case 'cursor':
        return (
          <div key={line.id} className="term-line flex items-center gap-2">
            <span style={{ color: '#6366F1', fontWeight: 600 }}>$</span>
            <span className="terminal-cursor" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg"
    >
      {/* Ambient glow */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
        style={{ background: 'radial-gradient(ellipse, #6366F1 0%, transparent 70%)' }}
      />

      {/* Terminal frame */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: '#0D1117',
          border: '1px solid rgba(63,63,70,0.6)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(22,22,26,0.9)',
            borderBottom: '1px solid rgba(63,63,70,0.5)',
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
          </div>
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            <Terminal size={11} style={{ color: '#52525B' }} />
            <span style={{ color: '#52525B', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              agnix — zsh
            </span>
          </div>
        </div>

        {/* Terminal body */}
        <div
          className="p-4 min-h-[280px]"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            lineHeight: '1.7',
            color: '#A1A1AA',
          }}
        >
          <AnimatePresence>
            {visibleLines.map(line => renderLine(line))}
          </AnimatePresence>
        </div>
      </div>

      {/* Language badge strip */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {['TypeScript', 'React', 'Next.js', 'Node.js'].map(tag => (
          <span
            key={tag}
            className="badge badge-zinc"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}
          >
            {tag}
          </span>
        ))}
        <span style={{ color: '#3F3F46', fontSize: '11px', marginLeft: 4 }}>
          detected by AI
        </span>
      </div>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Hero({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('groq');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onAnalyze(url.trim(), provider);
  };

  return (
    <div className="w-full pt-4 pb-6">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">

        {/* ── LEFT: Content + Form ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="badge badge-indigo inline-flex">
              <Sparkles size={10} />
              <span>AI-Powered Repository Intelligence</span>
              <span style={{ opacity: 0.35, marginInline: 2 }}>·</span>
              <span style={{ opacity: 0.55, fontFamily: 'var(--font-mono)' }}>v2.0</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp}>
            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.05]"
              style={{ color: 'var(--text)' }}
            >
              Understand any
              <br />
              <TypewriterText />
            </h1>
            <p
              className="mt-3 text-base sm:text-lg leading-relaxed max-w-lg"
              style={{ color: 'var(--text3)' }}
            >
              Paste a GitHub URL. AgniX maps the architecture, scans for bugs,
              documents APIs, and lets you chat with the entire codebase.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit}>
            <motion.div
              animate={{
                boxShadow: isFocused
                  ? '0 0 0 2px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.25)',
              }}
              transition={{ duration: 0.2 }}
              className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isFocused ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* URL input */}
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <Github size={15} style={{ color: 'var(--text4)', flexShrink: 0 }} />
                <input
                  type="url"
                  required
                  placeholder="https://github.com/owner/repo"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isLoading}
                  className="w-full bg-transparent border-none outline-none py-2.5 text-sm font-medium placeholder:font-normal"
                  style={{
                    color: 'var(--text)',
                    caretColor: '#6366F1',
                    fontFamily: url ? 'var(--font-mono)' : 'inherit',
                  }}
                />
              </div>

              {/* Provider + submit */}
              <div className="flex items-center gap-2 px-1">
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  disabled={isLoading}
                  className="rounded-lg px-3 py-2 text-xs font-semibold outline-none cursor-pointer appearance-none"
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text2)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <option value="groq">⚡ Groq</option>
                  <option value="gemini">✦ Gemini</option>
                  <option value="llama">🦙 Llama</option>
                  <option value="openai">◆ GPT-4o</option>
                  <option value="sarvam">🇮🇳 Sarvam AI</option>
                </select>
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="primary-btn !py-2 !px-5 !text-sm whitespace-nowrap"
                >
                  {isLoading ? (
                    <><Loader2 size={14} className="animate-spin" /><span>Analyzing</span></>
                  ) : (
                    <><Zap size={14} /><span>Analyze</span></>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Sample repos */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--text4)', fontFamily: 'var(--font-mono)' }}>
                try:
              </span>
              {SAMPLE_REPOS.map(({ label, url: repo }) => (
                <button
                  key={repo}
                  type="button"
                  onClick={() => setUrl(repo)}
                  className="text-xs px-2.5 py-1 rounded-md transition-all duration-150"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text3)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.form>

          {/* Feature pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {[
              { color: '#86EFAC', label: 'Architecture Map' },
              { color: '#67E8F9', label: 'Code Explorer' },
              { color: '#FCA5A5', label: 'Bug Scanner' },
              { color: '#C4B5FD', label: 'AI Chat' },
              { color: '#FCD34D', label: 'API Map' },
            ].map(({ color, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text3)',
                }}
              >
                <CheckCircle size={10} style={{ color }} />
                {label}
              </div>
            ))}
          </motion.div>

          {/* Pricing link */}
          <motion.div variants={fadeUp}>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
              style={{ color: 'var(--text4)', fontFamily: 'var(--font-mono)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#818CF8'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text4)'}
            >
              → view plans & pricing
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Terminal window (desktop only) ── */}
        <div className="hidden lg:flex justify-center lg:justify-end">
          <TerminalWindow />
        </div>
      </div>
    </div>
  );
}
