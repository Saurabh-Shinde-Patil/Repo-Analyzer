const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const analyzeRepository = async (githubUrl, provider) => {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ githubUrl, provider }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to analyze repository');
  }
  // Attach the original URL so the Explorer tab can fetch file contents
  return { ...data.data, repoUrl: githubUrl };
};

export const getFileContent = async (githubUrl, filePath) => {
  const response = await fetch(
    `${API_URL}/api/analyze/file?githubUrl=${encodeURIComponent(githubUrl)}&filePath=${encodeURIComponent(filePath)}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch file content');
  }
  return data.data;
};

export const getRepoStats = async (githubUrl) => {
  const response = await fetch(
    `${API_URL}/api/analyze/stats?githubUrl=${encodeURIComponent(githubUrl)}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch repo stats');
  return data.data;
};

export const getReadme = async (githubUrl) => {
  const response = await fetch(
    `${API_URL}/api/analyze/readme?githubUrl=${encodeURIComponent(githubUrl)}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch README');
  return data.data;
};
