const { prisma } = require('../../config/database');
const logger = require('../../config/logger');

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtp(userId, purpose = 'login') {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.otpCode.create({
    data: { userId, code, purpose, expiresAt },
  });

  // TODO: wire to real email service. For now, log it.
  logger.info('OTP generated', { userId, purpose, code });
  console.log(`\n\n[OTP] ${code} for user ${userId} (purpose: ${purpose})\n\n`);

  return { sent: true, expiresInMinutes: 10 };
}

async function verifyOtp(userId, code, purpose = 'login') {
  const otp = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      purpose,
      usedAt: null,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!otp) return { valid: false, error: 'Invalid or expired code' };

  await prisma.otpCode.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
  return { valid: true };
}

module.exports = { sendOtp, verifyOtp };
