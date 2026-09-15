const ApiError = require('../utils/ApiError');

/**
 * Runs when a request doesn't match any route. Converts it into an
 * ApiError so it flows into the same centralized errorHandler as
 * every other error, instead of falling through to Express's default
 * HTML error page.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
