// src/modules/payments/payments.controller.js
const service = require('./payments.service');
const { success, created } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');

const initialize = async (req, res) => {
  const result = await service.initializeForInvestment(req.user.id, req.body.investmentId);
  return created(res, result, 'Payment initialized');
};

const verify = async (req, res) => {
  const reference = req.params.reference || req.query.reference;
  if (!reference) throw ApiError.badRequest('reference is required');
  const result = await service.verifyAndConfirm(reference);
  return success(res, result, result.success ? 'Payment verified' : 'Payment not successful');
};

const webhookPaystack = async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const paystack = require('./paystack.service');
  if (!paystack.verifyWebhookSignature(req.rawBody || JSON.stringify(req.body), signature)) {
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }
  try { await service.handleWebhook('paystack', req.body); }
  catch (err) { console.error('Paystack webhook error:', err.message); }
  return res.status(200).json({ received: true });
};

const webhookFlutterwave = async (req, res) => {
  const signature = req.headers['verif-hash'];
  const flutterwave = require('./flutterwave.service');
  if (!flutterwave.verifyWebhookSignature(signature)) {
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }
  try { await service.handleWebhook('flutterwave', req.body); }
  catch (err) { console.error('Flutterwave webhook error:', err.message); }
  return res.status(200).json({ received: true });
};

const listMine = async (req, res) => {
  const { items, meta } = await service.listMine(req.user.id, req.query);
  return success(res, items, 'My transactions', 200, meta);
};

const wallet = async (req, res) => success(res, await service.walletSummary(req.user.id));

module.exports = { initialize, verify, webhookPaystack, webhookFlutterwave, listMine, wallet };
