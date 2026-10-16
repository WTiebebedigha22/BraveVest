const express = require('express');
const { prisma } = require('../../config/database');
const { requireRole } = require('../../middleware/role');
const { audit } = require('../../middleware/audit');
const { success } = require('../../utils/apiResponse');
const logger = require('../../config/logger');
const { createSchema, updateSchema } = require('./contact.validators');
const { contactLimiter } = require('./contact.ratelimit');

const router = express.Router();

// ---------- auth (best-effort import, same pattern as funding) ----------
let authenticate;
try {
  authenticate = require('../../middleware/authenticate').authenticate
    || require('../../middleware/auth').authenticate
    || require('../../middleware/auth').protect;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required', code: 'UNAUTHENTICATED' });
    next();
  };
}

// ============================================================
// POST /api/contact  — public
// ============================================================
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check the form and try again.',
        code: 'VALIDATION_ERROR',
        issues: parsed.error.issues,
      });
    }
    const data = parsed.data;

    const row = await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        subject: data.subject,
        message: data.message.trim(),
        ip: req.ip,
        userAgent: req.get('user-agent') || null,
      },
    });

    // Fire-and-forget notification to the team inbox.
    // Uses whatever email service is already wired — see services/email or similar.
    notifyTeam(row).catch((e) => logger.warn('contact notify failed', { id: row.id, error: e.message }));

    // Always return the same shape — don't leak whether the honeypot fired.
    return res.status(201).json({
      success: true,
      message: "Thanks — we'll get back to you soon.",
      data: { id: row.id },
    });
  } catch (e) { next(e); }
});

// ============================================================
// GET /api/contact  — admin only, list with filters
// ============================================================
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { status, q, limit = '50', cursor } = req.query;
    const where = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
      ];
    }
    const take = Math.min(Number(limit) || 50, 200);
    const items = await prisma.contactMessage.findMany({
      where,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });
    const hasMore = items.length > take;
    const slice = hasMore ? items.slice(0, take) : items;
    return success(res, { items: slice, nextCursor: hasMore ? slice[slice.length - 1].id : null });
  } catch (e) { next(e); }
});

// ============================================================
// GET /api/contact/:id  — admin
// ============================================================
router.get('/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const row = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    return success(res, row);
  } catch (e) { next(e); }
});

// ============================================================
// PATCH /api/contact/:id  — admin (status, notes)
// ============================================================
router.patch('/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
    const data = { ...parsed.data };
    if (data.status === 'REPLIED') {
      data.repliedAt = new Date();
      data.repliedBy = req.user.id;
    }
    const row = await prisma.contactMessage.update({ where: { id: req.params.id }, data });
    await audit(req, 'update_contact_message', 'ContactMessage', row.id, { status: data.status });
    return success(res, row);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ success: false, message: 'Not found', code: 'NOT_FOUND' });
    next(e);
  }
});

// ============================================================
// Notification helper — tries to use existing email service
// ============================================================
async function notifyTeam(row) {
  // Try a few common module shapes. If none exists, log and move on.
  let sendMail = null;
  const candidates = [
    '../../services/email',
    '../../services/mailer',
    '../../services/notifications',
    '../../utils/email',
  ];
  for (const p of candidates) {
    try {
      const m = require(p);
      sendMail = m.sendEmail || m.sendMail || m.send;
      if (sendMail) break;
    } catch {}
  }
  if (!sendMail) {
    logger.info('contact message received', { id: row.id, email: row.email, subject: row.subject });
    return;
  }
  const to = process.env.CONTACT_INBOX || process.env.SUPPORT_EMAIL || 'help@bravevest.com';
  await sendMail({
    to,
    subject: `[BraveVest] ${row.subject} — ${row.name}`,
    text: `From: ${row.name} <${row.email}>
Phone: ${row.phone || '—'}
Subject: ${row.subject}

${row.message}

---
Message ID: ${row.id}`,
  });
}

module.exports = router;
