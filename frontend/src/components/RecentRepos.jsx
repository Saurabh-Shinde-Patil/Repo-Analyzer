import { useState, useEffect } from 'react';
import { History, X, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'agnix_recent_repos';
const MAX_RECENT = 5;

export function saveRecentRepo(url) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = existing.filter(r => r.url !== url);
    const updated = [{ url, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function loadRecentRepos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function getLabel(url) {
  try {
    const match = url.match(/github\.com\/([^/]+\/[^/?\s]+)/);
    return match ? match[1] : url;
  } catch {
    return url;
  }
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function RecentRepos({ onSelect }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    setRepos(loadRecentRepos());
  }, []);

  const removeRepo = (e, url) => {
    e.stopPropagation();
    try {
      const updated = repos.filter(r => r.url !== url);
      setRepos(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  if (repos.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <History size={13} style={{ color: 'var(--text4)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text4)', fontFamily: 'var(--font-mono)' }}>
          recent
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <AnimatePresence>
          {repos.map((r, i) => (
            <motion.div
              key={r.url}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12, height: 0 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
              onClick={() => onSelect(r.url)}
              className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <GitBranch size={12} style={{ color: 'var(--text4)', flexShrink: 0 }} />
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}
                >
                  {getLabel(r.url)}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs" style={{ color: 'var(--text4)' }}>
                  {timeAgo(r.timestamp)}
                </span>
                <button
                  onClick={e => removeRepo(e, r.url)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity duration-150"
                  style={{ color: 'var(--text4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FCA5A5'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text4)'}
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
