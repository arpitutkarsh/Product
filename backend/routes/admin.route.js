import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// refresh does NOT need protect
router.post("/refreshToken", refreshToken);

// logout does NOT need protect anymore
router.post("/logout", logoutAdmin);

// add protected routes here
// router.get("/profile", protect, profileController);

export default router;
