import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addCategory,
  getCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

// Create a new category
router.post("/addCategory", protect, addCategory);

// Get all categories
router.get("/getCategory", getCategory);

// Delete a category by ID
router.delete("/deleteCategory/:id", protect, deleteCategory);

export default router;
