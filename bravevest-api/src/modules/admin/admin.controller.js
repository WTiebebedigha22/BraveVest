const { success } = require('../../utils/apiResponse');
const service = require('./admin.service');

async function dashboard(req, res) {
  return success(res, await service.dashboardStats());
}

async function listKyc(req, res) {
  const { status, q, page = 1, limit = 50 } = req.query;
  const { items, total, meta } = await service.listKyc({ status, q, page: Number(page), limit: Number(limit) });
  return success(res, items, 'KYC list', 200, { ...meta, total });
}

async function getKyc(req, res) {
  return success(res, await service.getKyc(req.params.id));
}

async function approveKyc(req, res) {
  return success(res, await service.approveKyc(req.params.id, req.user.id), 'Approved');
}

async function rejectKyc(req, res) {
  return success(res, await service.rejectKyc(req.params.id, req.user.id, req.body.reason), 'Rejected');
}

async function listInvestors(req, res) {
  const { items, meta } = await service.listInvestors(req.query);
  return success(res, items, 'Investors', 200, meta);
}

async function getInvestor(req, res) {
  return success(res, await service.getInvestor(req.params.id));
}

async function suspendInvestor(req, res) {
  return success(res, await service.setInvestorStatus(req.params.id, 'SUSPENDED'), 'Suspended');
}

async function activateInvestor(req, res) {
  return success(res, await service.setInvestorStatus(req.params.id, 'ACTIVE'), 'Activated');
}

async function listInvestments(req, res) {
  const r = await service.listAllInvestments(req.query);
  return success(res, r.items, 'Investments', 200, r.meta);
}

async function listTransactions(req, res) {
  const { items, meta } = await service.listTransactions(req.query);
  return success(res, items, 'Transactions', 200, meta);
}

async function getTransaction(req, res) {
  return success(res, await service.getTransaction(req.params.id));
}

async function listProjects(req, res) {
  const { items, meta } = await service.listProjects(req.query);
  return success(res, items, 'Projects', 200, meta);
}

async function createProject(req, res) {
  return success(res, await service.createProject(req.body, req.user.id), 'Created', 201);
}

async function updateProject(req, res) {
  return success(res, await service.updateProject(req.params.id, req.body), 'Updated');
}

async function updateProjectStatus(req, res) {
  return success(res, await service.updateProjectStatus(req.params.id, req.body.status), 'Status updated');
}

async function deleteProject(req, res) {
  return success(res, await service.deleteProject(req.params.id), 'Deleted');
}

async function listFundingReview(req, res) {
  const { items, total } = await service.listFundingReview();
  return success(res, items, 'Funding review queue', 200, { total });
}

async function getFundingRequest(req, res) {
  return success(res, await service.getFundingRequest(req.params.id));
}

async function approveFunding(req, res) {
  return success(res, await service.approveFunding(req.params.id, req.user.id), 'Approved');
}

async function rejectFunding(req, res) {
  return success(res, await service.rejectFunding(req.params.id, req.user.id, req.body.reason), 'Rejected');
}

async function listContact(req, res) {
  const { items, meta } = await service.listContact(req.query);
  return success(res, items, 'Contact messages', 200, meta);
}

async function updateContact(req, res) {
  return success(res, await service.updateContact(req.params.id, req.body), 'Updated');
}

async function reportKyc(req, res) {
  return success(res, await service.reportKyc(req.query));
}

async function reportPayments(req, res) {
  return success(res, await service.reportPayments(req.query));
}

async function reportInvestments(req, res) {
  return success(res, await service.reportInvestments(req.query));
}

async function reportAudit(req, res) {
  return success(res, await service.reportAudit(req.query));
}

async function recentActivity(req, res) {
  return success(res, await service.recentActivity(Number(req.query.limit) || 20));
}

module.exports = {
  dashboard, listKyc, getKyc, approveKyc, rejectKyc,
  listInvestors, getInvestor, suspendInvestor, activateInvestor,
  listInvestments, listTransactions, getTransaction,
  listProjects, createProject, updateProject, updateProjectStatus, deleteProject,
  listFundingReview, getFundingRequest, approveFunding, rejectFunding,
  listContact, updateContact,
  reportKyc, reportPayments, reportInvestments, reportAudit,
  recentActivity,
};
