const { prisma } = require('../../config/database');

function makeReference() {
  return 'FR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Whitelist of fields a borrower can write.
function pickWritable(input) {
  const out = {};
  const fields = [
    'title', 'summary', 'description', 'category', 'currency',
    'amountRequested', 'minCommitment', 'maxCommitment',
    'proposedReturnPct', 'durationMonths', 'repaymentFrequency',
  ];
  for (const f of fields) {
    if (input[f] !== undefined) out[f] = input[f];
  }
  return out;
}

async function createRequest(borrowerId, input) {
  return prisma.fundingRequest.create({
    data: {
      reference: makeReference(),
      borrowerId,
      ...pickWritable(input),
      status: 'DRAFT',
    },
    include: { borrower: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
}

async function updateRequest(id, borrowerId, input) {
  const existing = await prisma.fundingRequest.findUnique({ where: { id } });
  if (!existing) return { error: 'NOT_FOUND' };
  if (existing.borrowerId !== borrowerId) return { error: 'FORBIDDEN' };
  if (!['DRAFT', 'SUBMITTED'].includes(existing.status)) return { error: 'LOCKED' };

  return prisma.fundingRequest.update({
    where: { id },
    data: pickWritable(input),
    include: { borrower: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
}

async function submitRequest(id, borrowerId) {
  const existing = await prisma.fundingRequest.findUnique({ where: { id } });
  if (!existing) return { error: 'NOT_FOUND' };
  if (existing.borrowerId !== borrowerId) return { error: 'FORBIDDEN' };
  if (existing.status !== 'DRAFT') return { error: 'INVALID_STATE', status: existing.status };

  return prisma.fundingRequest.update({
    where: { id },
    data: { status: 'SUBMITTED' },
  });
}

async function approveRequest(id, adminId) {
  const existing = await prisma.fundingRequest.findUnique({ where: { id } });
  if (!existing) return { error: 'NOT_FOUND' };
  if (!['SUBMITTED', 'UNDER_REVIEW'].includes(existing.status)) {
    return { error: 'INVALID_STATE', status: existing.status };
  }
  return prisma.fundingRequest.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      reviewedById: adminId,
      reviewedAt: new Date(),
      publishedAt: new Date(),
      fundingDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });
}

async function rejectRequest(id, adminId, reason) {
  const existing = await prisma.fundingRequest.findUnique({ where: { id } });
  if (!existing) return { error: 'NOT_FOUND' };
  if (!['SUBMITTED', 'UNDER_REVIEW'].includes(existing.status)) {
    return { error: 'INVALID_STATE', status: existing.status };
  }
  return prisma.fundingRequest.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
      reviewedById: adminId,
      reviewedAt: new Date(),
    },
  });
}

// Public list: only PUBLISHED. Filters: category, q (title/summary), minReturn.
async function listPublished({ category, q, minReturn, limit = 30, cursor } = {}) {
  const where = { status: 'PUBLISHED' };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (minReturn != null) where.proposedReturnPct = { gte: minReturn };

  const items = await prisma.fundingRequest.findMany({
    where,
    take: Number(limit) + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    include: {
      borrower: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { documents: true } },
    },
  });

  const hasMore = items.length > limit;
  const slice = hasMore ? items.slice(0, limit) : items;
  return { items: slice, nextCursor: hasMore ? slice[slice.length - 1].id : null };
}

async function getById(idOrRef, viewer) {
  const where = idOrRef.startsWith('FR-')
    ? { reference: idOrRef }
    : { id: idOrRef };

  const req = await prisma.fundingRequest.findUnique({
    where,
    include: {
      borrower: { select: { id: true, email: true, firstName: true, lastName: true } },
      documents: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!req) return null;

  const isOwner = viewer?.id && req.borrowerId === viewer.id;
  const isAdmin = viewer?.role === 'ADMIN' || viewer?.role === 'SUPER_ADMIN';
  const isPublic = req.status === 'PUBLISHED' || req.status === 'FUNDED';

  if (isPublic || isOwner || isAdmin) return req;
  return null;
}

async function listMine(borrowerId) {
  return prisma.fundingRequest.findMany({
    where: { borrowerId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { documents: true } } },
  });
}

async function listForReview() {
  return prisma.fundingRequest.findMany({
    where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
    orderBy: { updatedAt: 'asc' },
    include: {
      borrower: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
  });
}

module.exports = {
  createRequest,
  updateRequest,
  submitRequest,
  approveRequest,
  rejectRequest,
  listPublished,
  listForReview,
  getById,
  listMine,
};
