import { verifyToken, extractTokenFromHeader } from "../utils/jwtUtils.js";

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware
 * Does not fail if token is missing, but validates if present
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);

      if (token) {
        const decoded = verifyToken(token);

        if (decoded && decoded.userId) {
          req.user = decoded;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error.message);
    // Continue even if there's an error
    next();
  }
};
