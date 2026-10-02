const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

async function ensure(userId) {
  let p = await prisma.kycProfile.findUnique({ where: { userId } });
  if (!p) p = await prisma.kycProfile.create({ data: { userId } });
  return p;
}
async function getMine(userId) {
  const profile = await ensure(userId);
  const documents = await prisma.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return { profile, documents };
}
async function saveStep(userId, step, payload) {
  const profile = await ensure(userId);
  if (profile.status === 'APPROVED' || profile.status === 'UNDER_REVIEW') throw ApiError.conflict('Cannot edit');
  const data = { ...payload };
  if (step === 1 && data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);
  if (step === 2 && data.idIssuedDate) data.idIssuedDate = new Date(data.idIssuedDate);
  if (step === 2 && data.idExpiryDate) data.idExpiryDate = new Date(data.idExpiryDate);
  return prisma.kycProfile.update({ where: { userId }, data: { ...data, status: profile.status === 'NOT_STARTED' ? 'PENDING' : profile.status } });
}
async function attachDocument(userId, { type }, file) {
  if (!file) throw ApiError.badRequest('No file');
  return prisma.document.create({ data: { userId, type, fileName: file.originalname, fileUrl: '/uploads/kyc/' + file.filename, fileSize: file.size, mimeType: file.mimetype } });
}
async function submit(userId) {
  const p = await ensure(userId);
  if (p.status === 'UNDER_REVIEW') throw ApiError.conflict('Already under review');
  if (p.status === 'APPROVED') throw ApiError.conflict('Already approved');
  return prisma.kycProfile.update({ where: { userId }, data: { status: 'UNDER_REVIEW', submittedAt: new Date() } });
}
async function getStatus(userId) {
  const p = await ensure(userId);
  return { status: p.status, submittedAt: p.submittedAt, reviewedAt: p.reviewedAt, rejectionNote: p.rejectionNote };
}
async function adminList({ status, page = 1, limit = 20 }) {
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.kycProfile.findMany({ where, include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } }, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.kycProfile.count({ where }),
  ]);
  return { items, total };
}
async function adminGet(id) {
  const profile = await prisma.kycProfile.findUnique({ where: { id }, include: { user: { select: { id: true, email: true, phone: true, firstName: true, lastName: true } } } });
  if (!profile) throw ApiError.notFound('Not found');
  const documents = await prisma.document.findMany({ where: { userId: profile.userId } });
  return { profile, documents };
}
async function adminApprove(id, reviewerId) {
  return prisma.kycProfile.update({ where: { id }, data: { status: 'APPROVED', reviewedById: reviewerId, reviewedAt: new Date(), rejectionNote: null } });
}
async function adminReject(id, reviewerId, reason) {
  return prisma.kycProfile.update({ where: { id }, data: { status: 'REJECTED', reviewedById: reviewerId, reviewedAt: new Date(), rejectionNote: reason } });
}

module.exports = { ensure, getMine, saveStep, attachDocument, submit, getStatus, adminList, adminGet, adminApprove, adminReject };
