import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';
import { useAnalysis } from '../hooks/useAnalysis';

export default function Home() {
  const { analysisResult, isLoading, error, currentUrl, currentProvider, handleAnalyze, resetAnalysis } = useAnalysis();

  return (
    <>
      {/* Header / Hero Section */}
      <Hero onAnalyze={handleAnalyze} isLoading={isLoading} />
      
      {/* Error State */}
      {error && (
        <div className="glass-panel max-w-4xl mx-auto mt-8 p-6 border-red-500/30 text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 rounded-2xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Results & Chatbot Container */}
      {analysisResult && !isLoading && (
        <div className="flex flex-col xl:flex-row xl:items-start gap-6 lg:gap-8 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Dashboard Panel */}
          <div className="flex-1 min-w-0">
            <Dashboard data={analysisResult} onReset={resetAnalysis} />
          </div>

          {/* Fixed Side Panel for Chatbot */}
          <div className="w-full xl:w-[420px] 2xl:w-[480px] shrink-0 h-[600px] xl:h-[calc(100vh-140px)] xl:sticky xl:top-[100px] z-10 hidden md:block">
            <Chatbot repositoryUrl={currentUrl} provider={currentProvider} />
          </div>
          
          {/* Mobile floating Chatbot placeholder - currently renders inline on small screens */}
          <div className="w-full h-[500px] md:hidden">
            <Chatbot repositoryUrl={currentUrl} provider={currentProvider} />
          </div>

        </div>
      )}
    </>
  );
}
