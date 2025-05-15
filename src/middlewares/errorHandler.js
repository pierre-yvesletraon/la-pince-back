// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {

  const status = error.statusCode || 500;
  const message = error.message || "Une erreur est survenue";
  const details = error.details || [];

  return res.status(status).json({ status, message, details });
};