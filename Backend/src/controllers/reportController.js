const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/jobs/:jobId/ranking
// @access Private
// TODO: return candidates for this job ranked by match score, with any
// filters passed as query params (e.g. recommendation status)
const getCandidateRanking = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getCandidateRanking');
});

// @route  GET /api/jobs/:jobId/export/csv
// @access Private
// TODO: generate a CSV of the ranked candidate list and stream it back
// (frontend requests this with responseType: 'blob')
const exportCsv = asyncHandler(async (req, res) => {
  res.status(501).json({ success: false, message: 'TODO: implement exportCsv' });
});

// @route  GET /api/jobs/:jobId/export/pdf
// @access Private
// TODO: generate a PDF report of the ranked candidate list and stream it back
const exportPdf = asyncHandler(async (req, res) => {
  res.status(501).json({ success: false, message: 'TODO: implement exportPdf' });
});

module.exports = { getCandidateRanking, exportCsv, exportPdf };
