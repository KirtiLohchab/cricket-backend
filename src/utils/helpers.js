import crypto from "crypto";

/**
 * Hash password
 * @param {string} password - Plain password
 * @returns {string} - Hashed password
 */
export const hashPassword = async (password) => {
  const bcrypt = import("bcryptjs").then((m) => m.default);
  const hashLib = await bcrypt;
  const salt = await hashLib.genSalt(10);
  return hashLib.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain password
 * @param {string} hash - Password hash
 * @returns {boolean} - True if password matches, false otherwise
 */
export const comparePassword = async (password, hash) => {
  const bcrypt = import("bcryptjs").then((m) => m.default);
  const hashLib = await bcrypt;
  return hashLib.compare(password, hash);
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add country code if not present
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  return cleaned;
};

/**
 * Mask phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Masked phone number
 */
export const maskPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const last4 = cleaned.slice(-4);
  return `***${last4}`;
};

/**
 * Mask email for display
 * @param {string} email - Email address
 * @returns {string} - Masked email
 */
export const maskEmail = (email) => {
  const [local, domain] = email.split("@");
  const maskedLocal =
    local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
};

/**
 * Calculate age from date of birth
 * @param {Date} dob - Date of birth
 * @returns {number} - Age in years
 */
export const calculateAge = (dob) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Generate a random request ID for tracking
 * @returns {string} - Random request ID
 */
export const generateRequestId = () => {
  return crypto.randomBytes(8).toString("hex");
};
