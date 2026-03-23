const analysisService = require('../services/analysis.service');
const chatService = require('../services/chat.service');
const githubService = require('../services/github.service');
const AppError = require('../utils/AppError');

exports.analyzeRepo = async (req, res, next) => {
  try {
    const { githubUrl, provider } = req.body;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }
    const result = await analysisService.analyzeRepository(githubUrl, provider);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

exports.chatRepo = async (req, res, next) => {
  try {
    const { githubUrl, provider, question, history } = req.body;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }
    if (!question) {
      return next(new AppError('Please provide a question', 400));
    }
    const result = await chatService.chatWithRepo(
      githubUrl,
      provider,
      question,
      Array.isArray(history) ? history : []
    );
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/analyze/file?githubUrl=...&filePath=...
exports.getFileContent = async (req, res, next) => {
  try {
    const { githubUrl, filePath } = req.query;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }
    if (!filePath) {
      return next(new AppError('Please provide a filePath', 400));
    }
    const { owner, repo } = githubService.parseRepoUrl(githubUrl);
    const branch = await githubService.getDefaultBranch(owner, repo);
    const content = await githubService.getFileContent(owner, repo, branch, filePath);
    res.status(200).json({ status: 'success', data: { content, filePath, owner, repo } });
  } catch (error) {
    next(error);
  }
};

// GET /api/analyze/stats?githubUrl=...
exports.getRepoStats = async (req, res, next) => {
  try {
    const { githubUrl } = req.query;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }
    const { owner, repo } = githubService.parseRepoUrl(githubUrl);
    const stats = await githubService.getRepoStats(owner, repo);
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};

// GET /api/analyze/readme?githubUrl=...
exports.getReadme = async (req, res, next) => {
  try {
    const { githubUrl } = req.query;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }
    const { owner, repo } = githubService.parseRepoUrl(githubUrl);
    const branch = await githubService.getDefaultBranch(owner, repo);
    const readme = await githubService.getReadme(owner, repo, branch);
    res.status(200).json({ status: 'success', data: readme });
  } catch (error) {
    next(error);
  }
};
