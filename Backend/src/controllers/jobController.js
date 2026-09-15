const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/jobs
// @access Private
// TODO: fetch jobs, with optional filtering by status/department/search
const getJobs = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getJobs');
});

// @route  GET /api/jobs/:id
// @access Private
// TODO: fetch a single job by id, 404 if not found
const getJobById = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getJobById');
});

// @route  POST /api/jobs
// @access Private (hr_manager, admin)
// TODO: create a job, matching the fields from the frontend's JobForm
const createJob = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement createJob', 201);
});

// @route  PUT /api/jobs/:id
// @access Private (hr_manager, admin)
// TODO: update a job by id
const updateJob = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement updateJob');
});

// @route  DELETE /api/jobs/:id
// @access Private (hr_manager, admin)
// TODO: delete a job by id (and its dependent candidates, if applicable)
const deleteJob = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement deleteJob');
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
