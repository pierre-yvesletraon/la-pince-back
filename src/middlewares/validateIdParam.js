import { isPositiveInteger } from "../utils/validators.js";

/**
 * Validates the `id` parameter in the request.
 * 
 * @swagger
 * components:
 *   parameters:
 *     IdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the resource.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - The `id` parameter to validate.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} If the `id` parameter is not a positive integer.
 */
export function validateIdParam(req, res, next) {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    const error = new Error("The provided ID is not valid.");
    error.details = ["The ID must be a positive integer without spaces or special characters."];
    error.statusCode = 400;
    return next(error);
  }

  req.params.id = Number(id);
  next();
}