import { AnimatePresence, motion } from 'framer-motion';
import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';
import LoadingAnalysis from '../components/LoadingAnalysis';
import FeaturesSection from '../components/FeaturesSection';
import RepoStatsBar from '../components/RepoStatsBar';
import RecentRepos, { saveRecentRepo } from '../components/RecentRepos';
import { useAnalysis } from '../hooks/useAnalysis';
import { useEffect } from 'react';

export default function Home() {
  const {
    analysisResult,
    isLoading,
    error,
    currentUrl,
    currentProvider,
    handleAnalyze,
    resetAnalysis,
  } = useAnalysis();

  const showFeatures = !analysisResult && !isLoading;

  // Save to recent repos whenever analysis succeeds
  useEffect(() => {
    if (analysisResult && currentUrl) {
      saveRecentRepo(currentUrl);
    }
  }, [analysisResult, currentUrl]);

  const handleSelectRecent = (url) => {
    handleAnalyze(url, currentProvider || 'groq');
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Hero — hide once results are in */}
      <AnimatePresence>
        {!analysisResult && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <Hero onAnalyze={handleAnalyze} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent repos (show only on landing when not loading) */}
      <AnimatePresence>
        {!analysisResult && !isLoading && (
          <motion.div
            key="recent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <RecentRepos onSelect={handleSelectRecent} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl text-sm max-w-2xl"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: '#FCA5A5',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: 1, opacity: 0.6 }}>ERR</span>
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingAnalysis repoUrl={currentUrl} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysisResult && !isLoading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 w-full"
          >
            {/* Stats bar */}
            <RepoStatsBar githubUrl={currentUrl} />

            {/* Dashboard + Chatbot */}
            <div className="flex flex-col xl:flex-row xl:items-start gap-5 w-full">
              <div className="flex-1 min-w-0">
                <Dashboard data={analysisResult} onReset={resetAnalysis} />
              </div>
              <div
                className="w-full xl:w-[400px] 2xl:w-[440px] shrink-0 xl:sticky xl:top-20"
                style={{ height: 'min(640px, 82vh)' }}
              >
                <Chatbot repositoryUrl={currentUrl} provider={currentProvider} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features section — only on landing */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            key="features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FeaturesSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
