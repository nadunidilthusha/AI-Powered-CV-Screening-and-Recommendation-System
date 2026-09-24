const express = require('express');
const router = express.Router();
const uploadCv = require('../middleware/uploadMiddleware'); // Using your team's file
const { extractCVText } = require('../controllers/aiAgentController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists

// The route expects a file uploaded with the field name 'cv'
router.post('/extract', uploadCv.single('cv'), extractCVText);

module.exports = router;