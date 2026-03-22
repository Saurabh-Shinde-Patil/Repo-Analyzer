import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const buildTree = (paths) => {
  const root = { name: 'root', type: 'folder', children: {}, path: '' };

  paths.forEach((item) => {
    // some items in treeData might lack a path, or just be root
    if (!item.path) return;
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          type: index === parts.length - 1 && item.type === 'blob' ? 'file' : 'folder',
          children: {},
          path: parts.slice(0, index + 1).join('/'),
        };
      }
      current = current.children[part];
    });
  });

  return root;
};

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // open root level by default
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && Object.keys(node.children).length > 0;

  const toggleOpen = () => {
    if (isFolder) setIsOpen(!isOpen);
  };

  if (node.name === 'root') {
    return (
      <div className="flex flex-col w-full text-sm font-mono">
        {Object.values(node.children).sort((a,b) => a.type === 'folder' ? -1 : 1).map((child) => (
          <TreeNode key={child.path} node={child} level={level} />
        ))}
      </div>
    );
  }

  return (
    <div className="select-none flex flex-col w-full">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer rounded-md transition-colors duration-200 group`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={toggleOpen}
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-400 dark:text-slate-500">
          {isFolder ? (
            isOpen ? <ChevronDown size={14} className="group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" /> 
                   : <ChevronRight size={14} className="group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          ) : (
            <div className="w-4" />
          )}
        </div>
        
        {isFolder ? (
          <Folder size={16} className={`${isOpen ? 'text-blue-500' : 'text-slate-400'} drop-shadow-sm transition-colors`} fill={isOpen ? "currentColor" : "none"} />
        ) : (
          <File size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
        )}
        
        <span className={`${isFolder ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300'} text-[13px] truncate`}>
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && hasChildren && (
        <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 ml-[14px]">
          {Object.values(node.children).sort((a,b) => a.type === 'folder' ? -1 : 1).map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function GitHubTree({ fileTree }) {
  if (!fileTree || fileTree.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400 italic text-sm p-4">No file tree data available.</p>;
  }

  const root = buildTree(fileTree);

  return (
    <div className="bg-[#f6f8fa] dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
      <div className="bg-slate-100 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
        <Folder size={18} className="text-slate-600 dark:text-slate-400" />
        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Repository Structure</span>
      </div>
      <div className="p-2 overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
        <TreeNode node={root} />
      </div>
    </div>
  );
}
