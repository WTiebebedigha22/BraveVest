const express = require('express');
const { prisma } = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Admin: list all
router.get('/admin/list', requireAuth, requireAdmin, async (_req, res) => {
  const insights = await prisma.insight.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ data: insights });
});

// Public: get single (admins can view drafts)
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  const insight = await prisma.insight.findUnique({ where: { id: req.params.id } });
  if (!insight) return res.status(404).json({ error: 'not_found' });
  res.json({ data: insight });
});

// Admin: create
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, summary, category, body, coverImage, isPublished } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'missing_fields' });
  const insight = await prisma.insight.create({
    data: {
      title,
      summary: summary || '',
      category: category || 'General',
      body,
      coverImage: coverImage || null,
      isPublished: !!isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });
  res.status(201).json({ data: insight });
});

// Admin: update
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, summary, category, body, coverImage, isPublished } = req.body;
  const data = {};
  if (title !== undefined) data.title = title;
  if (summary !== undefined) data.summary = summary;
  if (category !== undefined) data.category = category;
  if (body !== undefined) data.body = body;
  if (coverImage !== undefined) data.coverImage = coverImage;
  if (isPublished !== undefined) {
    data.isPublished = !!isPublished;
    data.publishedAt = isPublished ? new Date() : null;
  }
  const insight = await prisma.insight.update({ where: { id: req.params.id }, data });
  res.json({ data: insight });
});

module.exports = router;