import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import {
  addProduct,
  getAllProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductByProductId,
} from "../controllers/product.controller.js";

const router = Router();

router
  .route("/addProduct")
  .post(
    protect,
    upload.fields([
      { name: "images", maxCount: 10 },
      { name: "videos", maxCount: 10 },
    ]),
    addProduct
  );
router.route("/search/:productId").get(getProductByProductId)
router.route("/getAllProduct").get(getAllProduct);
router.route("/getAllProduct/:id").get(getProductById);
router.route("/deleteProduct/:id").delete(protect, deleteProduct);
router
  .route("/updateProduct/:id")
  .put(
    protect,
    upload.fields([
      { name: "images", maxCount: 10 },
      { name: "videos", maxCount: 10 },
    ]),
    updateProduct
  );


export default router;
