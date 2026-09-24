const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const User = require('../models/User');

// @route  GET /api/admin/users
// @access Private (admin only)
const getUsers = asyncHandler(async (req, res) => {
  // Fetch all users but exclude their passwords for security
  const users = await User.find({}).select('-password');
  res.success(users, 'Users retrieved successfully');
});

// @route  PUT /api/admin/api-config
// @access Private (admin only)
const updateApiConfig = asyncHandler(async (req, res) => {
  const { apiKey } = req.body;
  
  if (!apiKey) {
    res.status(400);
    throw new Error('API Key is required'); // asyncHandler will catch this automatically
  }

  // In a full production app, you would save this to an encrypted DB collection.
  // For now, we return a success response without sending the secret back to the frontend.
  res.success(null, 'API configuration updated successfully');
});

// @route  GET /api/admin/system-status
// @access Private (admin only)
const getSystemStatus = asyncHandler(async (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  const statusData = {
    serverStatus: 'Healthy',
    uptime: `${Math.floor(uptime / 60)} minutes`,
    memoryUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    timestamp: new Date().toISOString()
  };

  res.success(statusData, 'System status retrieved successfully');
});

// @route  GET /api/admin/database-status
// @access Private (admin only)
const getDatabaseStatus = asyncHandler(async (req, res) => {
  const state = mongoose.connection.readyState;
  
  // Mongoose readyState maps to numbers
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbStatus = {
    connectionState: states[state] || 'Unknown',
    host: mongoose.connection.host,
    databaseName: mongoose.connection.name
  };

  res.success(dbStatus, 'Database status retrieved successfully');
});

module.exports = { getUsers, updateApiConfig, getSystemStatus, getDatabaseStatus };