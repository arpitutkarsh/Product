import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";

// Cookies valid for 7 days
const cookieOptions = {
  httpOnly: true,
  secure: true,          // Set true in production (HTTPS)
  sameSite: "none",      // Required for cross-site cookies
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
    console.error("Register Admin Error:", error.message);
    throw new ApiError(500, error.message || "Failed to register admin");
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

    // Prevent duplicate tokens
    admin.refreshToken = admin.refreshToken.filter(rt => rt.token !== refreshToken);
    admin.refreshToken.push({ token: refreshToken });
    await admin.save();

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, { id: admin._id, email: admin.email }, "Login successful"));
  } catch (error) {
    console.error("Login Admin Error:", error.message);
    throw new ApiError(500, error.message || "Login failed");
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token found");

    const payload = verifyRefreshToken(token);
    const admin = await Admin.findById(payload.id);
    if (!admin) throw new ApiError(401, "Invalid refresh token");

    const exists = admin.refreshToken.find(rt => rt.token === token);
    if (!exists) throw new ApiError(401, "Refresh token not recognized");

    // Remove old token and generate new tokens
    admin.refreshToken = admin.refreshToken.filter(rt => rt.token !== token);
    const newAccessToken = signAccessToken(admin);
    const newRefreshToken = signRefreshToken(admin);
    admin.refreshToken.push({ token: newRefreshToken });
    await admin.save();

    return res
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Tokens refreshed successfully"));
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    throw new ApiError(401, error.message || "Token refresh failed");
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
    console.error("Logout Admin Error:", error.message);
    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out"));
  }
};
