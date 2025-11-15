import Product from "../models/product.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadonCloudinary } from "../utils/cloudinary.js"
export const addProduct = async (req, res) => {
    try {
        const { title, description, productId, category, link } = req.body
        if (!title || !description || !productId || !category || !link) {
            throw new ApiError(400, "All the fields are required")
        }

        const images = []
        const videos = []

        if (req.files?.images) {
            for (const file of req.files.images) {
                const result = await uploadonCloudinary(file.path);
                if (result) images.push(result.secure_url)
            }
        }

        if (req.files?.videos) {
            for (const file of req.files.videos) {
                const result = await uploadonCloudinary(file.path);
                if (result) videos.push(result.secure_url)
            }
        }

        const product = await Product.create({
            title,
            description,
            productId,
            category,
            link,
            images,
            videos
        })

        return res.status(201).json(new ApiResponse(201, product, "Product Added Successfully"))
    } catch (error) {
        console.log(error)
        throw new ApiError(400, "Smething went wrong while adding product")
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find().populate("category", "name");

        if (!products || products.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No products found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, products, "All Products fetched successfully"));
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Something went wrong while fetching products"));
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate("category", "name");
        if (!product) throw new ApiError(404, "Product not found");

        return res
            .status(200)
            .json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (error) {
        throw new ApiError(400, "Something went wrong")
    }
};

export const getProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

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
    console.error("Error fetching product by Product ID:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong while searching product"));
  }
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new ApiError(404, "Product not found");

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product deleted successfully"));
    } catch (error) {
        throw new ApiError(400, "Something went wrong")
    }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, category, link, deleteImages, deleteVideos } = req.body;

    // Safely parse delete arrays (they come as strings from FormData)
    try {
      if (deleteImages) deleteImages = JSON.parse(deleteImages);
      else deleteImages = [];
    } catch {
      deleteImages = [];
    }

    try {
      if (deleteVideos) deleteVideos = JSON.parse(deleteVideos);
      else deleteVideos = [];
    } catch {
      deleteVideos = [];
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (link) product.link = link;

    // Remove selected image/video URLs from product (but don’t delete from Cloudinary)
    if (Array.isArray(deleteImages) && deleteImages.length > 0) {
      product.images = product.images.filter((img) => !deleteImages.includes(img));
    }

    if (Array.isArray(deleteVideos) && deleteVideos.length > 0) {
      product.videos = product.videos.filter((vid) => !deleteVideos.includes(vid));
    }

    // Upload new images
    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await uploadonCloudinary(file.path);
        if (result?.secure_url) product.images.push(result.secure_url);
      }
    }

    // Upload new videos
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
    console.error("Update Product Error:", error);
    return res
      .status(400)
      .json(new ApiError(400, "Something went wrong while updating product"));
  }
};