const { z } = require('zod');

const CATEGORIES = ['REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];
const FREQUENCIES = ['monthly', 'quarterly', 'bullet'];

const createSchema = z.object({
  title: z.string().min(5).max(120),
  summary: z.string().max(280).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  category: z.enum(CATEGORIES),
  currency: z.string().length(3).default('NGN'),
  amountRequested: z.number().positive().max(1_000_000_000),
  minCommitment: z.number().positive().optional().nullable(),
  maxCommitment: z.number().positive().optional().nullable(),
  proposedReturnPct: z.number().min(0).max(100).optional().nullable(),
  durationMonths: z.number().int().positive().max(120).optional().nullable(),
  repaymentFrequency: z.enum(FREQUENCIES).optional().nullable(),
});

const updateSchema = createSchema.partial();

const rejectSchema = z.object({
  reason: z.string().min(3).max(500),
});

module.exports = { createSchema, updateSchema, rejectSchema, CATEGORIES, FREQUENCIES };
