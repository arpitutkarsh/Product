import Category from "../models/category.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addCategory = async(req, res) => {
    const {name} = req.body;
    if(!name){
        throw new ApiError(400, "Name Required")
    }
    try {
        const cat = await Category.create({name})
        return res.status(200).json(new ApiResponse(200, cat))
    } catch (error) {
        throw new ApiError(400, "Unable to Add Category")
    }
}

export const getCategory = async(req, res) => {
    const cats = await Category.find().sort({ name: 1 })
    return res.status(200).json(new ApiResponse(200, cats))
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    console.log("Received delete request for ID:", id);

    if (!id) {
        throw new ApiError(400, "Please select a Category");
    }

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        console.log("Deleted Category:", deletedCategory);

        if (!deletedCategory) {
            throw new ApiError(404, "Category not found or already deleted");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, deletedCategory, "Category deleted successfully"));
    } catch (error) {
        console.error("Delete Category Error:", error);
        throw new ApiError(400, "Unable to find or delete the category");
    }
};
