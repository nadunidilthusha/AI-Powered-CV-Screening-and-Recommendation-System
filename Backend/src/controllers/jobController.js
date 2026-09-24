const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Job = require('../models/Job');

// @route  GET /api/jobs
// @access Private
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 });
  res.success(jobs, 'Jobs retrieved successfully');
});

// @route  GET /api/jobs/:id
// @access Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  res.success(job, 'Job retrieved successfully');
});

// @route  POST /api/jobs
// @access Private (hr_manager, admin)
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    department,
    location,
    employmentType,
    description,
    requiredSkills,
    experienceLevel,
    status,
  } = req.body;

  const job = await Job.create({
    title,
    department,
    location,
    employmentType,
    description,
    requiredSkills: requiredSkills || [],
    experienceLevel,
    status: status || 'Open',
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

// @route  PUT /api/jobs/:id
// @access Private (hr_manager, admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');

  const updatable = [
    'title',
    'department',
    'location',
    'employmentType',
    'description',
    'requiredSkills',
    'experienceLevel',
    'status',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      job[field] = req.body[field];
    }
  });

  const updated = await job.save();
  res.success(updated, 'Job updated successfully');
});

// @route  DELETE /api/jobs/:id
// @access Private (hr_manager, admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');

  await job.deleteOne();
  res.success({ id: req.params.id }, 'Job deleted successfully');
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };