const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
  } = req.body;

  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    throw new ApiError(
      400,
      'User already exists'
    );
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

  const token = generateToken(user);

  res.success(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department: user.department,
      avatarUrl: user.avatarUrl,
      token,
    },
    'User registered successfully',
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await User.findOne({
    email,
  });

  if (
    user &&
    (await user.matchPassword(password))
  ) {
    const token = generateToken(user);

    res.success(
      {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        avatarUrl: user.avatarUrl,
        token,
      },
      'User logged in successfully'
    );
  } else {
    throw new ApiError(
      401,
      'Invalid email or password'
    );
  }
});

const forgotPassword = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    const resetToken =
      'mock-reset-token-123456';

    console.log(
      'Password reset requested for:',
      email
    );

    console.log(
      'Reset token:',
      resetToken
    );

    res.success(
      { resetToken },
      'Password reset link sent to email (mocked)'
    );
  }
);

const logout = asyncHandler(
  async (req, res) => {
    res.success(
      null,
      'User logged out successfully'
    );
  }
);

const getMe = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user._id
    ).select('-password');

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    res.success(
      user,
      'User profile retrieved'
    );
  }
);

/*
 * PUT /api/auth/me
 */
const updateMe = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    const {
      fullName,
      email,
      phone,
      department,
      avatarUrl,
    } = req.body;

    if (fullName !== undefined) {
      if (!String(fullName).trim()) {
        throw new ApiError(
          400,
          'Full name is required'
        );
      }

      user.fullName =
        String(fullName).trim();
    }

    if (email !== undefined) {
      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        throw new ApiError(
          400,
          'Email is required'
        );
      }

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        throw new ApiError(
          400,
          'This email is already being used by another account'
        );
      }

      user.email =
        normalizedEmail;
    }

    if (phone !== undefined) {
      user.phone =
        String(phone).trim();
    }

    if (department !== undefined) {
      user.department =
        String(department).trim();
    }

    if (avatarUrl !== undefined) {
      user.avatarUrl =
        avatarUrl || null;
    }

    await user.save();

    const updatedUser =
      await User.findById(
        user._id
      ).select('-password');

    res.success(
      updatedUser,
      'Profile updated successfully'
    );
  }
);

/*
 * DELETE /api/auth/me/avatar
 */
const removeAvatar = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    user.avatarUrl = null;

    await user.save();

    res.success(
      {
        avatarUrl: null,
      },
      'Profile photo removed successfully'
    );
  }
);

module.exports = {
  register,
  login,
  forgotPassword,
  logout,
  getMe,
  updateMe,
  removeAvatar,
};