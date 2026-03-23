const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');

// POST /api/analyze
router.post('/', analyzeController.analyzeRepo);

// POST /api/analyze/chat
router.post('/chat', analyzeController.chatRepo);

// GET /api/analyze/file?githubUrl=...&filePath=...
router.get('/file', analyzeController.getFileContent);

// GET /api/analyze/stats?githubUrl=...
router.get('/stats', analyzeController.getRepoStats);

// GET /api/analyze/readme?githubUrl=...
router.get('/readme', analyzeController.getReadme);

module.exports = router;
