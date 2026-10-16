const rateLimit = require('express-rate-limit');

// 5 submissions per IP per hour. Generous enough for a real user
// who fat-fingers the form, tight enough to slow bots.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact submissions. Try again later.',
    code: 'RATE_LIMITED',
  },
});

module.exports = { contactLimiter };
