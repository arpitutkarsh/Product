import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

// Public
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Public (cookies auto handled)
router.post("/refreshToken", refreshToken);

// Public logout (token invalidation done in controller)
router.post("/logout", logoutAdmin);

// Example protected route (use later)
// router.get("/profile", protect, getProfile);

export default router;
