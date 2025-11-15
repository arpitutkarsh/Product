import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { title, description, productId, category, link } = req.body;
    if (!title || !description || !productId || !category || !link) {
      throw new ApiError(400, "All fields are required");
    }

    const images = [];
    const videos = [];

    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await uploadonCloudinary(file.path);
        if (result?.secure_url) images.push(result.secure_url);
      }
    }

    if (req.files?.videos) {
      for (const file of req.files.videos) {
        const result = await uploadonCloudinary(file.path);
        if (result?.secure_url) videos.push(result.secure_url);
      }
    }

    const product = await Product.create({
      title,
      description,
      productId,
      category,
      link,
      images,
      videos,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product added successfully"));
  } catch (error) {
    console.error("Add Product Error:", error.message);
    throw new ApiError(400, "Something went wrong while adding product");
  }
};

// Get all products
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    if (!products || products.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No products found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, products, "All products fetched successfully"));
  } catch (error) {
    console.error("Get All Products Error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong while fetching products"));
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category", "name");
    if (!product) throw new ApiError(404, "Product not found");

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.error("Get Product By ID Error:", error.message);
    throw new ApiError(400, "Something went wrong");
  }
};

// Get product by Product ID
export const getProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) throw new ApiError(400, "Product ID is required");

    const product = await Product.findOne({ productId }).populate("category", "name");
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No product found with this Product ID"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.error("Get Product By Product ID Error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong while searching product"));
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    throw new ApiError(400, "Something went wrong while deleting product");
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, category, link, deleteImages, deleteVideos } = req.body;

    // Parse delete arrays safely
    deleteImages = deleteImages ? JSON.parse(deleteImages || "[]") : [];
    deleteVideos = deleteVideos ? JSON.parse(deleteVideos || "[]") : [];

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (link) product.link = link;

    // Remove selected images/videos
    product.images = product.images.filter((img) => !deleteImages.includes(img));
    product.videos = product.videos.filter((vid) => !deleteVideos.includes(vid));

    // Upload new images/videos
    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await uploadonCloudinary(file.path);
        if (result?.secure_url) product.images.push(result.secure_url);
      }
    }

    if (req.files?.videos) {
      for (const file of req.files.videos) {
        const result = await uploadonCloudinary(file.path);
        if (result?.secure_url) product.videos.push(result.secure_url);
      }
    }

    await product.save();

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    console.error("Update Product Error:", error.message);
    return res
      .status(400)
      .json(new ApiError(400, "Something went wrong while updating product"));
  }
};
