const express = require('express');
const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const candidateRoutes = require('./candidateRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes); // also handles nested /jobs/:jobId/cvs, /candidates, /ranking, /export/*
router.use('/candidates', candidateRoutes); // for direct /candidates/:id access
router.use('/admin', adminRoutes);

module.exports = router;
