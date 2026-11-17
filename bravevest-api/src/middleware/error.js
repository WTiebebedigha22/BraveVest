const env = require('../config/env');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

function notFound(req, res, next) {
  next(ApiError.notFound('Route ' + req.method + ' ' + req.originalUrl + ' not found'));
}

function errorHandler(err, req, res, next) {
  let error = err;
  if (!(error instanceof ApiError)) {
    const wrapped = new ApiError(error.statusCode || 500, error.message || 'Internal server error');
    wrapped.stack = error.stack;
    error = wrapped;
  }

  const status = error.statusCode || 500;
  const isExpected = status >= 400 && status < 500;

  // ── Logging: one line for 4xx, full stack for 5xx ────────
  if (isExpected) {
    logger.warn(`[${status}] ${req.method} ${req.originalUrl} — ${error.message}`);
  } else {
    logger.error('━━━━━━━━━━ RAW ERROR ━━━━━━━━━━');
    logger.error(`[${status}] ${req.method} ${req.originalUrl}`);
    logger.error('message: ' + error.message);
    logger.error('stack:\n' + (error.stack || '(no stack)'));
    logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // ── Response ────────────────────────────────────────────
  if (res.headersSent) return next(error);

  const body = {
    success: false,
    message: error.message,
    code: error.code || undefined,
  };
  if (error.details) body.details = error.details;
  if (env.isDev && !isExpected) body.stack = error.stack;   // stack only in dev, only for 5xx

  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };