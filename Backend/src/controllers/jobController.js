const mongoose = require('mongoose');

const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const allowedFields = [
  'title',
  'department',
  'location',
  'description',
  'status',
  'type',
  'employmentType',
  'level',
  'experienceLevel',
  'skills',
  'requiredSkills',
  'salaryMin',
  'salaryMax',
];

const buildJobData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  // Keep frontend and AI field names synchronized.
  if (body.type !== undefined) {
    data.type = body.type;
    data.employmentType = body.type;
  }

  if (body.employmentType !== undefined) {
    data.employmentType = body.employmentType;
    data.type = body.employmentType;
  }

  if (body.level !== undefined) {
    data.level = body.level;
    data.experienceLevel = body.level;
  }

  if (body.experienceLevel !== undefined) {
    data.experienceLevel = body.experienceLevel;
    data.level = body.experienceLevel;
  }

  if (body.skills !== undefined) {
    data.skills = body.skills;
    data.requiredSkills = body.skills;
  }

  if (body.requiredSkills !== undefined) {
    data.requiredSkills = body.requiredSkills;
    data.skills = body.requiredSkills;
  }

  if (body.salaryMin === '' || body.salaryMin === undefined) {
    if (body.salaryMin !== undefined) {
      data.salaryMin = null;
    }
  } else if (body.salaryMin !== null) {
    data.salaryMin = Number(body.salaryMin);
  }

  if (body.salaryMax === '' || body.salaryMax === undefined) {
    if (body.salaryMax !== undefined) {
      data.salaryMax = null;
    }
  } else if (body.salaryMax !== null) {
    data.salaryMax = Number(body.salaryMax);
  }

  return data;
};

const getJobStatistics = async (jobId) => {
  const candidates = await Candidate.find({
    jobId,
  })
    .select('name aiEvaluation createdAt')
    .sort({
      'aiEvaluation.matchPercentage': -1,
    })
    .lean();

  const candidatesCount = candidates.length;

  const evaluatedCandidates = candidates.filter(
    (candidate) =>
      typeof candidate.aiEvaluation?.matchPercentage === 'number'
  );

  const highlyRecommended = candidates.filter(
    (candidate) =>
      candidate.aiEvaluation?.recommendationStatus ===
      'Highly Recommended'
  ).length;

  const avgMatch =
    evaluatedCandidates.length > 0
      ? Math.round(
          evaluatedCandidates.reduce(
            (sum, candidate) =>
              sum +
              candidate.aiEvaluation.matchPercentage,
            0
          ) / evaluatedCandidates.length
        )
      : 0;

  const topMatches = candidates
    .filter(
      (candidate) =>
        candidate.name &&
        typeof candidate.aiEvaluation?.matchPercentage === 'number'
    )
    .slice(0, 5)
    .map((candidate) => ({
      name: candidate.name,
      match: candidate.aiEvaluation.matchPercentage,
    }));

  return {
    candidates: candidatesCount,
    highlyRecommended,
    avgMatch,
    topMatches,
  };
};

const formatJob = async (job) => {
  const statistics = await getJobStatistics(job._id);

  const createdAt = job.createdAt
    ? new Date(job.createdAt)
    : null;

  const daysOpen =
    createdAt
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - createdAt.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return {
    ...job,
    ...statistics,
    posted:
      job.status === 'Draft'
        ? 'Not posted'
        : createdAt
          ? createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Not posted',
    daysOpen,
  };
};

// GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { status, department, search } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (department) {
    filter.department = department;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        location: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const formattedJobs = await Promise.all(
    jobs.map(formatJob)
  );

  res.success(
    formattedJobs,
    'Jobs fetched successfully'
  );
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const job = await Job.findById(id).lean();

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const formattedJob = await formatJob(job);

  res.success(
    formattedJob,
    'Job fetched successfully'
  );
});

// POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const jobData = buildJobData(req.body);

  const job = await Job.create({
    ...jobData,
    createdBy: req.user?._id,
  });

  const formattedJob = await formatJob(
    job.toObject()
  );

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: formattedJob,
  });
});

// PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const jobData = buildJobData(req.body);

  const job = await Job.findByIdAndUpdate(
    id,
    jobData,
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const formattedJob = await formatJob(job);

  res.success(
    formattedJob,
    'Job updated successfully'
  );
});

// DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  await Candidate.deleteMany({
    jobId: id,
  });

  await job.deleteOne();

  res.success(
    { id },
    'Job deleted successfully'
  );
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};