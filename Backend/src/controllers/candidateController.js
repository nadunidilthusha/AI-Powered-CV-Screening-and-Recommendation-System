const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/jobs/:jobId/candidates
// @access Private
// TODO: fetch all candidates for a given job, typically sorted by
// matchPercentage descending (see the Candidate model)
const getCandidatesForJob = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getCandidatesForJob');
});

// @route  GET /api/candidates/:id
// @access Private
// TODO: fetch a single candidate by id, 404 if not found
const getCandidateById = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getCandidateById');
});

// @route  GET /api/candidates/:id/recommendation
// @access Private
// TODO: return just the AI recommendation/justification fields for a
// candidate (recommendation, matchingSkills, missingSkills, justification)
const getAIRecommendation = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getAIRecommendation');
});

module.exports = { getCandidatesForJob, getCandidateById, getAIRecommendation };
