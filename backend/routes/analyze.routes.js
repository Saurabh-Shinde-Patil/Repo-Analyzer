const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');

// POST /api/analyze
router.post('/', analyzeController.analyzeRepo);

module.exports = router;
