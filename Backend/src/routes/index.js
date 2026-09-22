const express = require('express');
const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const candidateRoutes = require('./candidateRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/candidates', candidateRoutes);
router.use('/admin', adminRoutes);

// --- AI Agent Routes ---
router.use('/ai', require('./aiRoutes'));         // Agent 01: PDF Extraction
router.use('/ai', require('./aiAgent02Routes'));  // Agent 02: HR Evaluator
router.use('/ai', require('./aiAgent03Routes'));  // Agent 03: Decision Maker

module.exports = router;