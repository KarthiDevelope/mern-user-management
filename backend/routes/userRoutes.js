const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { createUserValidation, updateUserValidation, validate } = require('../middleware/validation');

// Profile routes — accessible by any authenticated user
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin-only routes
router.use(protect, authorize('admin'));

router.route('/').get(getAllUsers).post(createUserValidation, validate, createUser);

router.route('/:id').get(getUserById).put(updateUserValidation, validate, updateUser).delete(deleteUser);

module.exports = router;
