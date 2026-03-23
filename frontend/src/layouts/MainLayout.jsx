import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Zap, Menu, X, Sun, Moon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing',  href: '/pricing' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto rounded-xl px-4 sm:px-5 py-2.5 flex items-center justify-between"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span
            className="text-base font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AgniX
          </span>
          <span
            className="hidden sm:inline text-xs px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(99,102,241,0.1)',
              color: '#818CF8',
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            beta
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              to={link.href}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{ color: 'var(--text3)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
            }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Sun size={14} className="text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Moon size={14} style={{ color: '#6366F1' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text3)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <Github size={14} />
            <span>GitHub</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            {isOpen
              ? <X size={16} style={{ color: 'var(--text2)' }} />
              : <Menu size={16} style={{ color: 'var(--text2)' }} />
            }
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="sm:hidden max-w-6xl mx-auto mt-2 rounded-xl px-3 py-2 flex flex-col gap-0.5"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: 'var(--text2)' }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="orb-animate absolute w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{
            top: '-10%', left: '0%',
            background: 'radial-gradient(circle, #4F46E5 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="float-reverse absolute w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{
            top: '20%', right: '-5%',
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">
        {children}
      </main>

      <footer
        className="w-full py-5 text-center text-xs"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text4)' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text3)' }}>AgniX</span>
          <span className="mx-2">·</span>
          AI-Powered Codebase Intelligence
          <span className="mx-2">·</span>
          MERN Stack
        </span>
      </footer>
    </div>
  );
}
