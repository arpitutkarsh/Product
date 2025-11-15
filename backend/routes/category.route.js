import { Router } from "express";
import {protect} from "../middlewares/auth.middleware.js";
import {
  addCategory,
  getCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/addCategory").post(protect, addCategory);
router.route("/getCategory").get(getCategory);
router.route("/deleteCategory/:id").delete(protect, deleteCategory);

export default router;
