// src/modules/admin/admin.controller.js
const service = require('./admin.service');
const { success } = require('../../utils/apiResponse');

const dashboard = async (req, res) => success(res, await service.dashboardStats());
const listKyc = async (req, res) => {
  const { items, meta } = await service.listKyc(req.query);
  return success(res, items, 'KYC list', 200, meta);
};
const getKyc = async (req, res) => success(res, await service.getKyc(req.params.id));
const approveKyc = async (req, res) => success(res, await service.approveKyc(req.params.id, req.user.id), 'KYC approved');
const rejectKyc = async (req, res) => success(res, await service.rejectKyc(req.params.id, req.user.id, req.body.reason), 'KYC rejected');
const listInvestors = async (req, res) => {
  const { items, meta } = await service.listInvestors(req.query);
  return success(res, items, 'Investors', 200, meta);
};
const getInvestor = async (req, res) => success(res, await service.getInvestor(req.params.id));
const listInvestments = async (req, res) => {
  const { items, meta } = await service.listAllInvestments(req.query);
  return success(res, items, 'Investments', 200, meta);
};
const listTransactions = async (req, res) => {
  const { items, meta } = await service.listTransactions(req.query);
  return success(res, items, 'Transactions', 200, meta);
};

module.exports = { dashboard, listKyc, getKyc, approveKyc, rejectKyc, listInvestors, getInvestor, listInvestments, listTransactions };
