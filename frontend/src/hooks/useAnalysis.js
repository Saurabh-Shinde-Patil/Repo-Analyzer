import { useState } from 'react';
import { analyzeRepository } from '../services/api';

export const useAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');

  const handleAnalyze = async (url, provider) => {
    setIsLoading(true);
    setError(null);
    setCurrentUrl(url);
    setCurrentProvider(provider);
    setAnalysisResult(null);
    try {
      const data = await analyzeRepository(url, provider);
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    setCurrentUrl('');
    setCurrentProvider('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    analysisResult,
    isLoading,
    error,
    currentUrl,
    currentProvider,
    handleAnalyze,
    resetAnalysis,
  };
};
