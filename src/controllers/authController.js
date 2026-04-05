import { PrismaClient } from "@prisma/client";
import {
  generateOTP,
  getOTPExpiryTime,
  isOTPExpired,
  isMaxOTPAttemptsExceeded,
} from "../utils/otpUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import { formatPhoneNumber } from "../utils/helpers.js";
import { sendOTPEmail } from "../services/emailService.js";
import { sendOTPSMS } from "../services/smsService.js";
import {
  validateInput,
  sendOTPSchema,
  verifyOTPSchema,
} from "../utils/validationUtils.js";

const prisma = new PrismaClient();

/**
 * Send OTP to user email or phone
 */
export const sendOTP = async (req, res) => {
  try {
    const { phone, email } = req.body;

    // Validate input
    const { error, value } = validateInput({ phone, email }, sendOTPSchema);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }

    // Format phone number if provided
    let formattedPhone = phone ? formatPhoneNumber(phone) : null;

    // Check if user exists
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (formattedPhone) {
      user = await prisma.user.findUnique({ where: { phone: formattedPhone } });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiryTime(
      parseInt(process.env.OTP_EXPIRY_TIME, 10) || 10,
    );

    // Create OTP record
    const otpRecord = await prisma.oTP.create({
      data: {
        phone: formattedPhone || null,
        email: email || null,
        code: otp,
        method: email ? "EMAIL" : "PHONE",
        expiresAt,
        userId: user?.id || null,
      },
    });

    // Send OTP
    if (email) {
      await sendOTPEmail(email, otp, user?.id ? "User" : value.email);
    } else if (formattedPhone) {
      await sendOTPSMS(formattedPhone, otp);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        otpId: otpRecord.id,
        method: email ? "email" : "phone",
        target: email || `***${formattedPhone.slice(-4)}`,
        expiresIn: parseInt(process.env.OTP_EXPIRY_TIME, 10) || 10,
      },
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  try {
    const { phone, email, code } = req.body;

    // Validate input
    const { error, value } = validateInput(
      { phone, email, code },
      verifyOTPSchema,
    );
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }

    // Format phone if provided
    let formattedPhone = phone ? formatPhoneNumber(phone) : null;

    // Find OTP record
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: formattedPhone || undefined },
        ],
        code,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { status: "EXPIRED" },
      });
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check if max attempts exceeded
    if (isMaxOTPAttemptsExceeded(otpRecord.attempts)) {
      return res.status(400).json({
        success: false,
        message: "Maximum OTP attempts exceeded",
      });
    }

    // Mark OTP as verified
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { status: "VERIFIED" },
    });

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: formattedPhone || undefined },
        ],
      },
    });

    // Update verification status
    if (user) {
      if (email) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPhoneVerified: true },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email || null,
          phone: formattedPhone || null,
          isEmailVerified: !!email,
          isPhoneVerified: !!phone,
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, {
      email: user.email,
      phone: user.phone,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        userId: user.id,
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          isNewUser: !user.playerProfile,
        },
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req, res) => {
  try {
    const { phone, email, otpId } = req.body;

    if (!otpId && !phone && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide otpId, phone, or email",
      });
    }

    // Find the OTP record
    let otpRecord;
    if (otpId) {
      otpRecord = await prisma.oTP.findUnique({ where: { id: otpId } });
    } else {
      const formattedPhone = phone ? formatPhoneNumber(phone) : null;
      otpRecord = await prisma.oTP.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: formattedPhone || undefined },
          ],
          status: { not: "EXPIRED" },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP record not found",
      });
    }

    // Generate new OTP
    const newOtp = generateOTP();
    const expiresAt = getOTPExpiryTime(
      parseInt(process.env.OTP_EXPIRY_TIME, 10) || 10,
    );

    // Update OTP record
    const updatedOtpRecord = await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: {
        code: newOtp,
        expiresAt,
        attempts: 0,
        status: "PENDING",
      },
    });

    // Send new OTP
    if (updatedOtpRecord.email) {
      await sendOTPEmail(updatedOtpRecord.email, newOtp);
    } else if (updatedOtpRecord.phone) {
      await sendOTPSMS(updatedOtpRecord.phone, newOtp);
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: {
        otpId: updatedOtpRecord.id,
        method: updatedOtpRecord.email ? "email" : "phone",
        expiresIn: parseInt(process.env.OTP_EXPIRY_TIME, 10) || 10,
      },
    });
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

/**
 * Logout user (invalidate token on client side)
 */
export const logout = async (req, res) => {
  try {
    // Token invalidation can be done on client side
    // Or you can implement a blacklist in the database

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
};
