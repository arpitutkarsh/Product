import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/refresh", refreshAccessToken);  // renamed for clarity
router.post("/logout", logoutAdmin);

// Example protected route
// router.get("/profile", protect, getProfile);

export default router;
