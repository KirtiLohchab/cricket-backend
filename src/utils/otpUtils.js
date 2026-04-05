import crypto from "crypto";

/**
 * Generate a random OTP code
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP code
 */
export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Calculate OTP expiry time
 * @param {number} minutes - Minutes to add to current time (default: 10)
 * @returns {Date} - Expiry date time
 */
export const getOTPExpiryTime = (minutes = 10) => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
  return expiryTime;
};

/**
 * Check if OTP has expired
 * @param {Date} expiresAt - Expiry datetime of OTP
 * @returns {boolean} - True if expired, false otherwise
 */
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

/**
 * Validate OTP attempt count
 * @param {number} attempts - Current attempt count
 * @param {number} maxAttempts - Maximum allowed attempts (default: 5)
 * @returns {boolean} - True if attempts exceeded, false otherwise
 */
export const isMaxOTPAttemptsExceeded = (attempts, maxAttempts = 5) => {
  return attempts >= maxAttempts;
};
