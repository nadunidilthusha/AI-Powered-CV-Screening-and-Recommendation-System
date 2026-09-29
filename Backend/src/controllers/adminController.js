const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const User = require('../models/User');
const Config = require('../models/Config');
const ApiError = require('../utils/ApiError');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// @route  GET /api/admin/users
// @access Private (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.success(users, 'Users retrieved successfully');
});

// @route  POST /api/admin/users
// @access Private (admin only)
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, 'fullName, email, and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'A user with that email already exists');
  }

  // The User model's pre('save') hook hashes the password automatically.
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    role: role || 'hr_manager',
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @route  PUT /api/admin/users/:id
// @access Private (admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'hr_manager'].includes(role)) {
    throw new ApiError(400, 'Role must be either "admin" or "hr_manager"');
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  res.success(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    'User role updated successfully'
  );
});

// @route  DELETE /api/admin/users/:id
// @access Private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (String(req.user._id) === String(id)) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  await user.deleteOne();
  res.success({ id }, 'User deleted successfully');
});

// @route  PUT /api/admin/api-config
// @access Private (admin only)
const updateApiConfig = asyncHandler(async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 20) {
    throw new ApiError(400, 'A valid API key is required (minimum 20 characters)');
  }

  await Config.findOneAndUpdate(
    { key: 'GEMINI_API_KEY' },
    {
      key: 'GEMINI_API_KEY',
      value: apiKey,
      description: 'Google Gemini API key for the AI microservice',
    },
    { upsert: true, new: true }
  );

  const masked =
    apiKey.length > 12
      ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`
      : '****';

  res.success({ masked }, 'API key saved securely');
});

// @route  GET /api/admin/api-config
// @access Private (admin only)
const getApiConfig = asyncHandler(async (req, res) => {
  const config = await Config.findOne({ key: 'GEMINI_API_KEY' });

  if (!config) {
    return res.success({ configured: false }, 'No API key configured yet');
  }

  const masked =
    config.value.length > 12
      ? `${config.value.slice(0, 6)}...${config.value.slice(-4)}`
      : '****';

  res.success(
    {
      configured: true,
      masked,
      updatedAt: config.updatedAt,
    },
    'API configuration retrieved'
  );
});

// @route  GET /api/admin/system-status
// @access Private (admin only)
const getSystemStatus = asyncHandler(async (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const candidateCount = await Candidate.countDocuments({});

  const statusData = {
    serverStatus: 'Healthy',
    uptime: `${Math.floor(uptime / 60)} minutes`,
    memoryUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    candidateCount,
    timestamp: new Date().toISOString(),
  };

  res.success(statusData, 'System status retrieved successfully');
});

// @route  GET /api/admin/database-status
// @access Private (admin only)
const getDatabaseStatus = asyncHandler(async (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };

  const [candidateCount, jobCount] = await Promise.all([
    Candidate.countDocuments({}),
    Job.countDocuments({}),
  ]);

  const dbStatus = {
    connectionState: states[state] || 'Unknown',
    host: mongoose.connection.host,
    databaseName: mongoose.connection.name,
    candidateCount,
    jobCount,
  };

  res.success(dbStatus, 'Database status retrieved successfully');
});

module.exports = {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  updateApiConfig,
  getApiConfig,
  getSystemStatus,
  getDatabaseStatus,
};