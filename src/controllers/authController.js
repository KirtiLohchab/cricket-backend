import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId, email) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not configured on the server.", 500);
  }
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sendTokenResponse = (res, statusCode, message, token, user) => {
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    user,
  });
};

// ─── Controllers ──────────────────────────────────────────────────────────────

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !password) {
    return next(new AppError("Name, email and password are required.", 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError("Please provide a valid email address.", 400));
  }

  if (password.length < 8) {
    return next(new AppError("Password must be at least 8 characters.", 400));
  }

  if (name.trim().length > 100) {
    return next(new AppError("Name must not exceed 100 characters.", 400));
  }

  // ── Business logic ───────────────────────────────────────────────────────────
  const existingUser = await findUserByEmail(email.toLowerCase().trim());
  if (existingUser) {
    return next(
      new AppError("An account with this email already exists.", 409),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await createUser(
    name.trim(),
    email.toLowerCase().trim(),
    hashedPassword,
  );

  const token = signToken(newUser.id, newUser.email);

  sendTokenResponse(res, 201, "User registered successfully.", token, newUser);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!email?.trim() || !password) {
    return next(new AppError("Email and password are required.", 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError("Please provide a valid email address.", 400));
  }

  // ── Business logic ───────────────────────────────────────────────────────────
  // Always fetch the user and always run bcrypt.compare to prevent
  // timing-based user-enumeration attacks.
  const user = await findUserByEmail(email.toLowerCase().trim());
  const dummyHash =
    "$2a$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  const isMatch = await bcrypt.compare(
    password,
    user ? user.password : dummyHash,
  );

  if (!user || !isMatch) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const token = signToken(user.id, user.email);

  sendTokenResponse(res, 200, "Login successful.", token, {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
});
