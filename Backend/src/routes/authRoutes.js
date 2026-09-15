const express = require('express');
const { register, login, forgotPassword, logout, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
