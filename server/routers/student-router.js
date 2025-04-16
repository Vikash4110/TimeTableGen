const express = require('express');
const router = express.Router();
const {
  registerStudent,
  verifyOTP,
  loginStudent,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/student-controller');
const { authMiddleware, validate } = require('../middlewares/student-middleware');
const { loginSchema } = require('../validators/student-validator');

router.post('/register', registerStudent); // Validation handled inside controller due to FormData
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(loginSchema), loginStudent);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;