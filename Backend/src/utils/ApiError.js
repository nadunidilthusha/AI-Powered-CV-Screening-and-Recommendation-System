/**
 * Throw this anywhere in a controller/service instead of a plain Error
 * when you know the HTTP status code the failure should map to.
 * e.g. throw new ApiError(404, 'Job not found');
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
