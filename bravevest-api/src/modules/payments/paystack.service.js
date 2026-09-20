// src/modules/payments/paystack.service.js — Paystack wrapper
const axios = require('axios');
const crypto = require('crypto');
const env = require('../../config/env');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

const BASE_URL = 'https://api.paystack.co';

function isConfigured() {
  const s = env.payments.paystack.secret;
  return s && s !== 'sk_test_xxx' && !s.startsWith('sk_test_xxx');
}

function client() {
  if (!isConfigured()) throw ApiError.internal('Paystack secret key not configured');
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: 'Bearer ' + env.payments.paystack.secret, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
}

async function initialize({ email, amount, reference, callbackUrl, metadata }) {
  if (!isConfigured()) {
    logger.warn('Paystack: dev mode, mock initialize');
    const url = callbackUrl || env.payments.callbackUrl;
    return { authorization_url: url + '?reference=' + reference + '&mock=1', access_code: 'mock', reference };
  }
  const body = {
    email,
    amount: Math.round(amount * 100),
    reference,
    callback_url: callbackUrl || env.payments.callbackUrl,
    metadata: metadata || {},
  };
  const res = await client().post('/transaction/initialize', body);
  if (!res.data || !res.data.status) throw ApiError.internal('Paystack initialization failed');
  return res.data.data;
}

async function verify(reference) {
  if (!isConfigured()) {
    logger.warn('Paystack: dev mode, mock verify');
    return { status: 'success', reference, amount: 0, currency: 'NGN', gateway_response: 'mock' };
  }
  const res = await client().get('/transaction/verify/' + encodeURIComponent(reference));
  if (!res.data || !res.data.status) throw ApiError.badRequest('Unable to verify payment');
  return res.data.data;
}

function verifyWebhookSignature(rawBody, signature) {
  if (!isConfigured()) return env.isDev;
  const hash = crypto.createHmac('sha512', env.payments.paystack.secret)
    .update(rawBody)
    .digest('hex');
  return hash === signature;
}

module.exports = { initialize, verify, verifyWebhookSignature };
