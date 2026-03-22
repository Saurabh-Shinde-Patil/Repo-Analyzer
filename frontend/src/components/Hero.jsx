import { useState } from 'react';
import { Search, Loader2, Github, Code2 } from 'lucide-react';

export default function Hero({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('groq');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), provider);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-6 sm:py-10 px-4 sm:px-0">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-base/50 border border-brand-accent/30 text-brand-accent text-xs sm:text-sm font-medium mb-2 sm:mb-4">
        <Code2 size={14} className="sm:w-4 sm:h-4" />
        <span>AI-Powered Repository Analysis</span>
      </div>
      
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
        Stop reading Repository. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Start understanding it.</span>
      </h1>
      
      <p className="max-w-2xl text-sm sm:text-base md:text-[18px] text-slate-600 dark:text-gray-400 font-medium leading-relaxed tracking-wide transition-colors duration-500">
        Paste a GitHub link and I'll explain the Repository for you
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-4 sm:mt-8 relative group">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:bg-emerald-400/30 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-2 gap-2 sm:gap-0 glass-panel !rounded-2xl !bg-white/90 dark:!bg-[#0f172a]/90 border-2 border-slate-300 dark:border-emerald-500/40 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          
          {/* URL Input */}
          <div className="relative flex-1 flex items-center">
            <Github className="absolute left-4 text-slate-400 dark:text-gray-400 transition-colors" size={20} />
            <input
              type="url"
              required
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-none text-slate-800 dark:text-white pl-12 pr-2 py-3 sm:py-4 text-sm sm:text-lg focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-brand-light/30 transition-colors duration-500"
            />
          </div>

          {/* Provider + Button Row */}
          <div className="flex items-center gap-2">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={isLoading}
              className="bg-slate-100/80 dark:bg-[#1F2833]/80 text-slate-800 dark:text-brand-light border border-slate-200 sm:border-l sm:border-y-0 sm:border-r-0 dark:border-white/10 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-none focus:outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1F2833] transition-colors appearance-none text-sm sm:text-base flex-1 sm:flex-none"
              style={{ WebkitAppearance: 'none' }}
            >
              <option value="groq">Groq (Llama 3)</option>
              <option value="llama">Llama 3.1 70B</option>
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (GPT-4o)</option>
            </select>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="primary-btn h-11 sm:h-12 flex items-center justify-center gap-2 min-w-[110px] sm:min-w-[140px] text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="hidden sm:inline">Analyzing</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
