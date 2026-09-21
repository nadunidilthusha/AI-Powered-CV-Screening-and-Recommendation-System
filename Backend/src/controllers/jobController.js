const mongoose = require('mongoose');

const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const allowedFields = [
  'title',
  'department',
  'type',
  'location',
  'level',
  'salaryMin',
  'salaryMax',
  'description',
  'status',
  'skills',
];

const buildJobData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  // Convert empty salary inputs from the frontend to null.
  if (data.salaryMin === '') {
    data.salaryMin = null;
  }

  if (data.salaryMax === '') {
    data.salaryMax = null;
  }

  return data;
};

/*
  GET /api/jobs

  Optional query parameters:
  ?status=Active
  ?department=Engineering
  ?search=software
*/
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

  res.success(
    jobs,
    'Jobs fetched successfully'
  );
});

/*
  GET /api/jobs/:id
*/
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid job ID');
  }

  const job = await Job.findById(id).lean();

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.success(
    job,
    'Job fetched successfully'
  );
});

/*
  POST /api/jobs
*/
const createJob = asyncHandler(async (req, res) => {
  const jobData = buildJobData(req.body);

  const job = await Job.create(jobData);

  res.success(
    job,
    'Job created successfully',
    201
  );
});

/*
  PUT /api/jobs/:id
*/
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
  );

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.success(
    job,
    'Job updated successfully'
  );
});

/*
  DELETE /api/jobs/:id

  Candidates belonging to the deleted job are also removed.
*/
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
    null,
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