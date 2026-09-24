const express = require('express');
const router = express.Router();
const { evaluateCandidate } = require('../controllers/aiAgent02Controller');

// POST /api/ai/evaluate
router.post('/evaluate', evaluateCandidate);

module.exports = router;