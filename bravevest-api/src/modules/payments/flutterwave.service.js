// src/modules/payments/flutterwave.service.js — Flutterwave wrapper
const axios = require('axios');
const env = require('../../config/env');
const ApiError = require('../../utils/apiError');

const BASE_URL = 'https://api.flutterwave.com/v3';

function isConfigured() {
  const s = env.payments.flutterwave.secret;
  return s && !s.startsWith('FLWSECK_TEST-xxx');
}

function client() {
  if (!isConfigured()) throw ApiError.internal('Flutterwave secret key not configured');
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: 'Bearer ' + env.payments.flutterwave.secret, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
}

async function initialize({ email, amount, reference, callbackUrl, metadata }) {
  const body = {
    tx_ref: reference,
    amount,
    currency: 'NGN',
    redirect_url: callbackUrl || env.payments.callbackUrl,
    customer: { email },
    customizations: { title: 'BraveVest', description: 'Investment payment' },
    meta: metadata || {},
  };
  const res = await client().post('/payments', body);
  if (res.data.status !== 'success') throw ApiError.internal('Flutterwave initialization failed');
  return res.data.data;
}

async function verify(transactionId) {
  const res = await client().get('/transactions/' + transactionId + '/verify');
  return res.data.data;
}

function verifyWebhookSignature(signature) {
  if (!isConfigured()) return env.isDev;
  return signature === env.payments.flutterwave.secret;
}

module.exports = { initialize, verify, verifyWebhookSignature };
