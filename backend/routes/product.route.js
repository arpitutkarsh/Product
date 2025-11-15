import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addProduct,
  getAllProduct,
  getProductById,
  getProductByProductId,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Add a new product (with images/videos)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  addProduct
);

// Get all products
router.get("/", getAllProduct);

// Get product by database ID
router.get("/id/:id", getProductById);

// Get product by product-specific ID (custom field)
router.get("/product/:productId", getProductByProductId);

// Update product by ID (with images/videos)
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  updateProduct
);

// Delete product by ID
router.delete("/:id", protect, deleteProduct);

export default router;
