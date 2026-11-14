const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/requireAdmin');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const { prisma } = require('../../config/database');

function inferRisk(fr) {
  const rate = Number(fr.proposedReturnPct ?? 0);
  if (rate >= 18) return 'High';
  if (rate >= 14) return 'Medium';
  return 'Low';
}

function inferUrgency(fr) {
  if (!fr.fundingDeadline) return 'Low';
  const days = Math.ceil((new Date(fr.fundingDeadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days <= 7) return 'High';
  if (days <= 30) return 'Medium';
  return 'Low';
}

router.get('/', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const { category, risk, urgency, status = 'SUBMITTED', q } = req.query;
  const where = {};
  if (status && status !== 'all') {
    where.status = status;
  } else {
    where.status = { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] };
  }
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
      { reference: { contains: q, mode: 'insensitive' } },
    ];
  }
  const raw = await prisma.fundingRequest.findMany({
    where,
    include: {
      borrower: { select: { id: true, firstName: true, lastName: true, email: true, image: true } },
      reviewedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      _count: { select: { documents: true, commitments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  let items = raw.map((fr) => ({ ...fr, riskLevel: inferRisk(fr), urgency: inferUrgency(fr) }));
  if (risk) items = items.filter((i) => i.riskLevel === risk);
  if (urgency) items = items.filter((i) => i.urgency === urgency);
  return success(res, items, 'Submissions retrieved');
}));

router.get('/:id', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const fr = await prisma.fundingRequest.findUnique({
    where: { id: req.params.id },
    include: {
      borrower: {
        select: {
          id: true, firstName: true, lastName: true, email: true, phone: true, image: true,
          kyc: { select: { status: true } },
        },
      },
      documents: true,
      reviewedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      commitments: { include: { investor: { select: { id: true, firstName: true, lastName: true, email: true } } } },
    },
  });
  if (!fr) throw ApiError.notFound('Submission not found');
  return success(res, fr, 'Submission retrieved');
}));

router.patch('/:id/accept', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const { note } = req.body || {};
  const fr = await prisma.fundingRequest.findUnique({ where: { id: req.params.id } });
  if (!fr) throw ApiError.notFound('Submission not found');
  if (!['SUBMITTED', 'UNDER_REVIEW'].includes(fr.status)) {
    throw ApiError.badRequest('Only SUBMITTED or UNDER_REVIEW can be accepted');
  }
  const updated = await prisma.fundingRequest.update({
    where: { id: fr.id },
    data: {
      status: 'APPROVED',
      reviewedById: req.user.id,
      reviewedAt: new Date(),
      rejectionReason: null,
      managerNotes: note ? (fr.managerNotes ? fr.managerNotes + '\n\n' + note : note) : fr.managerNotes,
    },
  });
  try {
    await prisma.notification.create({
      data: {
        userId: fr.borrowerId,
        type: 'SUBMISSION_ACCEPTED',
        title: 'Submission accepted',
        message: 'Your submission "' + fr.title + '" was accepted.',
        metadata: { fundingRequestId: fr.id },
      },
    });
  } catch (e) {}
  return success(res, updated, 'Submission accepted');
}));

router.patch('/:id/reject', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const { reason } = req.body || {};
  if (!reason || !String(reason).trim()) throw ApiError.badRequest('Rejection reason is required');
  const fr = await prisma.fundingRequest.findUnique({ where: { id: req.params.id } });
  if (!fr) throw ApiError.notFound('Submission not found');
  if (!['SUBMITTED', 'UNDER_REVIEW'].includes(fr.status)) {
    throw ApiError.badRequest('Only SUBMITTED or UNDER_REVIEW can be rejected');
  }
  const updated = await prisma.fundingRequest.update({
    where: { id: fr.id },
    data: {
      status: 'REJECTED',
      reviewedById: req.user.id,
      reviewedAt: new Date(),
      rejectionReason: String(reason).trim(),
    },
  });
  try {
    await prisma.notification.create({
      data: {
        userId: fr.borrowerId,
        type: 'SUBMISSION_REJECTED',
        title: 'Submission rejected',
        message: 'Your submission "' + fr.title + '" was rejected. Reason: ' + String(reason).trim(),
        metadata: { fundingRequestId: fr.id },
      },
    });
  } catch (e) {}
  return success(res, updated, 'Submission rejected');
}));

router.patch('/:id/review', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const fr = await prisma.fundingRequest.findUnique({ where: { id: req.params.id } });
  if (!fr) throw ApiError.notFound('Submission not found');
  if (fr.status !== 'SUBMITTED') throw ApiError.badRequest('Only SUBMITTED can be marked under review');
  const updated = await prisma.fundingRequest.update({
    where: { id: fr.id },
    data: { status: 'UNDER_REVIEW', reviewedById: req.user.id },
  });
  return success(res, updated, 'Marked as under review');
}));

module.exports = router;
