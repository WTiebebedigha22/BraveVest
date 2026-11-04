const { prisma } = require('../../config/database');

// ---------- Dashboard ----------
async function dashboardStats() {
  const [totalUsers, pendingKyc, pendingFunding, totalInvested, activeInvestments, totalTransactions] = await Promise.all([
    prisma.user.count(),
    prisma.kycProfile.count({ where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
    prisma.fundingRequest.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.investment.aggregate({ where: { status: { in: ['CONFIRMED', 'ACTIVE'] } }, _sum: { amount: true } }),
    prisma.investment.count({ where: { status: 'ACTIVE' } }),
    prisma.transaction.count(),
  ]);
  return {
    totalUsers,
    pendingKyc,
    pendingFunding,
    totalInvested: Number(totalInvested._sum.amount || 0),
    activeInvestments,
    totalTransactions,
  };
}

// ---------- KYC ----------
async function listKyc({ status, q, page = 1, limit = 50 }) {
  const where = {};
  if (status) where.status = status;
  if (q) {
    where.user = {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ],
    };
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.kycProfile.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, createdAt: true } } },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.kycProfile.count({ where }),
  ]);
  return { items, total, meta: { page, limit, total } };
}

async function getKyc(id) {
  return prisma.kycProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, phone: true, firstName: true, lastName: true, createdAt: true } },
    },
  });
}

async function approveKyc(id, adminId) {
  return prisma.kycProfile.update({
    where: { id },
    data: { status: 'APPROVED', reviewedAt: new Date(), reviewedById: adminId },
  });
}

async function rejectKyc(id, adminId, reason) {
  return prisma.kycProfile.update({
    where: { id },
    data: { status: 'REJECTED', rejectionNote: reason, reviewedAt: new Date(), reviewedById: adminId },
  });
}

// ---------- Investors ----------
async function listInvestors({ q, role, page = 1, limit = 50 }) {
  const where = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (role) where.roles = { has: role };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, phone: true, firstName: true, lastName: true,
        roles: true, status: true, createdAt: true,
        kyc: { select: { status: true } },
        _count: { select: { investments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.user.count({ where }),
  ]);
  return { items, meta: { page: Number(page), limit: Number(limit), total } };
}

async function getInvestor(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, phone: true, firstName: true, lastName: true,
      roles: true, status: true, createdAt: true,
      kyc: true,
      investments: { include: { project: { select: { id: true, title: true } } }, take: 20 },
      transactions: { take: 20, orderBy: { createdAt: 'desc' } },
    },
  });
}

async function setInvestorStatus(id, status) {
  return prisma.user.update({ where: { id }, data: { status } });
}

// ---------- Investments ----------
async function listAllInvestments({ status, page = 1, limit = 50 }) {
  const where = {};
  if (status) where.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.investment.findMany({
      where,
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        project: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.investment.count({ where }),
  ]);
  return { items, meta: { page: Number(page), limit: Number(limit), total } };
}

// ---------- Transactions ----------
async function listTransactions({ status, type, page = 1, limit = 50 }) {
  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.transaction.count({ where }),
  ]);
  return { items, meta: { page: Number(page), limit: Number(limit), total } };
}

async function getTransaction(id) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      investment: { include: { project: true } },
    },
  });
}

// ---------- Projects ----------
async function listProjects({ status, category, page = 1, limit = 50 }) {
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.project.count({ where }),
  ]);
  return { items, meta: { page: Number(page), limit: Number(limit), total } };
}

async function createProject(data, adminId) {
  return prisma.project.create({
    data: {
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      targetAmount: data.targetAmount,
      minInvestment: data.minInvestment,
      expectedReturnPct: data.expectedReturnPct,
      tenorMonths: data.tenorMonths,
      status: data.status || 'DRAFT',
      createdById: adminId,
    },
  });
}

async function updateProject(id, data) {
  return prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      targetAmount: data.targetAmount,
      minInvestment: data.minInvestment,
      expectedReturnPct: data.expectedReturnPct,
      tenorMonths: data.tenorMonths,
    },
  });
}

async function updateProjectStatus(id, status) {
  return prisma.project.update({ where: { id }, data: { status } });
}

async function deleteProject(id) {
  return prisma.project.delete({ where: { id } });
}

// ---------- Funding review ----------
async function listFundingReview() {
  const items = await prisma.fundingRequest.findMany({
    where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
    include: { borrower: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: { updatedAt: 'asc' },
  });
  return { items, total: items.length };
}

async function getFundingRequest(id) {
  return prisma.fundingRequest.findUnique({
    where: { id },
    include: { borrower: { select: { email: true, firstName: true, lastName: true, kyc: true } } },
  });
}

async function approveFunding(id, adminId) {
  return prisma.fundingRequest.update({
    where: { id },
    data: { status: 'PUBLISHED', reviewedById: adminId, reviewedAt: new Date(), publishedAt: new Date() },
  });
}

async function rejectFunding(id, adminId, reason) {
  return prisma.fundingRequest.update({
    where: { id },
    data: { status: 'REJECTED', rejectionReason: reason, reviewedById: adminId, reviewedAt: new Date() },
  });
}

// ---------- Contact ----------
async function listContact({ status, page = 1, limit = 50 }) {
  const where = {};
  if (status) where.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.contactMessage.count({ where }),
  ]);
  return { items, meta: { page: Number(page), limit: Number(limit), total } };
}

async function updateContact(id, data) {
  return prisma.contactMessage.update({
    where: { id },
    data: { status: data.status, notes: data.notes },
  });
}

// ---------- Reports ----------
async function reportKyc({ from, to }) {
  const where = {};
  if (from) where.createdAt = { gte: new Date(from) };
  if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };
  const [total, approved, rejected, pending] = await Promise.all([
    prisma.kycProfile.count({ where }),
    prisma.kycProfile.count({ where: { ...where, status: 'APPROVED' } }),
    prisma.kycProfile.count({ where: { ...where, status: 'REJECTED' } }),
    prisma.kycProfile.count({ where: { ...where, status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
  ]);
  return { total, approved, rejected, pending };
}

async function reportPayments({ from, to }) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  const [total, success, failed, sum] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.count({ where: { ...where, status: 'SUCCESS' } }),
    prisma.transaction.count({ where: { ...where, status: 'FAILED' } }),
    prisma.transaction.aggregate({ where: { ...where, status: 'SUCCESS' }, _sum: { amount: true } }),
  ]);
  return { total, success, failed, volume: Number(sum._sum.amount || 0) };
}

async function reportInvestments({ from, to }) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  const [count, sum] = await Promise.all([
    prisma.investment.count({ where }),
    prisma.investment.aggregate({ where, _sum: { amount: true } }),
  ]);
  return { count, volume: Number(sum._sum.amount || 0) };
}

async function reportAudit({ from, to, limit = 100 }) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  return prisma.auditLog.findMany({
    where,
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
  });
}

async function recentActivity(limit = 20) {
  return prisma.auditLog.findMany({
    include: { user: { select: { email: true, firstName: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

module.exports = {
  dashboardStats,
  listKyc, getKyc, approveKyc, rejectKyc,
  listInvestors, getInvestor, setInvestorStatus,
  listAllInvestments,
  listTransactions, getTransaction,
  listProjects, createProject, updateProject, updateProjectStatus, deleteProject,
  listFundingReview, getFundingRequest, approveFunding, rejectFunding,
  listContact, updateContact,
  reportKyc, reportPayments, reportInvestments, reportAudit,
  recentActivity,
};
