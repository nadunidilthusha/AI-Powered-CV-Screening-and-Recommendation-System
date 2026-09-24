const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const aiService = require('../services/aiService');

// @route  POST /api/ai/extract
// @access Private (HR/Admin)
//
// Diagnostic endpoint. Accepts a CV upload, optionally tagged with a jobId.
// If jobId is provided, the real Job's description and requiredSkills are
// used. Otherwise, the caller must supply jobDescription + requiredSkills
// explicitly in the form fields.
const extractCVText = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please upload a PDF CV file');

  let jobDescription = (req.body.jobDescription || '').trim();
  let requiredSkills = [];

  // Preferred path: load context from a real Job document
  if (req.body.jobId) {
    if (!mongoose.Types.ObjectId.isValid(req.body.jobId)) {
      throw new ApiError(400, 'Invalid jobId');
    }
    const job = await Job.findById(req.body.jobId);
    if (!job) throw new ApiError(404, 'Job not found');
    jobDescription = job.description || '';
    requiredSkills = job.requiredSkills || [];
  } else if (req.body.requiredSkills) {
    // Fallback: comma-separated string from the form
    requiredSkills = String(req.body.requiredSkills)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!jobDescription || jobDescription.length < 20) {
    throw new ApiError(
      400,
      'Provide a jobId, or a jobDescription of at least 20 characters'
    );
  }

  try {
    const result = await aiService.screenCandidate({
      filePath: req.file.path,
      jobDescription,
      requiredSkills,
    });

    res.success(
      { extractedData: result, cvUrl: req.file.path },
      'CV successfully processed by AI Pipeline'
    );
} catch (error) {
  console.error('=== AI Microservice call failed ===');
  console.error('Message:', error.message);
  // The raw axios error is on error.cause (set by aiService.screenCandidate)
  const raw = error.cause || error;
  if (raw.response) {
    console.error('Status:', raw.response.status);
    console.error('Python response body:');
    console.error(JSON.stringify(raw.response.data, null, 2));
  }
  const status = error.statusCode || 502;
  throw new ApiError(status, error.message || 'AI screening failed');
}
});

module.exports = { extractCVText };