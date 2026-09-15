const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/admin/users
// @access Private (admin only)
// TODO: fetch all users (for the User management page)
const getUsers = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getUsers');
});

// @route  PUT /api/admin/api-config
// @access Private (admin only)
// TODO: update stored API configuration (e.g. AI service keys/settings —
// never return secret values back in the response)
const updateApiConfig = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement updateApiConfig');
});

// @route  GET /api/admin/system-status
// @access Private (admin only)
// TODO: return health info for backend services (API, DB, queue, AI service)
const getSystemStatus = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getSystemStatus');
});

// @route  GET /api/admin/database-status
// @access Private (admin only)
// TODO: return MongoDB connection/health stats
const getDatabaseStatus = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getDatabaseStatus');
});

module.exports = { getUsers, updateApiConfig, getSystemStatus, getDatabaseStatus };
