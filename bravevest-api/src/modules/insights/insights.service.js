// src/modules/insights/insights.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/* ── Public ── */
async function list({ category, limit = 20, includeDrafts = false } = {}) {
  const where = includeDrafts ? {} : { isPublished: true };
  if (category) where.category = category;
  return prisma.insight.findMany({
    where,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

async function getByIdOrSlug(idOrSlug, { allowDraft = false } = {}) {
  const where = allowDraft
    ? { OR: [{ id: idOrSlug }, { id: idOrSlug }] }
    : { id: idOrSlug, isPublished: true };
  const insight = await prisma.insight.findFirst({ where });
  if (!insight) throw ApiError.notFound('Insight not found');
  return insight;
}

/* ── Admin ── */
async function adminList({ status, category, page = 1, limit = 50 } = {}) {
  const where = {};
  if (category) where.category = category;
  if (status === 'published') where.isPublished = true;
  if (status === 'draft') where.isPublished = false;

  const [items, total] = await Promise.all([
    prisma.insight.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.insight.count({ where }),
  ]);
  return { items, total, page, limit };
}

async function create(authorId, payload) {
  const insight = await prisma.insight.create({
    data: {
      title: payload.title,
      summary: payload.summary || '',
      body: payload.body || '',
      category: payload.category || 'General',
      coverImage: payload.coverImage || null,
      isPublished: !!payload.isPublished,
      publishedAt: payload.isPublished ? new Date() : null,
    },
  });
  logger.info('Insight created: ' + insight.id + ' by ' + authorId);
  return insight;
}

async function update(id, payload) {
  const existing = await prisma.insight.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Insight not found');

  const data = {};
  if (payload.title !== undefined) data.title = payload.title;
  if (payload.summary !== undefined) data.summary = payload.summary;
  if (payload.body !== undefined) data.body = payload.body;
  if (payload.category !== undefined) data.category = payload.category;
  if (payload.coverImage !== undefined) data.coverImage = payload.coverImage || null;

  if (payload.isPublished !== undefined) {
    data.isPublished = !!payload.isPublished;
    if (payload.isPublished && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  const updated = await prisma.insight.update({ where: { id }, data });
  logger.info('Insight updated: ' + id);
  return updated;
}

async function remove(id) {
  const existing = await prisma.insight.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Insight not found');
  await prisma.insight.delete({ where: { id } });
  logger.info('Insight deleted: ' + id);
  return { deleted: true };
}

async function togglePublish(id) {
  const existing = await prisma.insight.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Insight not found');
  const next = !existing.isPublished;
  const updated = await prisma.insight.update({
    where: { id },
    data: {
      isPublished: next,
      publishedAt: next ? (existing.publishedAt || new Date()) : null,
    },
  });
  logger.info('Insight ' + (next ? 'published' : 'unpublished') + ': ' + id);
  return updated;
}

module.exports = { list, getByIdOrSlug, adminList, create, update, remove, togglePublish };
