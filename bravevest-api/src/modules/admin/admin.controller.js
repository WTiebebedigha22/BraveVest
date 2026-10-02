const service = require('./admin.service');
const { success } = require('../../utils/apiResponse');

async function dashboard(req, res) { return success(res, await service.dashboardStats()); }
async function listKyc(req, res) { const { items, total } = await service.listKyc({ status: req.query.status, page: 1, limit: 100 }); return success(res, items, 'KYC list', 200, { total }); }
async function getKyc(req, res) { return success(res, await service.getKyc(req.params.id)); }
async function approveKyc(req, res) { return success(res, await service.approveKyc(req.params.id, req.user.id), 'Approved'); }
async function rejectKyc(req, res) { return success(res, await service.rejectKyc(req.params.id, req.user.id, req.body.reason), 'Rejected'); }
async function listInvestors(req, res) { const { items, meta } = await service.listInvestors(req.query); return success(res, items, 'Investors', 200, meta); }
async function getInvestor(req, res) { return success(res, await service.getInvestor(req.params.id)); }
async function listInvestments(req, res) { const r = await service.listAllInvestments(req.query); return success(res, r.items, 'Investments', 200, r.meta); }
async function listTransactions(req, res) { const { items, meta } = await service.listTransactions(req.query); return success(res, items, 'Transactions', 200, meta); }

module.exports = { dashboard, listKyc, getKyc, approveKyc, rejectKyc, listInvestors, getInvestor, listInvestments, listTransactions };
