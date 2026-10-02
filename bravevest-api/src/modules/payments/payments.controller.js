const service = require('./payments.service');
const { success, created } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');

async function initialize(req, res) { return created(res, await service.initializeForInvestment(req.user.id, req.body.investmentId), 'Payment initialized'); }
async function verify(req, res) {
  const reference = req.params.reference || req.query.reference;
  if (!reference) throw ApiError.badRequest('reference is required');
  const r = await service.verifyAndConfirm(reference);
  return success(res, r, r.success ? 'Verified' : 'Not successful');
}
async function listMine(req, res) { const { items, meta } = await service.listMine(req.user.id, req.query); return success(res, items, 'Transactions', 200, meta); }
async function wallet(req, res) { return success(res, await service.walletSummary(req.user.id)); }

module.exports = { initialize, verify, listMine, wallet };
