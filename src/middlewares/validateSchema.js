/**
 * Validates the request body against a given schema.
 * 
 * @swagger
 * components:
 *   requestBodies:
 *     GenericSchema:
 *       description: A generic schema for validating request bodies.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 * 
 * @param {Object} schema - The validation schema (e.g., Joi schema).
 * @returns {Function} Middleware function to validate the request body.
 * @throws {Error} If the request body does not match the schema.
 */
export function validateSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body, {
      abortEarly: false, // Do not stop at the first error, return all validation errors.
      allowUnknown: false, // Reject unexpected fields.
      stripUnknown: true, // Remove unexpected fields.
    });

    if (validation.error) {
      const messages = validation.error.details.map(detail => detail.message);
      const error = new Error();
      error.statusCode = 400;
      error.details = messages;
      return next(error);
    }

    // Replace req.body with the validated and sanitized data.
    req.body = validation.value;
    next();
  };
}