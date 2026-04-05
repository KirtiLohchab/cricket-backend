import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your_super_secret_jwt_key_change_this_in_production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {object} payload - Additional payload data
 * @returns {string} - JWT token
 */
export const generateToken = (userId, payload = {}) => {
  const tokenPayload = {
    userId,
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded payload if valid, null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {object|null} - Decoded payload if valid, null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("Token decode failed:", error.message);
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Token if found, null otherwise
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
};
