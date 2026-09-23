const express = require('express');

const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const candidateRoutes = require('./candidateRoutes');
const adminRoutes = require('./adminRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const aiRoutes = require('./aiRoutes');
const aiAgent02Routes = require('./aiAgent02Routes');
const aiAgent03Routes = require('./aiAgent03Routes');

const router = express.Router();

/*
  Health check
*/
router.get('/health', (req, res) =>
  res.json({
    success: true,
    message: 'API is running',
  })
);

/*
  Authentication
*/
router.use('/auth', authRoutes);

/*
  Jobs
*/
router.use('/jobs', jobRoutes);

/*
  Candidates
*/
router.use('/candidates', candidateRoutes);

/*
  Dashboard
*/
router.use('/dashboard', dashboardRoutes);

/*
  Admin
*/
router.use('/admin', adminRoutes);

/*
  AI Agents

  Agent 01 - PDF extraction
  Agent 02 - HR evaluation
  Agent 03 - Decision maker
*/
router.use('/ai', aiRoutes);
router.use('/ai', aiAgent02Routes);
router.use('/ai', aiAgent03Routes);

module.exports = router;