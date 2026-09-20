// src/modules/payments/payments.validator.js
const { z } = require('zod');

const initializeSchema = z.object({
  investmentId: z.string().min(5),
});
const verifyQuerySchema = z.object({
  reference: z.string().min(4).optional(),
});
const verifyParamsSchema = z.object({
  reference: z.string().min(4),
});
const listQuerySchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REVERSED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

module.exports = { initializeSchema, verifyQuerySchema, verifyParamsSchema, listQuerySchema };
