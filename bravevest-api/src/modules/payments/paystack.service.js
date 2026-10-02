const axios = require('axios');
const env = require('../../config/env');
const ApiError = require('../../utils/apiError');

function isConfigured() { return env.payments.paystack.secret && !env.payments.paystack.secret.includes('xxx'); }

async function initialize({ email, amount, reference, callbackUrl }) {
  if (!isConfigured()) return { authorization_url: (callbackUrl || env.payments.callbackUrl) + '?reference=' + reference, access_code: 'mock', reference };
  const res = await axios.post('https://api.paystack.co/transaction/initialize', { email, amount: Math.round(amount * 100), reference, callback_url: callbackUrl }, { headers: { Authorization: 'Bearer ' + env.payments.paystack.secret } });
  return res.data.data;
}
async function verify(reference) {
  if (!isConfigured()) return { status: 'success', reference, amount: 0, currency: 'NGN' };
  const res = await axios.get('https://api.paystack.co/transaction/verify/' + reference, { headers: { Authorization: 'Bearer ' + env.payments.paystack.secret } });
  return res.data.data;
}
module.exports = { initialize, verify, isConfigured };
