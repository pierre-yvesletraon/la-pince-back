import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Génère un token JWT pour un utilisateur donné.
 * @param {object} payload - Données à inclure dans le token (ex: { id: user.id }).
 * @returns {string} token signé
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
}

/**
 * Génère un JWT de rafraîchissement avec une durée plus longue.
 * @param {Object} payload - Les données à encoder dans le token.
 * @returns {string} Le token JWT signé.
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
}

/**
 * Vérifie un access token retourne son payload.
 * @param {string} token
 * @returns {object} payload décodé
 * @throws {Error} si le token est invalide
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

/**
 * Vérifie un refresh token retourne son payload.
 * @param {string} token
 * @returns {object} payload décodé
 * @throws {Error} si le token est invalide
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}