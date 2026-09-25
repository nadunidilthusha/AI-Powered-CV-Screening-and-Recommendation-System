const express = require('express');
const router = express.Router();
const uploadCv = require('../middleware/uploadMiddleware');
const { extractCVText } = require('../controllers/aiAgentController');

router.post(
  '/extract',
  (req, res, next) => {
    console.log('=== /extract request ===');
    console.log('Content-Type:', req.headers['content-type']);
    next();
  },
  uploadCv.single('cv'),
  extractCVText
);

module.exports = router;