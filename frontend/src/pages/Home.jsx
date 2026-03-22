import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
import { useAnalysis } from '../hooks/useAnalysis';

export default function Home() {
  const { analysisResult, isLoading, error, handleAnalyze, resetAnalysis } = useAnalysis();

  return (
    <>
      {/* Header / Hero Section */}
      <Hero onAnalyze={handleAnalyze} isLoading={isLoading} />
      
      {/* Error State */}
      {error && (
        <div className="glass-panel p-6 border-red-500/30 text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Results Dashboard */}
      {analysisResult && !isLoading && (
        <Dashboard data={analysisResult} onReset={resetAnalysis} />
      )}
    </>
  );
}
