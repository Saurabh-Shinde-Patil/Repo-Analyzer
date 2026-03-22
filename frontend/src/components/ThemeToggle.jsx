import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md hover:scale-110 transition-all z-50 text-slate-800 dark:text-brand-light"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
    </button>
  );
}
