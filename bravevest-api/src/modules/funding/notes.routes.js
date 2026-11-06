const express = require('express');
const { z } = require('zod');
const { prisma } = require('../../config/database');
const { requireRole } = require('../../middleware/role');
const { audit } = require('../../middleware/audit');
const { success } = require('../../utils/apiResponse');

const router = express.Router();

let authenticate;
try {
  authenticate = require('../../middleware/auth.middleware').authRequired;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required' });
    next();
  };
}

const notesSchema = z.object({
  managerNotes: z.string().max(4000).nullable(),
});

// PATCH /api/funding/requests/:id/notes
router.patch('/requests/:id/notes', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const parsed = notesSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload' });

    const request = await prisma.fundingRequest.update({
      where: { id: req.params.id },
      data: { managerNotes: parsed.data.managerNotes },
      select: { id: true, managerNotes: true },
    });
    await audit(req, 'update_manager_notes', 'FundingRequest', request.id);
    return success(res, request);
  } catch (e) { next(e); }
});

module.exports = router;
