import Category from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add Category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new ApiError(400, "Category name is required");

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) throw new ApiError(400, "Category already exists");

    const category = await Category.create({ name });
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category added successfully"));
  } catch (error) {
    console.error("Add Category Error:", error.message);
    throw new ApiError(400, error.message || "Unable to add category");
  }
};

// Get All Categories
export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No categories found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, categories, "Categories fetched successfully"));
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    throw new ApiError(500, "Unable to fetch categories");
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Category ID is required");

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory)
      throw new ApiError(404, "Category not found or already deleted");

    console.log("Deleted Category:", deletedCategory);
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedCategory, "Category deleted successfully")
      );
  } catch (error) {
    console.error("Delete Category Error:", error.message);
    throw new ApiError(400, error.message || "Unable to delete category");
  }
};
