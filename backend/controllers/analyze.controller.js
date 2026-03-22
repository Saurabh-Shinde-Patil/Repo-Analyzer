const analysisService = require('../services/analysis.service');
const AppError = require('../utils/AppError');

exports.analyzeRepo = async (req, res, next) => {
  try {
    const { githubUrl, provider } = req.body;

    if (!githubUrl || !githubUrl.includes('github.com')) {
      return next(new AppError('Please provide a valid GitHub repository URL', 400));
    }

    const result = await analysisService.analyzeRepository(githubUrl, provider);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
