const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

  if (user) {
    const token = generateToken(user);
    res.success({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    }, 'User registered successfully', 201);
  } else {
    throw new ApiError(400, 'Invalid user data');
  }
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user);
    res.success({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    }, 'User logged in successfully');
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Mocking the reset token generation since no email provider is configured
  const resetToken = 'mock-reset-token-123456';
  console.log('Password reset requested for:', email);
  console.log('Reset token:', resetToken);

  res.success({ resetToken }, 'Password reset link sent to email (mocked)');
});

// @route  POST /api/auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  res.success(null, 'User logged out successfully');
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.success(user, 'User profile retrieved');
});

module.exports = { register, login, forgotPassword, logout, getMe };

