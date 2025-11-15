import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route   POST /api/ver1/admin/register
 * @desc    Register a new admin
 * @access  Public
 */
router.post("/register", registerAdmin);

/**
 * @route   POST /api/ver1/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/login", loginAdmin);

/**
 * @route   POST /api/ver1/admin/refreshToken
 * @desc    Refresh access and refresh tokens
 * @access  Public (requires refresh token cookie)
 */
router.post("/refreshToken", refreshToken);

/**
 * @route   POST /api/ver1/admin/logout
 * @desc    Logout admin and invalidate tokens
 * @access  Public (requires refresh token cookie)
 */
router.post("/logout", logoutAdmin);

/**
 * Example of a protected route
 * @route   GET /api/ver1/admin/profile
 * @desc    Get admin profile
 * @access  Private
 */
// router.get("/profile", protect, getProfile);

export default router;
