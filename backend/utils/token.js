import jwt from "jsonwebtoken";

/** Sign Access Token */
export const signAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

/** Sign Refresh Token */
export const signRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
};

/** Verify Refresh Token */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
