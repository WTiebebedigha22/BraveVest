// src/modules/auth/auth.validator.js
const { z } = require('zod');

const passwordRule = z.string().min(8).max(100)
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number');

const registerSchema = z.object({
  firstName: z.string().min(1).max(60).trim(),
  lastName: z.string().min(1).max(60).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().regex(/^(\+?234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number').optional(),
  password: passwordRule,
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

const refreshSchema = z.object({ refreshToken: z.string().min(10) });
const forgotSchema = z.object({ email: z.string().email().toLowerCase().trim() });
const resetSchema = z.object({ token: z.string().min(10), password: passwordRule });

module.exports = { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema };
