import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Folder, FolderOpen, File, ChevronRight, ChevronDown,
  Copy, Check, Loader2, X, Code2, Info
} from 'lucide-react';

// ── Language detection ──────────────────────────────────────────────────────
const EXT_LANG = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java', kt: 'kotlin',
  cs: 'csharp', cpp: 'cpp', c: 'c', h: 'c', php: 'php', swift: 'swift',
  html: 'html', htm: 'html', css: 'css', scss: 'scss', sass: 'scss',
  json: 'json', yaml: 'yaml', yml: 'yaml', toml: 'ini', xml: 'xml',
  md: 'markdown', mdx: 'markdown', sh: 'bash', bash: 'bash', zsh: 'bash',
  sql: 'sql', graphql: 'graphql', env: 'ini', gitignore: 'ini', dockerfile: 'dockerfile',
};
const ICON_COLOR = {
  js: '#F7DF1E', jsx: '#61DAFB', ts: '#3178C6', tsx: '#61DAFB',
  py: '#3776AB', rb: '#CC342D', go: '#00ADD8', rs: '#CE422B',
  java: '#ED8B00', json: '#CBCB41', md: '#519ABA', css: '#264DE4',
  html: '#E34C26', yaml: '#CB171E', yml: '#CB171E', sh: '#4EAA25',
  sql: '#F29111',
};

function getExt(name) {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}
function getLang(name) { return EXT_LANG[getExt(name)] || 'text'; }
function getFileColor(name) { return ICON_COLOR[getExt(name)] || '#64748B'; }

// ── Tree builder ─────────────────────────────────────────────────────────────
function buildTree(items) {
  const root = { name: 'root', type: 'folder', children: {}, path: '' };
  items.forEach((item) => {
    if (!item.path) return;
    const parts = item.path.split('/');
    let cur = root;
    parts.forEach((part, idx) => {
      if (!cur.children[part]) {
        cur.children[part] = {
          name: part,
          type: idx === parts.length - 1 && item.type === 'blob' ? 'file' : 'folder',
          children: {},
          path: parts.slice(0, idx + 1).join('/'),
        };
      }
      cur = cur.children[part];
    });
  });
  return root;
}

// ── Tree Node ────────────────────────────────────────────────────────────────
function TreeNode({ node, level = 0, onFileSelect, selectedPath }) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && Object.keys(node.children).length > 0;
  const isSelected = !isFolder && node.path === selectedPath;

  if (node.name === 'root') {
    return (
      <div className="flex flex-col text-sm font-mono">
        {Object.values(node.children)
          .sort((a, b) => a.type === 'folder' ? -1 : 1)
          .map(child => (
            <TreeNode key={child.path} node={child} level={level} onFileSelect={onFileSelect} selectedPath={selectedPath} />
          ))}
      </div>
    );
  }

  const fileColor = !isFolder ? getFileColor(node.name) : undefined;

  return (
    <div className="flex flex-col">
      <div
        onClick={() => isFolder ? setIsOpen(o => !o) : onFileSelect?.(node.path)}
        className="flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer select-none transition-colors duration-150 group"
        style={{
          paddingLeft: `${level * 14 + 8}px`,
          background: isSelected ? 'rgba(99,102,241,0.15)' : 'transparent',
          borderLeft: isSelected ? '2px solid #6366F1' : '2px solid transparent',
        }}
        onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
        onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
      >
        {/* Chevron */}
        <span style={{ color: '#334155', width: 14 }}>
          {isFolder ? (
            isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />
          ) : null}
        </span>

        {/* Icon */}
        {isFolder ? (
          isOpen
            ? <FolderOpen size={15} style={{ color: '#F59E0B', flexShrink: 0 }} />
            : <Folder size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
        ) : (
          <File size={14} style={{ color: fileColor, flexShrink: 0 }} />
        )}

        {/* Name */}
        <span
          className="truncate text-xs"
          style={{
            color: isSelected ? '#A5B4FC' : isFolder ? '#CBD5E1' : '#94A3B8',
            fontWeight: isFolder ? 600 : 400,
          }}
        >
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && hasChildren && (
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.04)', marginLeft: `${level * 14 + 18}px` }}>
          {Object.values(node.children)
            .sort((a, b) => a.type === 'folder' ? -1 : 1)
            .map(child => (
              <TreeNode key={child.path} node={child} level={level + 1} onFileSelect={onFileSelect} selectedPath={selectedPath} />
            ))}
        </div>
      )}
    </div>
  );
}

