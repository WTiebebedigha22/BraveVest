const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

async function listPublished({ limit = 50 } = {}) {
  return prisma.story.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { publishedAt: 'desc' }],
    take: limit,
  });
}

async function getPublishedById(id) {
  const s = await prisma.story.findFirst({ where: { id, isPublished: true } });
  if (!s) throw ApiError.notFound('Story not found');
  return s;
}

async function adminList({ status, page = 1, limit = 50 } = {}) {
  const where = {};
  if (status === 'published') where.isPublished = true;
  if (status === 'draft') where.isPublished = false;
  const [items, total] = await Promise.all([
    prisma.story.findMany({ where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], skip: (page - 1) * limit, take: limit }),
    prisma.story.count({ where }),
  ]);
  return { items, total };
}

async function adminGet(id) {
  const s = await prisma.story.findUnique({ where: { id } });
  if (!s) throw ApiError.notFound();
  return s;
}

async function create(body) {
  return prisma.story.create({
    data: {
      name: body.name,
      role: body.role,
      quote: body.quote,
      highlight: body.highlight || null,
      avatarText: body.avatarText || null,
      imageUrl: body.imageUrl || null,
      isPublished: !!body.isPublished,
      isFeatured: !!body.isFeatured,
      order: Number(body.order) || 0,
      publishedAt: body.isPublished ? new Date() : null,
    },
  });
}

async function update(id, body) {
  const existing = await prisma.story.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const data = {};
  for (const k of ['name', 'role', 'quote', 'highlight', 'avatarText', 'imageUrl']) {
    if (body[k] !== undefined) data[k] = body[k] || null;
  }
  if (body.order !== undefined) data.order = Number(body.order) || 0;
  if (body.isFeatured !== undefined) data.isFeatured = !!body.isFeatured;
  if (body.isPublished !== undefined) {
    data.isPublished = !!body.isPublished;
    if (body.isPublished && !existing.publishedAt) data.publishedAt = new Date();
  }
  return prisma.story.update({ where: { id }, data });
}

async function remove(id) {
  await prisma.story.delete({ where: { id } });
}

module.exports = { listPublished, getPublishedById, adminList, adminGet, create, update, remove };
