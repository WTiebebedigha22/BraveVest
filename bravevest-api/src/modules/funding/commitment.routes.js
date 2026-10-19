const express = require('express');
const { z } = require('zod');
const { audit } = require('../../middleware/audit');
const { requireRole } = require('../../middleware/role');
const { success } = require('../../utils/apiResponse');
const svc = require('./commitment.service');

const router = express.Router();

let authenticate;
try {
  authenticate = require('../../middleware/authenticate').authenticate
    || require('../../middleware/auth').authenticate
    || require('../../middleware/auth').protect;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required', code: 'UNAUTHENTICATED' });
    next();
  };
}

const createSchema = z.object({
  requestId: z.string().min(1),
  amount: z.number().positive(),
});

function mapCommitError(err, res) {
  const statusMap = {
    NOT_FOUND: 404, NOT_OPEN: 409, DEADLINE_PASSED: 409,
    INVALID_AMOUNT: 400, BELOW_MIN: 400, ABOVE_MAX: 400,
    OVERFUND: 409, FORBIDDEN: 403, INVALID_STATE: 409,
  };
  return res.status(statusMap[err.code] || 400).json({
    success: false, message: err.message, code: err.code,
  });
}

// POST /api/funding/commitments  { requestId, amount }
router.post('/commitments', authenticate, requireRole('INVESTOR', 'BORROWER', 'ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
    const { requestId, amount } = parsed.data;
    const result = await svc.createCommitment(requestId, req.user.id, amount);
    await audit(req, 'create_commitment', 'Commitment', result.commitment.id, { requestId, amount });
    return res.status(201).json({ success: true, data: result });
  } catch (e) {
    if (e instanceof svc.CommitError) return mapCommitError(e, res);
    next(e);
  }
});

// GET /api/funding/commitments/mine
router.get('/commitments/mine', authenticate, async (req, res, next) => {
  try {
    const items = await svc.listMine(req.user.id);
    return success(res, items);
  } catch (e) { next(e); }
});

// GET /api/funding/requests/:id/commitments
router.get('/requests/:id/commitments', authenticate, async (req, res, next) => {
  try {
    const items = await svc.listForRequest(req.params.id);
    return success(res, items);
  } catch (e) { next(e); }
});

// POST /api/funding/commitments/:id/cancel
router.post('/commitments/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const result = await svc.cancelCommitment(req.params.id, req.user.id);
    await audit(req, 'cancel_commitment', 'Commitment', result.id);
    return success(res, result);
  } catch (e) {
    if (e instanceof svc.CommitError) return mapCommitError(e, res);
    next(e);
  }
});

module.exports = router;
