// src/middleware/validate.js — Zod schema validator
const ApiError = require('../utils/apiError');

/**
 * Usage:  validate({ body: schema })
 *         validate({ query: schema })
 *         validate({ params: schema })
 */
function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        const r = schemas.body.safeParse(req.body);
        if (!r.success) throw ApiError.badRequest('Validation failed', r.error.flatten().fieldErrors);
        req.body = r.data;
      }
      if (schemas.query) {
        const r = schemas.query.safeParse(req.query);
        if (!r.success) throw ApiError.badRequest('Invalid query params', r.error.flatten().fieldErrors);
        req.query = r.data;
      }
      if (schemas.params) {
        const r = schemas.params.safeParse(req.params);
        if (!r.success) throw ApiError.badRequest('Invalid route params', r.error.flatten().fieldErrors);
        req.params = r.data;
      }
      next();
    } catch (err) { next(err); }
  };
}

module.exports = { validate };
