/**
 * Sends a consistently-shaped success response.
 * res.success({ jobs }, 'Jobs fetched successfully')
 */
function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Attaches `res.success(...)` to every response so controllers don't
 * need to import this helper individually.
 */
const attachResponseHelpers = (req, res, next) => {
  res.success = (data, message, statusCode) => successResponse(res, data, message, statusCode);
  next();
};

module.exports = { successResponse, attachResponseHelpers };
