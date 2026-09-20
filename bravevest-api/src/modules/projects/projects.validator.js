// src/modules/projects/projects.validator.js
const { z } = require('zod');

const CATEGORIES = ['REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];
const STATUSES = ['DRAFT', 'PENDING_REVIEW', 'OPEN', 'FUNDED', 'CLOSED', 'CANCELLED'];

const createSchema = z.object({
  title: z.string().min(4).max(140).trim(),
  summary: z.string().min(10).max(240).trim(),
  description: z.string().min(20).max(5000),
  category: z.enum(CATEGORIES),
  coverImage: z.string().url().optional().or(z.literal('')),
  targetAmount: z.coerce.number().positive(),
  minInvestment: z.coerce.number().positive(),
  expectedReturnPct: z.coerce.number().min(0).max(100),
  tenorMonths: z.coerce.number().int().min(1).max(120),
  payoutFrequency: z.enum(['monthly', 'quarterly', 'annually', 'bullet']).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  closesAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  location: z.string().max(120).optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  isFeatured: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

const listQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(STATUSES).optional(),
  featured: z.enum(['true', 'false']).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const statusSchema = z.object({ status: z.enum(STATUSES) });

module.exports = { createSchema, updateSchema, listQuerySchema, statusSchema, CATEGORIES, STATUSES };
