import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};


// REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    if (!email || !name || !phone || !password)
      throw new ApiError(400, "Missing Fields");

    const exists = await Admin.findOne({ email });
    if (exists) throw new ApiError(400, "User Already Exists");

    const admin = await Admin.create({ email, name, phone, password });

    return res
      .status(201)
      .json(new ApiResponse(200, admin, "Admin Created"));
  } catch (error) {
    throw new ApiError(500, error.message);
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

    admin.refreshToken.push({ token: refreshToken });
    await admin.save();

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(200, {
          id: admin._id,
          email: admin.email,
        })
      );
  } catch (error) {
    throw new ApiError(500, error.message);
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

    const exists = admin.refreshToken.find((rt) => rt.token === token);
    if (!exists) throw new ApiError(401, "Invalid refresh token");

    admin.refreshToken = admin.refreshToken.filter((rt) => rt.token !== token);

    const newAccessToken = signAccessToken(admin);
    const newRefreshToken = signRefreshToken(admin);

    admin.refreshToken.push({ token: newRefreshToken });
    await admin.save();

    return res
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, "Tokens refreshed"));
  } catch (error) {
    throw new ApiError(401, error.message);
  }
};

// LOGOUT
export const logoutAdmin = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const payload = verifyRefreshToken(token);
      await Admin.findByIdAndUpdate(payload.id, {
        $set: { refreshToken: [] },
      });
    }

    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out"));
  } catch (error) {
    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out"));
  }
};
