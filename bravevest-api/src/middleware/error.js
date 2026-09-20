// src/middleware/error.js
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const status = error.statusCode || error.status || 500;
    error = new ApiError(status, error.message || 'Internal server error');
  }

  if (error.statusCode >= 500) {
    logger.error(error.stack || error.message);
  } else {
    logger.warn(`${error.statusCode} ${error.message}`);
  }

  const body = {
    success: false,
    message: error.message,
    code: error.code || undefined,
  };
  if (error.details) body.details = error.details;
  if (env.isDev && error.statusCode >= 500) body.stack = error.stack;

  if (res.headersSent) return next(error);

  res.status(error.statusCode).json(body);
}

module.exports = { notFound, errorHandler };
