import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";

export const registerAdmin = async (req, res) => {
    try {
        const { email, name, phone, password } = req.body
        if (!email || !name || !phone || !password) {
            throw new ApiError(400, "Missing Fields")
        }
        const existingUser = await Admin.findOne({
            email
        })
        if (existingUser) {
            throw new ApiError(400, "User Already Exists")
        }
        const admin = await Admin.create({
            email,
            name,
            phone,
            password
        })
        const createdadmin = await Admin.findById(admin._id).select("-password -refreshToken")
        if (!createdadmin) {
            throw new ApiError(500, "Something went wrong")
        }
        return res.status(201).json(new ApiResponse(200, createdadmin, "Admin Created"))
    } catch (error) {
        throw new ApiError(500, error)
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        if (!admin) {
            throw new ApiError(401, "Invalid Credentials")
        }
        const validatePassword = await admin.isPasswordCorrect(password)
        if (!validatePassword) {
            throw new ApiError(401, "Wrong Password")
        }
        const accessToken = signAccessToken(admin)
        const refreshToken = signRefreshToken(admin)
        admin.refreshToken.push({ token: refreshToken })
        await admin.save()

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
            id: admin._id, email: admin.email
        }))
    } catch (error) {
        throw new ApiError(500, "SOmething went wrong")
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken
        if (!token) {
            throw new ApiError(401, "No refresh Token found")
        }
        //now verifying signatures
        const payload = verifyRefreshToken(token)
        const admin = await Admin.findById(payload.id)
        if (!admin) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
        const found = admin.refreshToken.find(rt => rt.token === token)
        if (!found) {
            admin.refreshToken = []
            await admin.save()
            return res.status(401).json(new ApiResponse(401, "Invalid Refresh Token"))
        }
        admin.refreshToken = admin.refreshToken.filter(rt => rt.token !== token)
        const newAccessToken = signAccessToken(admin)
        const newRefreshToken = signRefreshToken(admin)
        admin.refreshToken.push({ token: newRefreshToken })
        await admin.save();

        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).cookie("accessToken", newAccessToken, options).cookie("refreshToken", newRefreshToken, options).json(new ApiResponse(200, "Cookies Refreshed"))
    } catch (error) {
        console.log("Refresh Token Refresh Error")
        throw new ApiError(401, "Refresh Of Tokens Failed")
    }
}

export const logoutAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(201, {}, "User logged out"))
    } catch (error) {
        throw new ApiError(500, "Error Logging Out")
    }
}