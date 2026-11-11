const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const prisma = require('../../config/database').prisma;
const ApiError = require('../../utils/apiError');

router.get('/', authRequired, asyncHandler(async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return success(res, items, 'Notifications retrieved');
}));

router.patch('/:id/read', authRequired, asyncHandler(async (req, res) => {
  const existing = await prisma.notification.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!existing) throw ApiError.notFound('Notification not found');
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  return success(res, null, 'Marked as read');
}));

router.post('/read-all', authRequired, asyncHandler(async (req, res) => {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user.id, read: false },
    data: { read: true },
  });
  return success(res, { updated: result.count }, 'All marked as read');
}));

module.exports = router;
