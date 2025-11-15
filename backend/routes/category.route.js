import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addCategory,
  getCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

// Create a new category
router.post("/", protect, addCategory);

// Get all categories
router.get("/", getCategory);

// Delete a category by ID
router.delete("/:id", protect, deleteCategory);

export default router;
