import { useState, useEffect } from 'react';
import { Star, GitFork, Eye, AlertCircle, Clock, Scale, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRepoStats } from '../services/api';

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const LANG_COLORS = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#CE412B', Java: '#B07219', 'C++': '#F34B7D',
  C: '#555555', Ruby: '#CC342D', PHP: '#4F5D95', Swift: '#FA7343',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Elixir: '#6E4A7E', default: '#71717A',
};

export default function RepoStatsBar({ githubUrl }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!githubUrl) return;
    setLoading(true);
    getRepoStats(githubUrl)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [githubUrl]);

  if (loading) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl overflow-x-auto"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
      >
        {[120, 80, 100, 90, 110].map((w, i) => (
          <div
            key={i}
            className="shimmer h-5 rounded flex-shrink-0"
            style={{ width: w, background: 'var(--surface3)' }}
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const langColor = LANG_COLORS[stats.language] || LANG_COLORS.default;
  const repoLink = `https://github.com/${stats.fullName}`;

  const items = [
    {
      icon: <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: langColor }} />,
      label: stats.language || 'Unknown',
      href: null,
    },
    {
      icon: <Star size={12} style={{ color: '#FCD34D' }} />,
      label: formatCount(stats.stars),
      href: null,
    },
    {
      icon: <GitFork size={12} style={{ color: '#67E8F9' }} />,
      label: formatCount(stats.forks),
      href: null,
    },
    {
      icon: <Eye size={12} style={{ color: '#A1A1AA' }} />,
      label: formatCount(stats.watchers),
      href: null,
    },
    ...(stats.openIssues > 0 ? [{
      icon: <AlertCircle size={12} style={{ color: '#FCA5A5' }} />,
      label: `${stats.openIssues} issues`,
      href: null,
    }] : []),
    ...(stats.license ? [{
      icon: <Scale size={12} style={{ color: '#86EFAC' }} />,
      label: stats.license,
      href: null,
    }] : []),
    {
      icon: <Clock size={12} style={{ color: '#71717A' }} />,
      label: `pushed ${timeAgo(stats.pushedAt)}`,
      href: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1 flex-wrap"
    >
      {/* Repo name link */}
      <a
        href={repoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors duration-150 flex-shrink-0"
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text2)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 600,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        {stats.fullName}
        <ExternalLink size={10} />
      </a>

      {/* Divider */}
      <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'var(--border)' }} />

      {/* Stats */}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md flex-shrink-0"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
            fontSize: '11px',
          }}
        >
          {item.icon}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{item.label}</span>
        </div>
      ))}

      {/* Topics */}
      {stats.topics?.slice(0, 3).map(topic => (
        <div
          key={topic}
          className="px-2 py-1 rounded-md flex-shrink-0"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.15)',
            color: '#818CF8',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          #{topic}
        </div>
      ))}
    </motion.div>
  );
}
