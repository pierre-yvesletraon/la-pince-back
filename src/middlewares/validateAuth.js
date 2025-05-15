import { verifyAccessToken } from "../utils/jwt.js";

export function validateAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Accès non autorisé.");
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
      error.message = "Session expirée";
      error.statusCode = 401;
      error.details = ["Veuillez vous reconnecter."];
    } else {
      error.message = "Accès non autorisé.";
      error.statusCode = 401;
    }
    return next(error);
  }
}