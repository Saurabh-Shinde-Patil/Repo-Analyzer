const express = require('express');
const router = express.Router();
const { subscribe, getUserPlan } = require('../controllers/subscription.controller');

// POST /api/subscribe — Create or update subscription
router.post('/', subscribe);

// GET /api/subscribe/:userId — Get current plan for a user
router.get('/:userId', getUserPlan);

module.exports = router;
