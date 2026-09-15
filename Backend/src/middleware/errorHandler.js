const env = require('../config/env');

/**
 * Centralized error handler. Every thrown error in the app — from
 * routes, controllers, services, or asyncHandler-wrapped functions —
 * ends up here instead of crashing the process or leaking a stack
 * trace to the client.
 *
 * Must be registered LAST in app.js, after all routes and after notFound.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Common Mongoose/JWT error shapes get translated into clean,
  // consistent API responses instead of leaking internal error text.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  // Log unexpected (non-operational) errors with full detail server-side,
  // even though the client only ever sees the clean message above.
  if (!err.isOperational) {
    // eslint-disable-next-line no-console
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    // Stack traces are only useful (and safe) in development.
    stack: env.nodeEnv === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
