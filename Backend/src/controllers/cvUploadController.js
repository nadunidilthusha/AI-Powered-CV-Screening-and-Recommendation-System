const asyncHandler = require('../utils/asyncHandler');

// @route  POST /api/jobs/:jobId/cvs
// @access Private
// TODO: accept one or more uploaded PDF files (see middleware/uploadMiddleware.js),
// create a Candidate record per file, and enqueue each for AI screening
// (see services/aiService.js and the bullmq dependency already installed).
const uploadCvs = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement uploadCvs', 201);
});

// @route  GET /api/jobs/:jobId/cvs/status
// @access Private
// TODO: return the processing status of each candidate uploaded for this
// job (Pending / Processing / Completed / Failed), so the frontend can
// poll this while the AI pipeline runs.
const getUploadStatus = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getUploadStatus');
});

module.exports = { uploadCvs, getUploadStatus };
