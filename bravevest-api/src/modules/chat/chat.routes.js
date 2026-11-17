const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const { GoogleGenAI } = require('@google/genai');
const { getTargetedKnowledgeBase } = require('./context.service');

const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

const BASE_SYSTEM = `You are the BraveVest assistant. BraveVest is a Nigerian
investment marketplace for verified property, energy, agriculture, SME, and
infrastructure opportunities. 

Use the repository structure and live database state provided below to answer questions accurately about available investments, platform features, KYC, wallets, deposits, withdrawals, portfolio tracking, and referrals.
- Never invent figures — quote exact numbers from the live database state.
- If asked about a specific investment's numbers or details not present, direct the user to the marketplace page.
- Refuse off-topic requests in one polite sentence and redirect to BraveVest topics.
- Keep answers under 120 words unless the user asks for detail.
`;

const responseCache = new Map();
const MAX_CACHE = 50;
const CACHE_TTL_MS = 60 * 60 * 1000;
const RETRYABLE_STATUS = new Set([429, 500, 503, 504]);
const ATTEMPTS_PER_MODEL = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let _ai = null;
function getAI() {
  if (_ai) return _ai;
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  _ai = new GoogleGenAI({ apiKey: key });
  return _ai;
}

function isRetryable(err) {
  const status = Number(err.status || err.code);
  if (RETRYABLE_STATUS.has(status)) return true;
  return /UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED/i.test(err.message || '');
}

async function generateWithFallback(ai, contents, systemInstruction) {
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: { systemInstruction },
        });
        return { response, model };
      } catch (err) {
        lastErr = err;
        if (!isRetryable(err)) throw err;
        await sleep(500 * 2 ** attempt + Math.random() * 250);
      }
    }
  }
  throw lastErr;
}

router.post(
  '/',
  authRequired,
  asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw ApiError.badRequest('message is required');
    }

    if (!process.env.GEMINI_API_KEY) {
      return success(res, { reply: "Assistant not configured." }, 'No API key');
    }

    // 1. Pass the user message to scan keywords across FAQs, How It Works, and Database
    const siteKnowledge = await getTargetedKnowledgeBase(message.trim());
    const dynamicSystemInstruction = `${BASE_SYSTEM}\n\n${siteKnowledge}`;

    // Sanitize history
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

    const contents = [
      ...sanitizedHistory,
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    try {
      const ai = getAI();
      const { response } = await generateWithFallback(ai, contents, dynamicSystemInstruction);
      const reply = typeof response.text === 'string' ? response.text.trim() : '';

      if (!reply) {
        return success(res, { reply: "I couldn't generate a response for that." }, 'Empty reply');
      }

      return success(res, { reply }, 'OK');
    } catch (err) {
      console.error('[chat] Gemini error:', err.message);
      return success(
        res,
        {
          reply: "I'm having trouble reaching my knowledge base right now. Please check /marketplace.",
          degraded: true,
        },
        'Fallback reply'
      );
    }
  })
);

module.exports = router;