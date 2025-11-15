import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.log("Protect Error:", err);
    return res.status(401).json({ message: "Not authorized" });
  }
};
