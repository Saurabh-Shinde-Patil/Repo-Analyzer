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
      if (typeof response.data === 'object') {
         return JSON.stringify(response.data, null, 2);
      }
      return response.data;
    } catch (error) {
      throw new AppError(`Failed to fetch content for file: ${filePath}`, 404);
    }
  }

  // Fetches public repository stats (stars, forks, language, etc.)
  async getRepoStats(owner, repo) {
    try {
      const response = await axios.get(`${this.apiBase}/repos/${owner}/${repo}`, {
        headers: this.getHeaders()
      });
      const d = response.data;
      return {
        fullName: d.full_name,
        description: d.description,
        stars: d.stargazers_count,
        forks: d.forks_count,
        watchers: d.watchers_count,
        openIssues: d.open_issues_count,
        language: d.language,
        topics: d.topics || [],
        defaultBranch: d.default_branch,
        updatedAt: d.updated_at,
        pushedAt: d.pushed_at,
        size: d.size,
        license: d.license ? d.license.spdx_id : null,
        homepage: d.homepage || null,
        visibility: d.visibility,
      };
    } catch (error) {
      throw new AppError('Failed to fetch repository stats.', 404);
    }
  }

  // Fetches README content (tries common filenames)
  async getReadme(owner, repo, branch) {
    const candidates = ['README.md', 'readme.md', 'Readme.md', 'README.MD', 'README.rst', 'README.txt', 'README'];
    for (const name of candidates) {
      try {
        const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`, {
          headers: this.getHeaders()
        });
        return { content: response.data, filename: name };
      } catch {
        // try next
      }
    }
    return { content: null, filename: null };
  }
}

module.exports = new GitHubService();
