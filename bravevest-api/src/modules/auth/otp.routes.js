const express = require('express');
const { z } = require('zod');
const svc = require('./otp.service');
const { success } = require('../../utils/apiResponse');

const router = express.Router();

let authenticate;
try {
  authenticate = require('../../middleware/auth.middleware').authRequired;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required' });
    next();
  };
}

// POST /api/auth/otp/send
router.post('/send', authenticate, async (req, res, next) => {
  try {
    const purpose = (req.body?.purpose || 'login').slice(0, 30);
    const result = await svc.sendOtp(req.user.id, purpose);
    return success(res, result);
  } catch (e) { next(e); }
});

// POST /api/auth/otp/verify
router.post('/verify', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ code: z.string().length(6), purpose: z.string().default('login') });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload' });

    const result = await svc.verifyOtp(req.user.id, parsed.data.code, parsed.data.purpose);
    if (!result.valid) return res.status(400).json({ success: false, message: result.error });
    return success(res, { verified: true });
  } catch (e) { next(e); }
});

module.exports = router;
