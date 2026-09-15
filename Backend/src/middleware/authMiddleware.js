const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Verifies the Bearer token on the Authorization header and attaches
 * the corresponding user document to req.user. This is the backend
 * equivalent of the frontend's ProtectedRoute — every route that needs
 * a logged-in user should use this middleware.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret); // throws JsonWebTokenError/TokenExpiredError on failure

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new ApiError(401, 'Not authorized — user no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
