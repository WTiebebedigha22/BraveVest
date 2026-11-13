const router = require('express').Router();
const { authRequired } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL = 'gemini-2.0-flash-exp';

const SYSTEM = `You are the BraveVest assistant. BraveVest is a Nigerian
investment marketplace for verified property, energy, agriculture, SME, and
infrastructure opportunities. Answer questions about: investing, KYC,
wallet, deposits, withdrawals, portfolio tracking, referral program, and how
to navigate the app. Refuse anything off-topic in one polite sentence and
redirect to BraveVest topics. Keep answers under 120 words unless the user
asks for detail. Never invent figures — if asked about a specific
investment's numbers, tell the user to open the investment page.`;

// Cache common questions for instant repeat responses
const responseCache = new Map();
const MAX_CACHE = 50;

router.post(
  '/',
  authRequired,
  asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw ApiError.badRequest('message is required');
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('[chat] GEMINI_API_KEY missing');
      return success(
        res,
        {
          reply:
            "The assistant isn't configured yet. Add GEMINI_API_KEY to bravevest-api/.env and restart the server. In the meantime, you can browse the marketplace at /marketplace, complete KYC at /profile, or check your balance at /wallet.",
        },
        'No API key'
      );
    }

    // Cache hit
    const cacheKey = message.trim().toLowerCase();
    if (responseCache.has(cacheKey)) {
      return success(
        res,
        { reply: responseCache.get(cacheKey), cached: true },
        'OK (cached)'
      );
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

    const start = Date.now();
    try {
      const model = genAI.getGenerativeModel({
        model: MODEL,
        systemInstruction: SYSTEM,
      });
      const chat = model.startChat({ history: sanitizedHistory });
      const result = await chat.sendMessage(message.trim());
      const reply = result.response.text();

      console.log(
        `[chat] Gemini replied in ${Date.now() - start}ms: "${reply.slice(0, 60)}..."`
      );

      // Cache (only if short — skip long replies to save memory)
      if (reply.length < 1000 && responseCache.size < MAX_CACHE) {
        responseCache.set(cacheKey, reply);
      }

      return success(res, { reply }, 'OK');
    } catch (err) {
      console.error('[chat] Gemini error:', err.message);
      console.error('[chat] Full error:', err);

      const isDev = process.env.NODE_ENV !== 'production';

      // Fallback reply — single-line string, no embedded newlines
      const fallbackReply =
        "I'm having trouble reaching my knowledge base right now. " +
        "In the meantime: browse opportunities at /marketplace, " +
        "complete KYC at /profile, check your balance at /wallet, " +
        "or fund your wallet at /wallet?tab=deposit. " +
        "If this keeps happening, contact support@bravevest.com.";

      return success(
        res,
        {
          reply: fallbackReply,
          error: isDev ? err.message : undefined,
        },
        'Fallback reply'
      );
    }
  })
);

module.exports = router;