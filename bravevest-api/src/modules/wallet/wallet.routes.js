const express = require('express');
const { z } = require('zod');
const svc = require('./wallet.service');
const { success } = require('../../utils/apiResponse');
const { audit } = require('../../middleware/audit');

const router = express.Router();

let authenticate;
try {
  authenticate = require('../../middleware/auth').authRequired;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required' });
    next();
  };
}

// GET /api/wallet — current balance + currency
router.get('/', authenticate, async (req, res, next) => {
  try {
    const wallet = await svc.getWallet(req.user.id);
    return success(res, {
      balance: Number(wallet.balance),
      held: Number(wallet.held),
      currency: wallet.currency,
    });
  } catch (e) { next(e); }
});

// GET /api/wallet/ledger — recent transactions
router.get('/ledger', authenticate, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const entries = await svc.getRecentLedger(req.user.id, limit);
    return success(res, entries.map((e) => ({
      id: e.id,
      reference: e.reference,
      type: e.type,
      direction: e.direction,
      amount: Number(e.amount),
      balanceAfter: e.balanceAfter != null ? Number(e.balanceAfter) : null,
      description: e.description,
      createdAt: e.createdAt,
    })));
  } catch (e) { next(e); }
});

// POST /api/wallet/credit — admin / system use only.
// The public deposit flow uses /api/payments/initialize which triggers this
// via webhook. This endpoint exists for manual credits (refunds, bonuses).
const creditSchema = z.object({
  amount: z.number().positive(),
  type: z.string().default('manual'),
  description: z.string().max(200).optional(),
  userId: z.string().optional(), // admin can credit another user
});
router.post('/credit', authenticate, async (req, res, next) => {
  try {
    // Only admins can manually credit (the webhook uses the service directly)
    const roles = req.user.roles || (req.user.role ? [req.user.role] : []);
    if (!roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')) {
      return res.status(403).json({ success: false, message: 'Admin only', code: 'FORBIDDEN' });
    }
    const parsed = creditSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', issues: parsed.error.issues });
    const target = parsed.data.userId || req.user.id;
    const result = await svc.credit(target, parsed.data.amount, {
      type: parsed.data.type,
      description: parsed.data.description,
    });
    await audit(req, 'wallet_credit', 'Wallet', target, { amount: parsed.data.amount, type: parsed.data.type });
    return success(res, {
      balance: Number(result.wallet.balance),
      entry: { id: result.entry.id, reference: result.entry.reference },
    });
  } catch (e) { next(e); }
});

module.exports = router;
