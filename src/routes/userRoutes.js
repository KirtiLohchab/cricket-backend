import express from "express";
import {
  registerPlayer,
  getUserProfile,
  updatePlayerProfile,
  getStates,
  getDistricts,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/users/register
 * Register a new player
 */
router.post("/register", authMiddleware, registerPlayer);

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get("/profile", authMiddleware, getUserProfile);

/**
 * PUT /api/users/profile
 * Update player profile
 */
router.put("/profile", authMiddleware, updatePlayerProfile);

/**
 * GET /api/users/states
 * Get all states
 */
router.get("/states", getStates);

/**
 * GET /api/users/districts/:stateId
 * Get districts by state
 */
router.get("/districts/:stateId", getDistricts);

export default router;
