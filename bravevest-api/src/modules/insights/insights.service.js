const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

async function list({ category, limit = 20 } = {}) {
  const where = { isPublished: true };
  if (category) where.category = category;
  return prisma.insight.findMany({ where, orderBy: { publishedAt: 'desc' }, take: limit });
}
async function getByIdOrSlug(id) {
  const i = await prisma.insight.findFirst({ where: { OR: [{ id }, { id }], isPublished: true } });
  if (!i) throw ApiError.notFound('Not found');
  return i;
}
async function adminList({ status, page = 1, limit = 50 } = {}) {
  const where = {};
  if (status === 'published') where.isPublished = true;
  if (status === 'draft') where.isPublished = false;
  const [items, total] = await Promise.all([
    prisma.insight.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.insight.count({ where }),
  ]);
  return { items, total };
}
async function adminGet(id) { const i = await prisma.insight.findUnique({ where: { id } }); if (!i) throw ApiError.notFound(); return i; }
async function create(authorId, p) {
  return prisma.insight.create({ data: { title: p.title, summary: p.summary || '', body: p.body || '', category: p.category || 'General', coverImage: p.coverImage || null, isPublished: !!p.isPublished, publishedAt: p.isPublished ? new Date() : null } });
}
async function update(id, p) {
  const existing = await prisma.insight.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const data = {};
  for (const k of ['title', 'summary', 'body', 'category']) if (p[k] !== undefined) data[k] = p[k];
  if (p.coverImage !== undefined) data.coverImage = p.coverImage || null;
  if (p.isPublished !== undefined) {
    data.isPublished = !!p.isPublished;
    if (p.isPublished && !existing.publishedAt) data.publishedAt = new Date();
  }
  return prisma.insight.update({ where: { id }, data });
}
async function remove(id) { await prisma.insight.delete({ where: { id } }); }
async function togglePublish(id) {
  const i = await prisma.insight.findUnique({ where: { id } });
  if (!i) throw ApiError.notFound();
  const next = !i.isPublished;
  return prisma.insight.update({ where: { id }, data: { isPublished: next, publishedAt: next ? (i.publishedAt || new Date()) : null } });
}
module.exports = { list, getByIdOrSlug, adminList, adminGet, create, update, remove, togglePublish };
