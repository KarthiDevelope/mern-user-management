const User = require('../models/User');

// @desc    Get all users with search & pagination
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const { search = '', page = 1, limit = 10, role } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Build search filter
  const filter = {};
  if (search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
    ];
  }
  if (role && ['admin', 'user'].includes(role)) {
    filter.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user });
};

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const user = await User.create({ name, email, password, role: role || 'user', phone });

  res.status(201).json({ success: true, message: 'User created successfully', data: user });
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { name, email, password, role, phone, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Apply updates
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password; // pre-save hook will hash it
  if (role !== undefined) user.role = role;
  if (phone !== undefined) user.phone = phone;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.status(200).json({ success: true, message: 'User updated successfully', data: user });
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, message: 'User deleted successfully' });
};

// @desc    Get own profile (User role)
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc    Update own profile (User role)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, phone, password } = req.body;

  const user = await User.findById(req.user._id);
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (password !== undefined) user.password = password;

  await user.save();

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, getProfile, updateProfile };
