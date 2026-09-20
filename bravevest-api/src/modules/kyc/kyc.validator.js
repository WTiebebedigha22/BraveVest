// src/modules/kyc/kyc.validator.js
const { z } = require('zod');

const step1Schema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD'),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.string().min(2).max(60),
  occupation: z.string().min(2).max(80),
});

const step2Schema = z.object({
  idType: z.enum(['NIN', 'BVN', 'PASSPORT', 'DRIVERS_LICENSE', 'VOTERS_CARD']),
  idNumber: z.string().min(4).max(40),
  idIssuedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  idExpiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const step3Schema = z.object({
  addressLine1: z.string().min(3).max(120),
  addressLine2: z.string().max(120).optional().or(z.literal('')),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  postalCode: z.string().max(20).optional().or(z.literal('')),
  country: z.string().min(2).max(60).default('NG'),
});

const step4Schema = z.object({
  bankName: z.string().min(2).max(80),
  bankCode: z.string().min(2).max(10),
  accountNumber: z.string().regex(/^\d{10}$/, 'Account number must be 10 digits'),
  accountName: z.string().min(2).max(100),
});

const STEP_SCHEMAS = { 1: step1Schema, 2: step2Schema, 3: step3Schema, 4: step4Schema };

const uploadTypeSchema = z.object({
  type: z.enum([
    'ID_CARD', 'PASSPORT_PHOTO', 'PROOF_OF_ADDRESS',
    'BANK_STATEMENT', 'UTILITY_BILL', 'SIGNATURE', 'OTHER',
  ]),
});

const rejectSchema = z.object({
  reason: z.string().min(3).max(500),
});

module.exports = { STEP_SCHEMAS, uploadTypeSchema, rejectSchema };
