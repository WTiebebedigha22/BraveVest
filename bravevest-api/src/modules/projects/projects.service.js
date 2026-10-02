const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { uniqueSlug } = require('../../utils/slug');
const { getPagination, paginatedMeta } = require('../../utils/pagination');

function decorate(p) {
  const target = Number(p.targetAmount), raised = Number(p.raisedAmount);
  return { ...p, targetAmount: target, raisedAmount: raised, minInvestment: Number(p.minInvestment), expectedReturnPct: Number(p.expectedReturnPct), percentFunded: target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0 };
}

async function list({ category, status, featured, q, page, limit, adminView = false }) {
  const where = {};
  if (adminView) { if (status) where.status = status; }
  else where.status = status && ['OPEN', 'FUNDED'].includes(status) ? status : 'OPEN';
  if (category) where.category = category;
  if (featured === 'true') where.isFeatured = true;
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { summary: { contains: q, mode: 'insensitive' } }];
  const { page: pg, limit: lm, skip } = getPagination({ page, limit });
  const [items, total] = await Promise.all([
    prisma.project.findMany({ where, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }], skip, take: lm, include: { _count: { select: { investments: true } } } }),
    prisma.project.count({ where }),
  ]);
  return { items: items.map(decorate), meta: paginatedMeta(total, pg, lm) };
}

async function getBySlug(slug) {
  const p = await prisma.project.findUnique({ where: { slug }, include: { _count: { select: { investments: true } } } });
  if (!p) throw ApiError.notFound('Project not found');
  return decorate(p);
}

async function create(adminId, payload) {
  const slug = await uniqueSlug(prisma, payload.title);
  const data = { ...payload, slug, status: 'OPEN', createdById: adminId, startDate: payload.startDate ? new Date(payload.startDate) : null, endDate: payload.endDate ? new Date(payload.endDate) : null, closesAt: payload.closesAt ? new Date(payload.closesAt) : null };
  return decorate(await prisma.project.create({ data }));
}

async function update(id, payload) {
  const data = { ...payload };
  if (payload.startDate) data.startDate = new Date(payload.startDate);
  if (payload.endDate) data.endDate = new Date(payload.endDate);
  if (payload.closesAt) data.closesAt = new Date(payload.closesAt);
  return decorate(await prisma.project.update({ where: { id }, data }));
}

async function updateStatus(id, status) { return decorate(await prisma.project.update({ where: { id }, data: { status } })); }
async function remove(id) {
  const existing = await prisma.project.findUnique({ where: { id }, include: { investments: true } });
  if (existing?.investments.length > 0) throw ApiError.conflict('Cannot delete project with investments');
  await prisma.project.delete({ where: { id } });
}
async function listAdmin(query) { return list({ ...query, adminView: true }); }

module.exports = { list, listAdmin, getBySlug, create, update, updateStatus, remove, decorate };
