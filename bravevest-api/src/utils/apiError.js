class ApiError extends Error {
  constructor(statusCode, message, code = null, details = null) {
    super(message); this.statusCode = statusCode; this.code = code; this.details = details;
    this.isOperational = true; Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(m = 'Bad request', d) { return new ApiError(400, m, 'BAD_REQUEST', d); }
  static unauthorized(m = 'Unauthorized') { return new ApiError(401, m, 'UNAUTHORIZED'); }
  static forbidden(m = 'Forbidden') { return new ApiError(403, m, 'FORBIDDEN'); }
  static notFound(m = 'Not found') { return new ApiError(404, m, 'NOT_FOUND'); }
  static conflict(m = 'Conflict') { return new ApiError(409, m, 'CONFLICT'); }
  static internal(m = 'Internal error') { return new ApiError(500, m, 'INTERNAL'); }
}
module.exports = ApiError;
