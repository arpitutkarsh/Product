import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";

// Cookie options for both local + production
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    if (!email || !name || !phone || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const exists = await Admin.findOne({ email });
    if (exists) throw new ApiError(400, "Admin with this email already exists");

    const admin = await Admin.create({ email, name, phone, password });

    return res.status(201).json(
      new ApiResponse(201, { id: admin._id, email: admin.email }, "Admin created successfully")
    );
  } catch (error) {
    console.error("Register Admin Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(401, "Invalid credentials");

    const valid = await admin.isPasswordCorrect(password);
    if (!valid) throw new ApiError(401, "Wrong password");

    const accessToken = signAccessToken(admin);
    const refreshToken = signRefreshToken(admin);

    // Replace old refresh token with new one
    admin.refreshToken = [{ token: refreshToken }];
    await admin.save();

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, { id: admin._id, email: admin.email }, "Login successful"));
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token found");

    const payload = verifyRefreshToken(token);
    const admin = await Admin.findById(payload.id);
    if (!admin) throw new ApiError(401, "Invalid refresh token");

    const exists = admin.refreshToken.some(rt => rt.token === token);
    if (!exists) throw new ApiError(401, "Refresh token not recognized");

    const newAccessToken = signAccessToken(admin);
    const newRefreshToken = signRefreshToken(admin);

    // Rotate refresh token
    admin.refreshToken = [{ token: newRefreshToken }];
    await admin.save();

    return res
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Tokens refreshed successfully"));
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({ message: error.message });
  }
};

// LOGOUT
export const logoutAdmin = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const payload = verifyRefreshToken(token);
      await Admin.findByIdAndUpdate(payload.id, { $set: { refreshToken: [] } });
    }

    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out"));
  }
};
