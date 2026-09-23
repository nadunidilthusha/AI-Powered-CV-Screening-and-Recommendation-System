const express = require('express');
const router = express.Router();
const { makeDecision } = require('../controllers/aiAgent03Controller');

// POST /api/ai/decision
router.post('/decision', makeDecision);

module.exports = router;