// src/services/kycProvider.service.js
const env = require('../config/env');
const logger = require('../config/logger');

async function verify({ userId, idType, idNumber }) {
  logger.debug(`KYC provider [${env.kyc.provider}] verify(${idType})`);

  if (env.isDev) {
    return {
      status: 'verified',
      reference: `dev-${Date.now()}-${userId.slice(0, 6)}`,
      raw: { provider: 'dev-stub' },
    };
  }

  return {
    status: 'pending',
    reference: null,
    raw: { provider: env.kyc.provider, note: 'not implemented' },
  };
}

module.exports = { verify };
