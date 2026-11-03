const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  requestEmailUpdate,
  verifyEmailAndUpdate
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

// ============================================
// ROUTES
// ============================================

router.post('/register', registerUser);
router.post("/login", loginUser);
router.put('/profile', protect, updateProfile); 
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// OTP & Email Verification Routes
router.post('/request-email-update', protect, requestEmailUpdate);
router.post('/verify-email-update', protect, verifyEmailAndUpdate);

module.exports = router;
