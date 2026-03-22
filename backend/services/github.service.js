const axios = require('axios');
const AppError = require('../utils/AppError');

class GitHubService {
  constructor() {
    this.apiBase = 'https://api.github.com';
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Codebase-Intelligence-Agent'
    };
    if (process.env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN.includes('your_')) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
  }

  // Parses GitHub URL to extract owner and repo name
  parseRepoUrl(url) {
    try {
      const regex = /github\.com\/([^\/]+)\/([^\/\.]+)/;
      const match = url.match(regex);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }
      return { owner: match[1], repo: match[2] };
    } catch (error) {
      throw new AppError('Could not parse GitHub URL. Please ensure it is a valid repository link.', 400);
    }
  }

  // Fetches the default branch of the repository
  async getDefaultBranch(owner, repo) {
    try {
      const response = await axios.get(`${this.apiBase}/repos/${owner}/${repo}`, {
        headers: this.getHeaders()
      });
      return response.data.default_branch;
    } catch (error) {
      throw new AppError('Failed to fetch repository details. Check if the repo is public or if the URL is correct.', 404);
    }
  }

  // Fetches the entire repository tree recursively
  async getRepoTree(owner, repo, branch) {
    try {
      const response = await axios.get(`${this.apiBase}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: this.getHeaders()
      });
      return response.data.tree;
    } catch (error) {
      throw new AppError('Failed to fetch repository tree.', 500);
    }
  }

  // Fetches raw content of a specific file
  async getFileContent(owner, repo, branch, filePath) {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`, {
        headers: this.getHeaders()
      });
      // Handle cases where response might not be a string (e.g., JSON files returned as objects by axios)
      if (typeof response.data === 'object') {
         return JSON.stringify(response.data, null, 2);
      }
      return response.data;
    } catch (error) {
      throw new AppError(`Failed to fetch content for file: ${filePath}`, 404);
    }
  }
}

module.exports = new GitHubService();
