const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ctrl = require('./admin.controller');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');

const router = express.Router();

// Every admin route requires auth + ADMIN or SUPER_ADMIN role
router.use(authRequired);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

// Dashboard
router.get('/dashboard', asyncHandler(ctrl.dashboard));

// KYC
router.get('/kyc', asyncHandler(ctrl.listKyc));
router.get('/kyc/:id', asyncHandler(ctrl.getKyc));
router.patch('/kyc/:id/approve', asyncHandler(ctrl.approveKyc));
router.patch('/kyc/:id/reject', asyncHandler(ctrl.rejectKyc));

// Investors
router.get('/investors', asyncHandler(ctrl.listInvestors));
router.get('/investors/:id', asyncHandler(ctrl.getInvestor));
router.patch('/investors/:id/suspend', asyncHandler(ctrl.suspendInvestor));
router.patch('/investors/:id/activate', asyncHandler(ctrl.activateInvestor));

// Investments
router.get('/investments', asyncHandler(ctrl.listInvestments));

// Transactions
router.get('/transactions', asyncHandler(ctrl.listTransactions));
router.get('/transactions/:id', asyncHandler(ctrl.getTransaction));

// Projects (new)
router.get('/projects', asyncHandler(ctrl.listProjects));
router.post('/projects', asyncHandler(ctrl.createProject));
router.patch('/projects/:id', asyncHandler(ctrl.updateProject));
router.patch('/projects/:id/status', asyncHandler(ctrl.updateProjectStatus));
router.delete('/projects/:id', asyncHandler(ctrl.deleteProject));

// Funding review (new)
router.get('/funding/review', asyncHandler(ctrl.listFundingReview));
router.get('/funding/:id', asyncHandler(ctrl.getFundingRequest));
router.patch('/funding/:id/approve', asyncHandler(ctrl.approveFunding));
router.patch('/funding/:id/reject', asyncHandler(ctrl.rejectFunding));

// Contact inbox (new)
router.get('/contact', asyncHandler(ctrl.listContact));
router.patch('/contact/:id', asyncHandler(ctrl.updateContact));

// Reports (new)
router.get('/reports/kyc', asyncHandler(ctrl.reportKyc));
router.get('/reports/payments', asyncHandler(ctrl.reportPayments));
router.get('/reports/investments', asyncHandler(ctrl.reportInvestments));
router.get('/reports/audit', asyncHandler(ctrl.reportAudit));

// Activity
router.get('/activity', asyncHandler(ctrl.recentActivity));

module.exports = router;
