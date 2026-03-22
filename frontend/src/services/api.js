export const analyzeRepository = async (githubUrl, provider) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ githubUrl, provider }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to analyze repository');
  }
  
  return data.data;
};
