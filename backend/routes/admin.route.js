import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(protect, logoutAdmin);
router.route("/refreshToken").post(refreshToken);

export default router;
