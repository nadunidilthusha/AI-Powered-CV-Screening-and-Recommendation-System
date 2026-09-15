const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General API rate limiter — applied globally in app.js.
 */
const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please try again later.',
  },
});

/**
 * Stricter limiter specifically for auth endpoints (login/register),
 * since brute-forcing credentials is the highest-value target to slow down.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts — please try again in 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
