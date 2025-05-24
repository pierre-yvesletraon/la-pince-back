/**
 * @swagger
 * components:
 *   responses:
 *     ErrorResponse:
 *       description: A generic error response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 500
 *               message:
 *                 type: string
 *                 example: "An error occurred."
 *               details:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * Handles errors and sends a JSON response with the error details.
 * 
 * @param {Error} error - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with error details.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {

  const status = error.statusCode || 500;
  const message = error.message || "Une erreur est survenue";
  const details = error.details || [];

  return res.status(status).json({ status, message, details });
};