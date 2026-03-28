const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { signupValidation, loginValidation, validate } = require('../middleware/validation');

router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
