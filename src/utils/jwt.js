import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Generates a JWT access token for a given payload.
 * 
 * @param {Object} payload - The data to include in the token (e.g., { id: user.id }).
 * @returns {string} The signed JWT token.
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
}

/**
 * Generates a JWT refresh token with a longer expiration time.
 * 
 * @param {Object} payload - The data to encode in the token.
 * @returns {string} The signed JWT token.
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
}

/**
 * Verifies an access token and returns its payload.
 * 
 * @param {string} token - The JWT access token to verify.
 * @returns {Object} The decoded payload.
 * @throws {Error} If the token is invalid.
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

/**
 * Verifies a refresh token and returns its payload.
 * 
 * @param {string} token - The JWT refresh token to verify.
 * @returns {Object} The decoded payload.
 * @throws {Error} If the token is invalid.
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}