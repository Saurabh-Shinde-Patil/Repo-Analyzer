import { useState } from 'react';
import { analyzeRepository } from '../services/api';

export const useAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (url, provider) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeRepository(url, provider);
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { analysisResult, isLoading, error, handleAnalyze, resetAnalysis };
};
