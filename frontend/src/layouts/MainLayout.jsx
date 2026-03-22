import ThemeToggle from '../components/ThemeToggle';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col items-center relative overflow-hidden transition-colors duration-500">
      <ThemeToggle />
      
      {/* Clean Professional Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Top center radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[100px] bg-gradient-to-b from-emerald-500/[0.07] dark:from-emerald-500/[0.12] to-transparent" />
        {/* Horizontal accent line */}
        <div className="absolute top-[50vh] left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-white/[0.06] to-transparent" />
      </div>

      <main className="w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-12 flex flex-col gap-6 sm:gap-12 flex-1 relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-slate-500 dark:text-brand-light/50 border-t border-slate-200 dark:border-white/5 mt-auto relative z-10 transition-colors duration-500">
        <p>Built with MERN Stack • Codebase Intelligence Agent</p>
      </footer>
    </div>
  );
}
