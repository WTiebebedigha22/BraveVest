const express = require('express');
const { z } = require('zod');
const { prisma } = require('../../config/database');
const { audit } = require('../../middleware/audit');
const { requireRole } = require('../../middleware/role');
const { success, error } = require('../../utils/apiResponse');
const svc = require('./funding.service');
const { createSchema, updateSchema, rejectSchema } = require('./funding.validators');

const router = express.Router();

// If you already have an `authenticate` middleware, replace this require.
// Fallback: check Authorization header presence and load the user.
let authenticate;
try {
  authenticate = require('../../middleware/authenticate').authenticate
    || require('../../middleware/auth').authenticate
    || require('../../middleware/auth').protect;
} catch {}
if (!authenticate) {
  authenticate = async (req, res, next) => {
    // Minimal: rely on upstream middleware. If req.user isn't set, reject.
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required', code: 'UNAUTHENTICATED' });
    }
    next();
  };
}

const optionalAuth = (req, res, next) => {
  if (req.user) return next();
  // try authenticate but don't fail
  authenticate(req, res, (err) => {
    if (err) return next();
    next();
  });
};

// -------- public --------
// GET /api/funding/requests — list published
router.get('/requests', optionalAuth, async (req, res, next) => {
  try {
    const { category, q, minReturn, limit, cursor } = req.query;
    const result = await svc.listPublished({
      category: category || undefined,
      q: q || undefined,
      minReturn: minReturn ? Number(minReturn) : undefined,
      limit: limit ? Number(limit) : 30,
      cursor: cursor || undefined,
    });
    return success(res, result);
  } catch (e) { next(e); }
});

// GET /api/funding/requests/:id — detail (id or reference)
router.get('/requests/:id', optionalAuth, async (req, res, next) => {
  try {
    const req_ = await svc.getById(req.params.id, req.user || null);
    if (!req_) return res.status(404).json({ success: false, message: 'Funding request not found', code: 'NOT_FOUND' });
    return success(res, req_);
  } catch (e) { next(e); }
});

// -------- borrower --------
router.post(
  '/requests',
  authenticate,
  requireRole('BORROWER', 'ADMIN', 'SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
      }
      const created = await svc.createRequest(req.user.id, parsed.data);
      await audit(req, 'create_funding_request', 'FundingRequest', created.id, { reference: created.reference });
      return res.status(201).json({ success: true, data: created });
    } catch (e) { next(e); }
  }
);

router.get('/mine', authenticate, requireRole('BORROWER', 'ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const items = await svc.listMine(req.user.id);
    return success(res, items);
  } catch (e) { next(e); }
});

router.patch('/requests/:id', authenticate, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
    }
    const result = await svc.updateRequest(req.params.id, req.user.id, parsed.data);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'Not your request', code: 'FORBIDDEN' });
    if (result.error === 'LOCKED') return res.status(409).json({ success: false, message: 'Cannot edit in current status', code: 'LOCKED' });
    await audit(req, 'update_funding_request', 'FundingRequest', result.id);
    return success(res, result);
  } catch (e) { next(e); }
});

router.post('/requests/:id/submit', authenticate, requireRole('BORROWER', 'ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const result = await svc.submitRequest(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'Not your request', code: 'FORBIDDEN' });
    if (result.error === 'INVALID_STATE') return res.status(409).json({ success: false, message: `Cannot submit from ${result.status}`, code: 'INVALID_STATE' });
    await audit(req, 'submit_funding_request', 'FundingRequest', result.id);
    return success(res, result);
  } catch (e) { next(e); }
});

// -------- admin --------
router.get('/review', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const items = await svc.listForReview();
    return success(res, items);
  } catch (e) { next(e); }
});

router.post('/requests/:id/approve', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const result = await svc.approveRequest(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    if (result.error === 'INVALID_STATE') return res.status(409).json({ success: false, message: `Cannot approve from ${result.status}`, code: 'INVALID_STATE' });
    await audit(req, 'approve_funding_request', 'FundingRequest', result.id);
    return success(res, result);
  } catch (e) { next(e); }
});

router.post('/requests/:id/reject', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const parsed = rejectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
    const result = await svc.rejectRequest(req.params.id, req.user.id, parsed.data.reason);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    if (result.error === 'INVALID_STATE') return res.status(409).json({ success: false, message: `Cannot reject from ${result.status}`, code: 'INVALID_STATE' });
    await audit(req, 'reject_funding_request', 'FundingRequest', result.id, { reason: parsed.data.reason });
    return success(res, result);
  } catch (e) { next(e); }
});

module.exports = router;
