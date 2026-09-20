// src/modules/investments/investments.validator.js
const { z } = require('zod');

const createSchema = z.object({
  projectId: z.string().min(5),
  amount: z.coerce.number().positive(),
});

const listQuerySchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'MATURED', 'WITHDRAWN', 'CANCELLED', 'DEFAULTED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(500).optional(),
});

module.exports = { createSchema, listQuerySchema };
