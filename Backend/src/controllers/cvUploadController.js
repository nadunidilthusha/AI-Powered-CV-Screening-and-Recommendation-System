const path = require('path');
const mongoose = require('mongoose');

const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');

/*
  Process a single candidate in the background:
  call the AI pipeline, map the response, save the result.

  Runs outside the request/response cycle so a slow Gemini call
  doesn't tie up the HTTP connection. The frontend polls
  GET /api/jobs/:jobId/cvs/status to see progress.
*/
const processOneCandidate = async (candidateId, job) => {
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return;

    candidate.status = 'Processing';
    await candidate.save();

    // Resolve the relative cvUrl back to an absolute path the
    // Python service can open.
    const absolutePath = path.resolve(process.cwd(), candidate.cvUrl);

    // Job may have skills stored under either field name depending
    // on which form created it — read both.
    const requiredSkills =
      job.requiredSkills?.length ? job.requiredSkills : (job.skills || []);
    const jobDescription = job.description || '';

    const aiResult = await aiService.screenCandidate({
      filePath: absolutePath,
      jobDescription,
      requiredSkills,
    });

    // Map Python's snake_case response into the Candidate's camelCase shape.
    candidate.name = aiResult.candidate.full_name || '';
    candidate.email = aiResult.candidate.email || '';
    candidate.phone = aiResult.candidate.phone || '';
    candidate.education = (aiResult.candidate.education || []).join('; ');
    candidate.experience = (aiResult.candidate.experience || []).join('; ');
    candidate.technicalSkills = aiResult.candidate.skills || [];

    candidate.aiEvaluation = {
      matchPercentage: aiResult.evaluation.match_percentage || 0,
      recommendationStatus: aiResult.decision.recommendation || 'Not Recommended',
      matchingSkills: aiResult.evaluation.matching_skills || [],
      missingSkills: aiResult.evaluation.missing_skills || [],
      justification: aiResult.decision.justification || '',
    };

    candidate.status = 'Complete';
    candidate.processingError = '';
    await candidate.save();

    // eslint-disable-next-line no-console
    console.log(`[uploadCvs] Candidate ${candidateId} screened: ${candidate.aiEvaluation.matchPercentage}% / ${candidate.aiEvaluation.recommendationStatus}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[uploadCvs] Candidate ${candidateId} failed:`, err.message);

    try {
      await Candidate.findByIdAndUpdate(candidateId, {
        status: 'Failed',
        processingError: err.message || 'Screening failed',
      });
    } catch (updateErr) {
      // eslint-disable-next-line no-console
      console.error(`[uploadCvs] Could not mark ${candidateId} as Failed:`, updateErr.message);
    }
  }
};

/*
  POST /api/jobs/:jobId/cvs

  Accepts one or many PDFs (multer field name 'cvs').
  Creates Candidate docs with status 'Pending', returns 201 immediately,
  then processes each one in the background.
*/
const uploadCvs = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'Please upload at least one CV file');
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  // Create one Candidate per uploaded file, all Pending.
  const candidateDocuments = req.files.map((file) => ({
    jobId,
    cvUrl: path
      .relative(process.cwd(), file.path)
      .replace(/\\/g, '/'),
    originalFileName: file.originalname,
    fileSize: file.size,
    status: 'Pending',
  }));

  const candidates = await Candidate.insertMany(candidateDocuments);

  // Respond first — the frontend polls /status for progress.
  const responseData = candidates.map((candidate) => ({
    candidateId: candidate._id,
    jobId: candidate.jobId,
    originalFileName: candidate.originalFileName,
    fileSize: candidate.fileSize,
    cvUrl: candidate.cvUrl,
    status: candidate.status,
    createdAt: candidate.createdAt,
  }));

  res.success(
    {
      uploadedCount: responseData.length,
      candidates: responseData,
    },
    `${responseData.length} CV${responseData.length === 1 ? '' : 's'} uploaded successfully`,
    201
  );

  // Fire-and-forget background processing. Do NOT await.
  // Sequential to avoid hammering Gemini's per-minute quota — if
  // bulk throughput matters later, replace this with a proper
  // queue (BullMQ/Celery) as noted in SRS PERF-3.
  (async () => {
    for (const candidate of candidates) {
      // eslint-disable-next-line no-await-in-loop
      await processOneCandidate(candidate._id, job);
    }
  })().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[uploadCvs] Background processing loop crashed:', err);
  });
});

/*
  GET /api/jobs/:jobId/cvs/status
*/
const getUploadStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const candidates = await Candidate.find({ jobId })
    .select('_id originalFileName fileSize status processingError aiEvaluation.matchPercentage aiEvaluation.recommendationStatus createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();

  const statusSummary = {
    total: candidates.length,
    pending: candidates.filter((c) => c.status === 'Pending').length,
    processing: candidates.filter((c) => c.status === 'Processing').length,
    complete: candidates.filter((c) => c.status === 'Complete').length,
    failed: candidates.filter((c) => c.status === 'Failed').length,
  };

  res.success(
    { jobId, summary: statusSummary, candidates },
    'CV upload status fetched successfully'
  );
});

module.exports = { uploadCvs, getUploadStatus };