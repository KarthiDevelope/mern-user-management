const User = require('../models/User');
const { sendTokenResponse } = require('../utils/token');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password, role: 'user' });

  sendTokenResponse(user, 201, res, 'Account created successfully');
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // Include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ success: false, message: 'Your account has been deactivated' });
  }

  // Remove password from response
  user.password = undefined;

  sendTokenResponse(user, 200, res, 'Login successful');
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { signup, login, getMe };
