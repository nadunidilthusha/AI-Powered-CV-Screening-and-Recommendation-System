const asyncHandler = require('../utils/asyncHandler');
const Candidate = require('../models/Candidate');
const ApiError = require('../utils/ApiError');

// @route  GET /api/jobs/:jobId/candidates
// @access Private
const getCandidatesForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const filter = (jobId && jobId !== 'all') ? { jobId } : {};
  const candidates = await Candidate.find(filter).sort({ 'aiEvaluation.matchPercentage': -1 });
  res.success(candidates, 'Candidates retrieved successfully');
});

// @route  GET /api/candidates/:id
// @access Private
const getCandidateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidate = await Candidate.findById(id);
  if (!candidate) throw new ApiError(404, 'Candidate not found');
  res.success(candidate, 'Candidate details retrieved successfully');
});

// @route  GET /api/candidates/:id/recommendation
// @access Private
const getAIRecommendation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidate = await Candidate.findById(id).select('aiEvaluation');
  if (!candidate) throw new ApiError(404, 'Candidate not found');
  res.success(candidate.aiEvaluation, 'AI recommendation retrieved successfully');
});

module.exports = { getCandidatesForJob, getCandidateById, getAIRecommendation };

