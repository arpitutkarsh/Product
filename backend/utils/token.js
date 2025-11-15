import jwt from "jsonwebtoken";

/**
 * Sign an Access Token
 * @param {Object} admin - Admin object
 * @returns {string} JWT access token
 */
export const signAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

/**
 * Sign a Refresh Token
 * @param {Object} admin - Admin object
 * @returns {string} JWT refresh token
 */
export const signRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {Object} decoded payload
 * @throws {Error} if token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {Object} decoded payload
 * @throws {Error} if token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
