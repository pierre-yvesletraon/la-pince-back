/**
 * Wraps a middleware function to handle errors asynchronously.
 * 
 * @param {Function} middlewareFunction - The middleware function to wrap.
 * @returns {Function} A wrapped middleware function that catches and forwards errors.
 */
export default function controllerWrapper(middlewareFunction) {
  return async (req, res, next) => {
    try {
      await middlewareFunction(req, res, next);
    } catch (error) {
      return next(error); 
    }
  };
}