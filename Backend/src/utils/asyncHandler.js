/**
 * Wraps an async route handler so any thrown error (or rejected promise)
 * is automatically passed to next(err), landing in errorHandler.js,
 * instead of needing a try/catch in every single controller function.
 *
 * Usage:
 *   router.get('/jobs', asyncHandler(async (req, res) => {
 *     const jobs = await Job.find();
 *     res.success(jobs);
 *   }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
