const express = require('express');

const {
  getDashboardOverview,
  getDashboardStatistics,
  getCandidateStatistics,
  getProcessingStatus,
  getTopCandidates,
} = require('../controllers/dashboardController');

const {
  protect,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
  All Dashboard APIs require authentication.
*/
router.use(protect);

/*
  Complete Dashboard data
  GET /api/dashboard
*/
router.get(
  '/',
  getDashboardOverview
);

/*
  Statistics Cards + Job Statistics
  GET /api/dashboard/statistics
*/
router.get(
  '/statistics',
  getDashboardStatistics
);

/*
  Candidate Statistics
  GET /api/dashboard/candidate-statistics
*/
router.get(
  '/candidate-statistics',
  getCandidateStatistics
);

/*
  Processing Status
  GET /api/dashboard/processing-status
*/
router.get(
  '/processing-status',
  getProcessingStatus
);

/*
  Top Candidates
  GET /api/dashboard/top-candidates
*/
router.get(
  '/top-candidates',
  getTopCandidates
);

module.exports = router;