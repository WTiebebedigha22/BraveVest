// src/modules/users/users.routes.js
const router = require('express').Router();
const ctrl = require('./users.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { z } = require('zod');

const updateSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  phone: z.string().max(20).nullable().optional(),
  image: z.string().max(500).nullable().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

router.use(authRequired);

router.get('/me', asyncHandler(ctrl.me));
router.patch('/me', validate({ body: updateSchema }), asyncHandler(ctrl.updateMe));
router.post('/me/change-password', validate({ body: passwordSchema }), asyncHandler(ctrl.changePassword));

module.exports = router;
