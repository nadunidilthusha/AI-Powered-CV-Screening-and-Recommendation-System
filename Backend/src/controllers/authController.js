const asyncHandler = require('../utils/asyncHandler');

// @route  POST /api/auth/register
// @access Public
// TODO: create the user (hash password via the User model), sign a JWT
// (see utils/generateToken.js), and return it with res.success(...)
const register = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement register');
});

// @route  POST /api/auth/login
// @access Public
// TODO: find the user by email, compare password, sign and return a JWT
const login = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement login');
});

// @route  POST /api/auth/forgot-password
// @access Public
// TODO: generate a reset token, email it to the user (or return it in dev)
const forgotPassword = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement forgotPassword');
});

// @route  POST /api/auth/logout
// @access Private
// TODO: invalidate the token if using a blocklist/session store; otherwise
// this can just be a no-op since the frontend clears its own stored token
const logout = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement logout');
});

// @route  GET /api/auth/me
// @access Private
// TODO: return req.user (already attached by the `protect` middleware)
const getMe = asyncHandler(async (req, res) => {
  res.success(null, 'TODO: implement getMe');
});

module.exports = { register, login, forgotPassword, logout, getMe };