// ── File Viewer ───────────────────────────────────────────────────────────────
function FileViewer({ filePath, content, isLoading, error, onClose }) {
  const [copied, setCopied] = useState(false);
  const fileName = filePath ? filePath.split('/').pop() : '';
  const lang = filePath ? getLang(fileName) : 'text';
  const lineCount = content ? content.split('\n').length : 0;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* File header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#161B22' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {filePath ? (
            <>
              <File size={14} style={{ color: getFileColor(fileName), flexShrink: 0 }} />
              <span
                className="text-xs font-mono truncate"
                style={{ color: '#CBD5E1' }}
                title={filePath}
              >
                {filePath}
              </span>
              {lineCount > 0 && (
                <span className="text-xs shrink-0" style={{ color: '#334155' }}>
                  {lineCount} lines
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
              <Code2 size={14} />
              <span>Click a file to view its contents</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {content && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: copied ? '#10B981' : '#64748B',
              }}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          )}
          {filePath && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg"
              style={{ color: '#334155' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
              onMouseLeave={e => e.currentTarget.style.color = '#334155'}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {isLoading && (
          <div className="flex items-center justify-center gap-3 h-40" style={{ color: '#475569' }}>
            <Loader2 size={20} className="animate-spin" style={{ color: '#6366F1' }} />
            <span className="text-sm">Fetching file content...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-6 text-sm" style={{ color: '#FCA5A5' }}>
            <Info size={16} />
            {error}
          </div>
        )}
        {!isLoading && !error && content && (
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            showLineNumbers
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: '16px',
              background: 'transparent',
              fontSize: '12px',
              lineHeight: '1.6',
            }}
            lineNumberStyle={{ color: '#30363D', marginRight: '16px', minWidth: '32px' }}
          >
            {content}
          </SyntaxHighlighter>
        )}
        {!isLoading && !error && !content && !filePath && (
          <div
            className="flex flex-col items-center justify-center h-full gap-4 text-center p-8"
            style={{ color: '#1E293B' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Code2 size={28} style={{ color: '#1E293B' }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#334155' }}>No file selected</p>
              <p className="text-xs" style={{ color: '#1E293B' }}>Click any file in the tree to view its source code</p>
            </div>
          </div>
        )}
      </div>

      {/* Language badge */}
      {content && (
        <div
          className="px-4 py-2 flex items-center justify-between text-xs shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#161B22', color: '#334155' }}
        >
          <span className="font-mono">{lang}</span>
          <span>{(content.length / 1024).toFixed(1)} KB</span>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GitHubTree({ fileTree, m1, githubUrl }) {
  const [selectedPath, setSelectedPath] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState(null);

  const handleFileSelect = useCallback(async (path) => {
    if (path === selectedPath) return;
    setSelectedPath(path);
    setFileContent(null);
    setFileError(null);
    setIsLoadingFile(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${API_URL}/api/analyze/file?githubUrl=${encodeURIComponent(githubUrl || '')}&filePath=${encodeURIComponent(path)}`
      );
      const json = await res.json();
      if (json.status === 'success') {
        setFileContent(json.data.content);
      } else {
        setFileError('Could not load file content.');
      }
    } catch {
      setFileError('Network error — could not fetch file content.');
    } finally {
      setIsLoadingFile(false);
    }
  }, [selectedPath, githubUrl]);

  const handleClose = () => {
    setSelectedPath(null);
    setFileContent(null);
    setFileError(null);
  };

  // Build tree from fileTree OR fall back to m1 paths
  const hasTree = fileTree && fileTree.length > 0;
  const hasGithubUrl = !!githubUrl;

  if (!hasTree && (!m1 || m1.length === 0)) {
    return (
      <p className="text-sm italic" style={{ color: '#334155' }}>No file tree data available.</p>
    );
  }

  const root = hasTree ? buildTree(fileTree) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Info bar */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
        <Info size={13} />
        <span>
          {hasGithubUrl
            ? 'Click any file to view its source code below'
            : 'Connect with a GitHub URL to enable file viewing'
          }
        </span>
        {selectedPath && (
          <span className="ml-auto font-mono" style={{ color: '#475569' }}>{selectedPath}</span>
        )}
      </div>

      {/* Split pane */}
      <div className="flex flex-col lg:flex-row gap-3" style={{ minHeight: '500px' }}>
        {/* File tree */}
        <div
          className="lg:w-72 xl:w-80 shrink-0 overflow-auto rounded-xl custom-scrollbar"
          style={{
            background: '#0D1117',
            border: '1px solid rgba(255,255,255,0.07)',
            maxHeight: '600px',
          }}
        >
          {/* Tree header */}
          <div
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold sticky top-0 z-10"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: '#161B22',
              color: '#64748B',
            }}
          >
            <Folder size={14} />
            <span>EXPLORER</span>
          </div>
          <div className="p-2">
            {root ? (
              <TreeNode
                node={root}
                onFileSelect={hasGithubUrl ? handleFileSelect : undefined}
                selectedPath={selectedPath}
              />
            ) : (
              <div className="flex flex-col gap-2 p-2">
                {m1?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md text-xs"
                    style={{ color: '#64748B' }}
                  >
                    <Folder size={13} style={{ color: '#94A3B8' }} />
                    <span className="font-mono">{item.folder}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File viewer */}
        <div className="flex-1 min-w-0" style={{ minHeight: '500px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPath || 'empty'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
              style={{ minHeight: '500px' }}
            >
              <FileViewer
                filePath={selectedPath}
                content={fileContent}
                isLoading={isLoadingFile}
                error={fileError}
                onClose={handleClose}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
