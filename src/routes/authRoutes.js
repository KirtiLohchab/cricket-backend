import express from "express";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  logout,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  otpLimiter,
  verifyOTPLimiter,
  loginLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

/**
 * POST /api/auth/send-otp
 * Send OTP to user's email or phone
 */
router.post("/send-otp", otpLimiter, sendOTP);

/**
 * POST /api/auth/verify-otp
 * Verify OTP and return JWT token
 */
router.post("/verify-otp", verifyOTPLimiter, verifyOTP);

/**
 * POST /api/auth/resend-otp
 * Resend OTP to user's email or phone
 */
router.post("/resend-otp", otpLimiter, resendOTP);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", authMiddleware, logout);

export default router;
