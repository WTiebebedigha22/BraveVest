// src/modules/kyc/kyc.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');
const kycProvider = require('../../services/kycProvider.service');

async function ensureProfile(userId) {
  let profile = await prisma.kycProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.kycProfile.create({ data: { userId } });
  }
  return profile;
}

async function getMine(userId) {
  const profile = await ensureProfile(userId);
  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return { profile, documents };
}

async function saveStep(userId, step, payload) {
  const profile = await ensureProfile(userId);

  if (profile.status === 'APPROVED' || profile.status === 'UNDER_REVIEW') {
    throw ApiError.conflict(`Cannot edit KYC while status is ${profile.status}`);
  }

  const data = { ...payload };
  if (step === 1 && data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);
  if (step === 2 && data.idIssuedDate) data.idIssuedDate = new Date(data.idIssuedDate);
  if (step === 2 && data.idExpiryDate) data.idExpiryDate = new Date(data.idExpiryDate);

  const updated = await prisma.kycProfile.update({
    where: { userId },
    data: {
      ...data,
      status: profile.status === 'NOT_STARTED' ? 'PENDING' : profile.status,
    },
  });

  logger.info(`KYC step ${step} saved for user ${userId}`);
  return updated;
}

async function attachDocument(userId, { type }, file) {
  if (!file) throw ApiError.badRequest('No file uploaded');
  const url = `/uploads/kyc/${file.filename}`;
  const doc = await prisma.document.create({
    data: {
      userId,
      type,
      fileName: file.originalname,
      fileUrl: url,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });
  logger.info(`KYC document uploaded for user ${userId}: ${type}`);
  return doc;
}

async function submit(userId) {
  const profile = await ensureProfile(userId);

  const missing = [];
  if (!profile.dateOfBirth) missing.push('personal');
  if (!profile.idType || !profile.idNumber) missing.push('identity');
  if (!profile.addressLine1) missing.push('address');
  if (!profile.bankName || !profile.accountNumber) missing.push('bank');

  if (missing.length) throw ApiError.badRequest('KYC is incomplete', { missing });
  if (profile.status === 'UNDER_REVIEW') throw ApiError.conflict('Already under review');
  if (profile.status === 'APPROVED') throw ApiError.conflict('Already approved');

  const providerResult = await kycProvider.verify({
    userId,
    idType: profile.idType,
    idNumber: profile.idNumber,
  });

  const updated = await prisma.kycProfile.update({
    where: { userId },
    data: {
      status: 'UNDER_REVIEW',
      submittedAt: new Date(),
      providerRef: providerResult.reference || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: 'KYC_SUBMITTED',
      entity: 'KycProfile',
      entityId: profile.id,
      meta: { providerRef: providerResult.reference || null },
    },
  }).catch(() => {});

  logger.info(`KYC submitted for user ${userId}`);
  return updated;
}

async function getStatus(userId) {
  const profile = await ensureProfile(userId);
  return {
    status: profile.status,
    submittedAt: profile.submittedAt,
    reviewedAt: profile.reviewedAt,
    rejectionNote: profile.rejectionNote,
  };
}

// ── Admin ──
async function adminList({ status, page = 1, limit = 20 }) {
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.kycProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, createdAt: true } },
      },
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.kycProfile.count({ where }),
  ]);
  return { items, total };
}

async function adminGet(id) {
  const profile = await prisma.kycProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, phone: true, firstName: true, lastName: true, createdAt: true } },
    },
  });
  if (!profile) throw ApiError.notFound('KYC profile not found');
  const documents = await prisma.document.findMany({
    where: { userId: profile.userId },
    orderBy: { createdAt: 'desc' },
  });
  return { profile, documents };
}

async function adminApprove(id, reviewerId) {
  const profile = await prisma.kycProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound('KYC profile not found');
  if (profile.status === 'APPROVED') throw ApiError.conflict('Already approved');

  const updated = await prisma.kycProfile.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      rejectionNote: null,
    },
  });

  await prisma.auditLog.create({
    data: { userId: profile.userId, action: 'KYC_APPROVED', entity: 'KycProfile', entityId: id, meta: { reviewerId } },
  }).catch(() => {});

  logger.info(`KYC approved: ${id} by ${reviewerId}`);
  return updated;
}

async function adminReject(id, reviewerId, reason) {
  const profile = await prisma.kycProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound('KYC profile not found');

  const updated = await prisma.kycProfile.update({
    where: { id },
    data: {
      status: 'REJECTED',
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      rejectionNote: reason,
    },
  });

  await prisma.auditLog.create({
    data: { userId: profile.userId, action: 'KYC_REJECTED', entity: 'KycProfile', entityId: id, meta: { reviewerId, reason } },
  }).catch(() => {});

  logger.warn(`KYC rejected: ${id} by ${reviewerId} — ${reason}`);
  return updated;
}

module.exports = {
  ensureProfile, getMine, saveStep, attachDocument, submit, getStatus,
  adminList, adminGet, adminApprove, adminReject,
};
