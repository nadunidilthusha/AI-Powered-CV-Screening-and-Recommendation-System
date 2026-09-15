const express = require('express');
const {
  getCandidateById,
  getAIRecommendation,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Note: GET /jobs/:jobId/candidates is mounted under jobRoutes.js instead,
// since it's nested under a job. This router only holds the routes that
// address a candidate directly by its own id.
router.get('/:id', getCandidateById);
router.get('/:id/recommendation', getAIRecommendation);

module.exports = router;
