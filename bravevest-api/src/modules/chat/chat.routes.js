const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL = 'gemini-1.5-flash';

const SYSTEM = `You are the BraveVest assistant. BraveVest is a Nigerian
investment marketplace for verified property, energy, agriculture, SME, and
infrastructure opportunities. Answer questions about: investing, KYC,
wallet, deposits, withdrawals, portfolio tracking, referral program, and how
to navigate the app. Refuse anything off-topic in one polite sentence and
redirect to BraveVest topics. Keep answers under 120 words unless the user
asks for detail. Never invent figures — if asked about a specific
investment's numbers, tell the user to open the investment page.`;

router.post('/', authRequired, asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw ApiError.badRequest('message is required');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw ApiError.internal('GEMINI_API_KEY not configured');
  }

  const sanitizedHistory = Array.isArray(history)
    ? history
        .filter((h) => h && (h.role === 'user' || h.role === 'model'))
        .slice(-20)
        .map((h) => ({
          role: h.role,
          parts: Array.isArray(h.parts)
            ? h.parts.filter((p) => p && typeof p.text === 'string')
            : [],
        }))
        .filter((h) => h.parts.length > 0)
    : [];

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM,
    });
    const chat = model.startChat({ history: sanitizedHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();
    return success(res, { reply }, 'OK');
  } catch (err) {
    console.error('Gemini error:', err.message);
    throw ApiError.internal('Assistant is unavailable right now. Please try again.');
  }
}));

module.exports = router;
