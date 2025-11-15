import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const protect = async (req, res, next) => {
  try {
    // Use the correct cookie name (matches login & refresh)
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no access token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch admin from database
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Attach admin to request object for further use
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Protect Middleware Error:", err.message);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};
