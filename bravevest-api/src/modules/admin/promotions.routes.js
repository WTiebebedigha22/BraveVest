const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const { requireAdmin, requireSuperAdmin } = require('../../middleware/requireAdmin');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const { prisma } = require('../../config/database');

router.post('/', authRequired, requireAdmin, asyncHandler(async (req, res) => {
  const { candidateId, reason } = req.body || {};
  if (!candidateId || !reason || !String(reason).trim()) {
    throw ApiError.badRequest('candidateId and reason are required');
  }
  const candidate = await prisma.user.findUnique({
    where: { id: candidateId },
    select: { id: true, email: true, roles: true },
  });
  if (!candidate) throw ApiError.notFound('Candidate not found');
  if (candidate.roles.includes('ADMIN') || candidate.roles.includes('SUPER_ADMIN')) {
    throw ApiError.badRequest('User is already an admin');
  }
  const existing = await prisma.adminPromotionRequest.findFirst({
    where: { candidateId, status: 'PENDING' },
  });
  if (existing) throw ApiError.conflict('A pending promotion request already exists');
  const created = await prisma.adminPromotionRequest.create({
    data: {
      candidateId,
      requestedById: req.user.id,
      reason: String(reason).trim(),
      status: 'PENDING',
    },
  });
  const supers = await prisma.user.findMany({ where: { roles: { has: 'SUPER_ADMIN' } }, select: { id: true } });
  await Promise.all(supers.map((s) =>
    prisma.notification.create({
      data: {
        userId: s.id,
        type: 'PROMOTION_REQUESTED',
        title: 'New admin promotion request',
        message: 'A request to promote ' + candidate.email + ' to admin needs review.',
        metadata: { promotionId: created.id },
      },
    }).catch(() => {})
  ));
  return success(res, created, 'Promotion request created');
}));

router.get('/', authRequired, requireSuperAdmin, asyncHandler(async (req, res) => {
  const { status = 'PENDING' } = req.query;
  const where = status === 'all' ? {} : { status };
  const items = await prisma.adminPromotionRequest.findMany({
    where,
    include: {
      candidate: { select: { id: true, email: true, firstName: true, lastName: true, roles: true } },
      requestedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
      reviewedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, items, 'Promotion requests retrieved');
}));

router.get('/candidates', authRequired, requireSuperAdmin, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const where = {
    status: 'ACTIVE',
    NOT: [{ roles: { has: 'ADMIN' } }, { roles: { has: 'SUPER_ADMIN' } }],
  };
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    select: { id: true, email: true, firstName: true, lastName: true, roles: true },
    take: 50,
    orderBy: { createdAt: 'desc' },
  });
  return success(res, users, 'Candidates retrieved');
}));

router.patch('/:id/approve', authRequired, requireSuperAdmin, asyncHandler(async (req, res) => {
  const { note } = req.body || {};
  const request = await prisma.adminPromotionRequest.findUnique({ where: { id: req.params.id } });
  if (!request) throw ApiError.notFound('Promotion request not found');
  if (request.status !== 'PENDING') throw ApiError.badRequest('Request is not pending');
  if (request.requestedById === req.user.id) {
    throw ApiError.forbidden('You cannot approve your own promotion request');
  }
  const result = await prisma.$transaction(async (tx) => {
    const candidate = await tx.user.findUnique({ where: { id: request.candidateId } });
    if (!candidate) throw ApiError.notFound('Candidate not found');
    if (!candidate.roles.includes('ADMIN')) {
      await tx.user.update({ where: { id: candidate.id }, data: { roles: { push: 'ADMIN' } } });
    }
    const updated = await tx.adminPromotionRequest.update({
      where: { id: request.id },
      data: { status: 'APPROVED', reviewedById: req.user.id, reviewedAt: new Date(), reviewNote: note ? String(note) : null },
    });
    await tx.notification.create({
      data: {
        userId: request.candidateId,
        type: 'PROMOTED_TO_ADMIN',
        title: 'You are now an admin',
        message: 'Your account has been promoted to admin by a super admin.',
      },
    }).catch(() => {});
    return updated;
  });
  return success(res, result, 'Promotion approved');
}));

router.patch('/:id/reject', authRequired, requireSuperAdmin, asyncHandler(async (req, res) => {
  const { reason } = req.body || {};
  if (!reason || !String(reason).trim()) throw ApiError.badRequest('Rejection reason is required');
  const request = await prisma.adminPromotionRequest.findUnique({ where: { id: req.params.id } });
  if (!request) throw ApiError.notFound('Promotion request not found');
  if (request.status !== 'PENDING') throw ApiError.badRequest('Request is not pending');
  const updated = await prisma.adminPromotionRequest.update({
    where: { id: request.id },
    data: { status: 'REJECTED', reviewedById: req.user.id, reviewedAt: new Date(), reviewNote: String(reason).trim() },
  });
  await prisma.notification.create({
    data: {
      userId: request.requestedById,
      type: 'PROMOTION_REJECTED',
      title: 'Promotion request rejected',
      message: 'Your request was rejected. Reason: ' + String(reason).trim(),
      metadata: { promotionId: request.id },
    },
  }).catch(() => {});
  return success(res, updated, 'Promotion rejected');
}));

module.exports = router;
