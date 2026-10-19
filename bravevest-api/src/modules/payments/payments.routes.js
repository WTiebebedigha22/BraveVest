const router = require('express').Router();
const ctrl = require('./payments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.post('/initialize', asyncHandler(ctrl.initialize));
router.get('/verify/:reference', asyncHandler(ctrl.verify));
router.get('/transactions', asyncHandler(ctrl.listMine));
router.get('/wallet', asyncHandler(ctrl.wallet));


// ── Resolve account name via Paystack ─────────────────────────
const axios = require('axios');
router.get('/resolve-account', async (req, res, next) => {
  try {
    const { bank, account } = req.query;
    if (!bank || !account || !/^\d{10}$/.test(String(account))) {
      return res.status(400).json({ success: false, message: 'Provide bank code and 10-digit account number', code: 'VALIDATION_ERROR' });
    }
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) {
      return res.status(503).json({ success: false, message: 'Bank resolution not configured', code: 'PAYSTACK_UNCONFIGURED' });
    }
    const r = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(account)}&bank_code=${encodeURIComponent(bank)}`,
      { headers: { Authorization: `Bearer ${key}` }, timeout: 15000 }
    );
    if (!r.data?.status) {
      return res.status(422).json({ success: false, message: 'Could not resolve account', code: 'RESOLVE_FAILED' });
    }
    return res.json({ success: true, data: { accountName: r.data.data.account_name, accountNumber: r.data.data.account_number } });
  } catch (e) {
    const msg = e?.response?.data?.message ?? e?.message ?? 'Resolve failed';
    return res.status(422).json({ success: false, message: msg, code: 'RESOLVE_FAILED' });
  }
});

module.exports = router;
