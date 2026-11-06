const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const ctrl = require('./admin.controller');
const { authRequired } = require('../../middleware/auth.middleware');

// Inline admin guard (added by iji.js)
const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

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

/**
 * GET /api/admin/reports/summary
 * Dashboard-level aggregated stats.
 */
router.get('/reports/summary', authRequired, adminOnly, async (req, res, next) => {
  try {
    const [investments, investors, projects, kyc] = await Promise.all([
      prisma.investment.findMany({ where: { status: 'ACTIVE' } }).catch(() => []),
      prisma.user.count({ where: { role: 'INVESTOR' } }).catch(() => 0),
      prisma.project.count({ where: { status: 'OPEN' } }).catch(() => 0),
      prisma.kycSubmission.count({ where: { status: 'PENDING' } }).catch(() => 0),
    ]);

    const totalInvested = investments.reduce(
      (s, i) => s + Number(i.amount || 0),
      0
    );

    res.json({
      totalInvested,
      activeInvestors: investors,
      openProjects: projects,
      pendingKyc: kyc,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/settings
 * Platform configuration (singleton — creates defaults on first read).
 */
router.get('/settings', authRequired, adminOnly, async (req, res, next) => {
  try {
    let settings = await prisma.platformSettings.findFirst().catch(() => null);
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          platformName: 'BraveVest',
          supportEmail: 'support@bravevest.com',
          minInvestment: 5000,
          maxInvestment: 10000000,
          kycRequired: true,
          maintenanceMode: false,
        },
      }).catch(() => ({
        platformName: 'BraveVest',
        supportEmail: 'support@bravevest.com',
        minInvestment: 5000,
        maxInvestment: 10000000,
        kycRequired: true,
        maintenanceMode: false,
      }));
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/settings
 * Updates platform config.
 */
router.patch('/settings', authRequired, adminOnly, async (req, res, next) => {
  try {
    const body = req.body || {};
    let settings = await prisma.platformSettings.findFirst().catch(() => null);

    if (!settings) {
      settings = await prisma.platformSettings.create({ data: body }).catch(
        () => null
      );
    } else {
      settings = await prisma.platformSettings.update({
        where: { id: settings.id },
        data: body,
      }).catch(() => settings);
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
});

