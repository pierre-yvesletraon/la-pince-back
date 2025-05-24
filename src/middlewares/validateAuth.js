import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Validates the authorization header and verifies the access token.
 * 
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - BearerAuth: []
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} If the authorization header is missing or the token is invalid.
 */
export function validateAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized access.");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.message = "Session expired.";
      error.statusCode = 401;
      error.details = ["Please log in again."];
    } else {
      error.message = "Unauthorized access.";
      error.statusCode = 401;
    }
    return next(error);
  }
}