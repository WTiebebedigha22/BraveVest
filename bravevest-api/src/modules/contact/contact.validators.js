const { z } = require('zod');

const SUBJECTS = ['GENERAL', 'INVESTOR', 'BORROWER', 'PARTNERSHIP', 'PRESS', 'SUPPORT'];

const createSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional().nullable(),
  subject: z.enum(SUBJECTS).default('GENERAL'),
  message: z.string().min(10).max(5000),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
});

const updateSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

module.exports = { createSchema, updateSchema, SUBJECTS };
