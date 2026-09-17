const path = require('path');
const mongoose = require('mongoose');

const Candidate = require('../models/Candidate');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/*
  POST /api/jobs/:jobId/cvs

  The route uses:
  uploadCv.array('cvs', 50)

  Therefore the same endpoint supports:

  1 uploaded PDF  -> single CV upload
  many PDFs       -> multiple CV upload
*/
const uploadCvs = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // Validate MongoDB ObjectId format.
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  // Multer places uploaded files in req.files.
  if (!req.files || req.files.length === 0) {
    throw new ApiError(
      400,
      'Please upload at least one CV file'
    );
  }

  /*
    PDF format, file-size limit and physical storage
    have already been handled by uploadMiddleware.js
    before this controller executes.
  */

  const candidateDocuments = req.files.map((file) => ({
    jobId,

    /*
      Store a relative path rather than exposing the
      user's absolute local filesystem path.
    */
    cvUrl: path
      .relative(process.cwd(), file.path)
      .replace(/\\/g, '/'),

    originalFileName: file.originalname,

    fileSize: file.size,

    status: 'Pending',
  }));

  const candidates = await Candidate.insertMany(
    candidateDocuments
  );

  const responseData = candidates.map((candidate) => ({
    candidateId: candidate._id,

    jobId: candidate.jobId,

    originalFileName:
      candidate.originalFileName,

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
    `${responseData.length} CV${
      responseData.length === 1 ? '' : 's'
    } uploaded successfully`,
    201
  );
});

/*
  GET /api/jobs/:jobId/cvs/status

  Returns upload/processing status for every CV
  uploaded for the selected job.
*/
const getUploadStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const candidates = await Candidate.find({
    jobId,
  })
    .select(
      '_id originalFileName fileSize status processingError createdAt updatedAt'
    )
    .sort({ createdAt: -1 })
    .lean();

  const statusSummary = {
    total: candidates.length,

    pending: candidates.filter(
      (candidate) =>
        candidate.status === 'Pending'
    ).length,

    processing: candidates.filter(
      (candidate) =>
        candidate.status === 'Processing'
    ).length,

    complete: candidates.filter(
      (candidate) =>
        candidate.status === 'Complete'
    ).length,

    failed: candidates.filter(
      (candidate) =>
        candidate.status === 'Failed'
    ).length,
  };

  res.success(
    {
      jobId,
      summary: statusSummary,
      candidates,
    },
    'CV upload status fetched successfully'
  );
});

module.exports = {
  uploadCvs,
  getUploadStatus,
};