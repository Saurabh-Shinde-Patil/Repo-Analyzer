import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Network, Shield, Globe,
  RotateCcw, Blocks, BookOpen, Flame, PlayCircle, ArrowRight,
  ShieldAlert, FileCode, CheckCircle, KeyRound, ChevronRight,
  Copy, Check, FileText, Loader2
} from 'lucide-react';
import GitHubTree from './GitHubTree';
import { getReadme } from '../services/api';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'explorer',      label: 'Explorer',       icon: FolderOpen },
  { id: 'architecture',  label: 'Architecture',   icon: Network },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'api',           label: 'API & Env',      icon: Globe },
  { id: 'readme',        label: 'README',          icon: FileText },
];

// ── Helper: Copy button ──────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg transition-all duration-200"
      style={{
        background: 'var(--surface2)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: copied ? '#10B981' : 'var(--text3)',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ summary, repo }) {
  if (!summary) return <EmptyState label="No overview data available." />;

  return (
    <div className="flex flex-col gap-6">
      {/* Repo title */}
      {repo && (
        <div className="flex items-center gap-3">
          <span
            className="text-lg font-mono font-bold"
            style={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {repo}
          </span>
          <span className="badge badge-indigo">Analyzed</span>
        </div>
      )}

      {/* Summary text */}
      <div
        className="p-5 rounded-xl text-base leading-relaxed"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text2)',
        }}
      >
        {summary.summary}
      </div>

      {/* Architecture badge */}
      {summary.architecture && (
        <div className="flex items-center gap-3">
          <div className="badge badge-violet">
            <BookOpen size={12} />
            {summary.architecture} Architecture
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {summary.techStack?.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text3)' }}>
            <Blocks size={15} />
            <span>Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.techStack.map((tech, i) => {
              const name = typeof tech === 'object' ? tech.name : tech;
              const version = typeof tech === 'object' ? tech.version : null;
              return (
                <span
                  key={i}
                  className="badge badge-cyan text-xs"
                >
                  {name}
                  {version && version !== 'Unknown' && (
                    <span className="opacity-60 ml-1 font-mono">v{version.replace(/[\^~>]/g, '')}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Design Decisions */}
      {summary.keyDesignDecisions?.length > 0 && (
        <div
          className="p-5 rounded-xl"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <div className="flex items-center gap-2 font-semibold mb-3" style={{ color: '#FCD34D' }}>
            <Flame size={16} />
            Key Design Decisions
          </div>
          <ul className="flex flex-col gap-2">
            {summary.keyDesignDecisions.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#D97706' }}>
                <ChevronRight size={14} className="mt-0.5 shrink-0 opacity-60" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Tab: Architecture ────────────────────────────────────────────────────────
function ArchitectureTab({ m2, b2, m3 }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Entry Point & Flow */}
      <Section title="Entry Point & Lifecycle" icon={PlayCircle} iconColor="#A5B4FC">
        {m2 ? (
          <>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 font-mono text-sm font-semibold"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
                color: '#C4B5FD',
              }}
            >
              <PlayCircle size={15} />
              {m2.entryFile || 'Unknown Entry Point'}
            </div>
            <div className="flex flex-col items-center gap-2">
              {m2.steps?.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-full max-w-xl">
                  <div
                    className="w-full flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text2)' }}>{step}</span>
                  </div>
                  {i < m2.steps.length - 1 && (
                    <div className="h-4 w-px" style={{ background: 'rgba(139,92,246,0.3)' }} />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : <EmptyState label="No entry point data." />}
      </Section>

      {/* Runtime Request Flow */}
      <Section title="Runtime Request Flow" icon={Network} iconColor="#67E8F9">
        {b2?.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {b2.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: 'rgba(34,211,238,0.08)',
                    border: '1px solid rgba(34,211,238,0.15)',
                    color: '#67E8F9',
                  }}
                >
                  {step}
                </span>
                {i < b2.length - 1 && <ArrowRight size={16} style={{ color: '#164E63' }} />}
              </div>
            ))}
          </div>
        ) : <EmptyState label="No request flow data." />}
      </Section>

      {/* Dependency Mapping */}
      <Section title="Dependency Mapping" icon={Network} iconColor="#6EE7B7">
        {m3?.length > 0 ? (
          <DependencyGraph m3={m3} />
        ) : <EmptyState label="No dependency data." />}
      </Section>
    </div>
  );
}

function DependencyGraph({ m3 }) {
  const grouped = m3.reduce((acc, curr) => {
    const source = curr.source || curr.file || 'Unknown';
    const target = curr.target || curr.dependsOn;
    if (!acc[source]) acc[source] = [];
    if (target && !acc[source].includes(target)) acc[source].push(target);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([source, targets], i) => (
        <div
          key={i}
          className="p-4 rounded-xl"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 font-mono text-sm font-semibold"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}
          >
            {source}
          </div>
          <div className="flex flex-col gap-2 pl-4 border-l-2" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            {targets.map((t, j) => (
              <span
                key={j}
                className="font-mono text-xs px-3 py-1.5 rounded-lg w-fit"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text3)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Security ────────────────────────────────────────────────────────────
function SecurityTab({ bugs, criticalFiles }) {
  const severityStyle = (sev) => {
    if (!sev) return { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', color: '#A5B4FC' };
    const s = sev.toLowerCase();
    if (s === 'high') return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', color: '#FCA5A5' };
    if (s === 'medium') return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#FCD34D' };
    return { bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.15)', color: '#67E8F9' };
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Bug Scan */}
      <Section
        title="Security & Bug Scan"
        icon={ShieldAlert}
        iconColor="#FCA5A5"
        badge={<span className="badge badge-red text-xs">Beta</span>}
      >
        {bugs?.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {bugs.map((bug, i) => {
              const s = severityStyle(bug.severity);
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', color: s.color }}>
                      <FileCode size={12} />
                      {bug.file}
                    </div>
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', color: s.color }}>
                      {bug.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: s.color }}>{bug.issue}</p>
                  <div className="pt-2 border-t text-xs" style={{ borderColor: 'var(--surface2)', color: s.color, opacity: 0.7 }}>
                    <span className="font-bold">Fix: </span>{bug.suggestion}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <CheckCircle size={20} style={{ color: '#10B981' }} />
            <span className="font-medium" style={{ color: '#6EE7B7' }}>No obvious bugs or vulnerabilities detected</span>
          </div>
        )}
      </Section>

      {/* Critical Files */}
      <Section title="Critical Files" icon={Flame} iconColor="#FCD34D">
        {criticalFiles?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {criticalFiles.map((cf, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                <code
                  className="text-xs font-mono px-3 py-1.5 rounded-lg shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}
                >
                  {cf.file}
                </code>
                <span className="text-sm" style={{ color: 'var(--text2)' }}>{cf.reason}</span>
              </div>
            ))}
          </div>
        ) : <EmptyState label="No critical files identified." />}
      </Section>
    </div>
  );
}

// ── Tab: API & Env ───────────────────────────────────────────────────────────
function APITab({ apiEndpoints, envVars }) {
  const METHOD_STYLE = {
    GET:    { bg: 'rgba(16,185,129,0.15)', color: '#6EE7B7' },
    POST:   { bg: 'rgba(99,102,241,0.15)', color: '#A5B4FC' },
    PUT:    { bg: 'rgba(245,158,11,0.15)', color: '#FCD34D' },
    PATCH:  { bg: 'rgba(249,115,22,0.15)', color: '#FDBA74' },
    DELETE: { bg: 'rgba(239,68,68,0.15)',  color: '#FCA5A5' },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* API Endpoints */}
      <Section title="API Endpoints" icon={Globe} iconColor="#A5B4FC">
        {apiEndpoints?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Method', 'Route', 'Handler', 'Description'].map(h => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text4)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((ep, i) => {
                  const ms = METHOD_STYLE[ep.method?.toUpperCase()] || { bg: 'var(--border)', color: 'var(--text2)' };
                  return (
                    <tr
                      key={i}
                      className="transition-colors duration-150"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-black uppercase"
                          style={{ background: ms.bg, color: ms.color }}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs" style={{ color: 'var(--text2)' }}>{ep.path}</td>
                      <td className="py-3 px-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>{ep.handler}</td>
                      <td className="py-3 px-3 text-xs" style={{ color: 'var(--text3)' }}>{ep.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState label="No API endpoints detected." />}
      </Section>

      {/* Environment Variables */}
      <Section title="Environment Variables" icon={KeyRound} iconColor="#C4B5FD">
        {envVars?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {envVars.map((ev, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--surface2)' }}
              >
                <code
                  className="text-xs font-bold font-mono px-3 py-1.5 rounded-lg shrink-0"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#C4B5FD' }}
                >
                  {ev.name}
                </code>
                <span className="hidden sm:inline text-xs" style={{ color: 'var(--text4)' }}>→</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{ev.usedIn}</span>
                <span className="text-sm sm:ml-auto" style={{ color: 'var(--text2)' }}>{ev.description}</span>
              </div>
            ))}
          </div>
        ) : <EmptyState label="No environment variables detected." />}
      </Section>
    </div>
  );
}

// ── Tab: README ──────────────────────────────────────────────────────────────
function ReadmeTab({ githubUrl }) {
  const [content, setContent] = useState(null);
  const [filename, setFilename] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!githubUrl) { setLoading(false); return; }
    getReadme(githubUrl)
      .then(data => { setContent(data.content); setFilename(data.filename); })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [githubUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text3)' }}>
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Fetching README...</span>
      </div>
    );
  }

  if (!content) {
    return <EmptyState label="No README file found in this repository." />;
  }

  // Simple markdown renderer
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;
    let codeBlock = null;
    let codeLines = [];

    while (i < lines.length) {
      const line = lines[i];

      // Code block
      if (line.startsWith('```')) {
        if (codeBlock !== null) {
          // end code block
          elements.push(
            <pre key={i}
              className="p-4 rounded-xl overflow-x-auto text-xs leading-relaxed my-3"
              style={{
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                color: '#A5B4FC',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {codeLines.join('\n')}
            </pre>
          );
          codeBlock = null;
          codeLines = [];
        } else {
          codeBlock = line.slice(3).trim() || 'text';
        }
        i++; continue;
      }

      if (codeBlock !== null) { codeLines.push(line); i++; continue; }

      // Headings
      const h1 = line.match(/^# (.+)/);
      if (h1) {
        elements.push(<h1 key={i} className="text-2xl font-black mt-6 mb-3" style={{ color: 'var(--text)' }}>{h1[1]}</h1>);
        i++; continue;
      }
      const h2 = line.match(/^## (.+)/);
      if (h2) {
        elements.push(
          <h2 key={i} className="text-lg font-bold mt-5 mb-2 pb-2"
            style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
            {h2[1]}
          </h2>
        );
        i++; continue;
      }
      const h3 = line.match(/^### (.+)/);
      if (h3) {
        elements.push(<h3 key={i} className="text-base font-semibold mt-4 mb-1.5" style={{ color: 'var(--text2)' }}>{h3[1]}</h3>);
        i++; continue;
      }

      // List items
      const li = line.match(/^[-*] (.+)/);
      if (li) {
        elements.push(
          <div key={i} className="flex items-start gap-2.5 my-1">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#6366F1' }} />
            <span className="text-sm" style={{ color: 'var(--text2)' }}>{renderInline(li[1])}</span>
          </div>
        );
        i++; continue;
      }

      // Numbered list
      const ol = line.match(/^\d+\. (.+)/);
      if (ol) {
        const num = line.match(/^(\d+)\./)[1];
        elements.push(
          <div key={i} className="flex items-start gap-2.5 my-1">
            <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: '#6366F1', minWidth: 20 }}>{num}.</span>
            <span className="text-sm" style={{ color: 'var(--text2)' }}>{renderInline(ol[1])}</span>
          </div>
        );
        i++; continue;
      }

      // Horizontal rule
      if (line.match(/^---+/) || line.match(/^===+/)) {
        elements.push(<hr key={i} className="my-4" style={{ borderColor: 'var(--border)' }} />);
        i++; continue;
      }

      // Blank line
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
        i++; continue;
      }

      // Regular paragraph
      elements.push(
        <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  const renderInline = (text) => {
    // Handle bold, italic, code
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ background: 'rgba(99,102,241,0.12)', color: '#A5B4FC' }}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ color: 'var(--text2)' }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <FileText size={16} style={{ color: '#A5B4FC' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>{filename}</span>
        <span className="badge badge-zinc text-xs ml-auto">Raw Markdown</span>
      </div>

      {/* Rendered content */}
      <div
        className="p-5 rounded-xl overflow-y-auto custom-scrollbar"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          maxHeight: '600px',
        }}
      >
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function Section({ title, icon: Icon, iconColor, badge, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon size={18} style={{ color: iconColor }} />
          <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <p className="text-sm italic" style={{ color: 'var(--text4)' }}>{label}</p>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  const { summary, b2, m1, m2, m3, criticalFiles, bugs, apiEndpoints, envVars, fileTree, repo } = data;

  const tabContent = {
    overview:     <OverviewTab summary={summary} repo={repo} />,
    explorer:     <GitHubTree fileTree={fileTree} m1={m1} githubUrl={data.repoUrl} />,
    architecture: <ArchitectureTab m2={m2} b2={b2} m3={m3} />,
    security:     <SecurityTab bugs={bugs} criticalFiles={criticalFiles} />,
    api:          <APITab apiEndpoints={apiEndpoints} envVars={envVars} />,
    readme:       <ReadmeTab githubUrl={data.repoUrl} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-4"
    >
      {/* Dashboard header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))' }}
          >
            <LayoutDashboard size={16} style={{ color: '#A5B4FC' }} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Analysis Complete
            </h2>
            {repo && (
              <p className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{repo}</p>
            )}
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text3)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#A5B4FC'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
        >
          <RotateCcw size={14} />
          New Analysis
        </button>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl overflow-x-auto"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.slice(0, 3)}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="p-6 rounded-2xl min-h-[300px]"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
