const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Job = require('../models/Job');

// @route  GET /api/jobs
// @access Private
// Supports the frontend's job list filters: status tabs, department
// dropdown, and the search box (matches on title, case-insensitive).
const getJobs = asyncHandler(async (req, res) => {
  const { status, department, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (department) filter.department = department;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.success(jobs, 'Jobs fetched successfully');
});

// @route  GET /api/jobs/:id
// @access Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, 'Job posting not found');
  }
  res.success(job, 'Job fetched successfully');
});

// @route  POST /api/jobs
// @access Private (hr_manager, admin)
const createJob = asyncHandler(async (req, res) => {
  const { title, department, type, location, level, salaryMin, salaryMax, description, status, skills } =
    req.body;

  const job = await Job.create({
    title,
    department,
    type,
    location,
    level,
    salaryMin: salaryMin === '' ? undefined : salaryMin,
    salaryMax: salaryMax === '' ? undefined : salaryMax,
    description,
    status,
    skills,
    createdBy: req.user._id,
  });

  res.success(job, 'Job posting created successfully', 201);
});

// @route  PUT /api/jobs/:id
// @access Private (hr_manager, admin)
const updateJob = asyncHandler(async (req, res) => {
  const { title, department, type, location, level, salaryMin, salaryMax, description, status, skills } =
    req.body;

  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      title,
      department,
      type,
      location,
      level,
      salaryMin: salaryMin === '' ? undefined : salaryMin,
      salaryMax: salaryMax === '' ? undefined : salaryMax,
      description,
      status,
      skills,
    },
    { new: true, runValidators: true, context: 'query' }
  );

  if (!job) {
    throw new ApiError(404, 'Job posting not found');
  }

  res.success(job, 'Job posting updated successfully');
});

// @route  DELETE /api/jobs/:id
// @access Private (hr_manager, admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    throw new ApiError(404, 'Job posting not found');
  }
  res.success(null, 'Job posting deleted successfully');
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };