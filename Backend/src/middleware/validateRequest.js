const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an express-validator chain (see /validators). Collects any
 * validation failures and converts them into a single 400 ApiError with
 * a details array — same shape as any other validation error in the app.
 *
 * Usage:
 *   router.post('/jobs', validateJobCreate, validateRequest, createJob);
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  next();
};

module.exports = validateRequest;
