const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidator, loginValidator, updateProfileValidator, changePasswordValidator } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, updateProfile);
router.put('/change-password', protect, changePasswordValidator, changePassword);

module.exports = router;
