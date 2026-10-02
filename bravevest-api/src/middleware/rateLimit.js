const rateLimit = require('express-rate-limit');
module.exports = {
  globalLimiter: rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many requests.' } }),
  authLimiter: rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many auth attempts.' } }),
  paymentLimiter: rateLimit({ windowMs: 15 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many payment requests.' } }),
};
