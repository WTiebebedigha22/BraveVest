const { z } = require('zod');
const passwordRule = z.string().min(8).max(100).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/);
const registerSchema = z.object({
  firstName: z.string().min(1).max(60).trim(),
  lastName: z.string().min(1).max(60).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().optional(),
  password: passwordRule,
});
const loginSchema = z.object({ email: z.string().email().toLowerCase().trim(), password: z.string().min(1) });
const refreshSchema = z.object({ refreshToken: z.string().min(10) });
const forgotSchema = z.object({ email: z.string().email().toLowerCase().trim() });
const resetSchema = z.object({ token: z.string().min(10), password: passwordRule });
module.exports = { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema };
