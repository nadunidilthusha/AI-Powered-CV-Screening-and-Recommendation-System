const express = require('express');
const { getCandidateRanking, exportCsv, exportPdf } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// mergeParams: true so this router can read :jobId from the parent route
// it gets mounted under in routes/index.js (e.g. /jobs/:jobId/ranking)
const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/ranking', getCandidateRanking);
router.get('/export/csv', exportCsv);
router.get('/export/pdf', exportPdf);

module.exports = router;
