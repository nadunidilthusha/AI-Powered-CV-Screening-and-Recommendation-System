const express = require('express');

const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const candidateRoutes = require('./candidateRoutes');
const adminRoutes = require('./adminRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

/*
  Health check
*/
router.get(
  '/health',
  (req, res) =>
    res.json({
      success: true,
      message: 'API is running',
    })
);

/*
  Authentication routes
*/
router.use(
  '/auth',
  authRoutes
);

/*
  Job routes
*/
router.use(
  '/jobs',
  jobRoutes
);

/*
  Candidate routes
*/
router.use(
  '/candidates',
  candidateRoutes
);

/*
  Dashboard routes

  Available endpoints:

  GET /api/dashboard
  GET /api/dashboard/statistics
  GET /api/dashboard/candidate-statistics
  GET /api/dashboard/processing-status
  GET /api/dashboard/top-candidates
*/
router.use(
  '/dashboard',
  dashboardRoutes
);

/*
  Admin routes
*/
router.use(
  '/admin',
  adminRoutes
);

module.exports = router;