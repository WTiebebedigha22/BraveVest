const router = require('express').Router();
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken'); // needed to manually parse the token
const { getTargetedKnowledgeBase } = require('./context.service');

// Groq models
const MODELS = [
  process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
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

const RETRYABLE_STATUS = new Set([429, 500, 503, 504]);
const ATTEMPTS_PER_MODEL = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Optional Auth Middleware ---
// Parses the token if present, but does NOT block the request if missing.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next(); // Guest

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user
  } catch {
    // Invalid/expired token -> treat as guest (don't crash)
  }
  next();
}

// --- Rate Limiters ---
// 1. Logged-in users: generous limit (e.g., 20 messages/min)
const loggedInLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Only apply this limiter if req.user exists
  skip: (req) => !req.user,
  message: { error: 'Too many messages. Please slow down.' },
});

// 2. Guests: 20% of the daily Groq limit.
// Groq free tier is ~1000 requests/day total.
// 20% = 200 requests/day per IP. (Approx 3-4 requests/minute).
const guestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 200, // 20% of 1000
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !!req.user, // Skip if logged in
  message: {
    error: 'Guest limit reached (20% daily quota). Please log in to continue chatting.',
  },
});

let _client = null;
function getClient() {
  if (_client) return _client;
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');
  _client = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  return _client;
}

function isRetryable(err) {
  const status = Number(err.status || err.code);
  if (RETRYABLE_STATUS.has(status)) return true;
  return /UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED/i.test(err.message || '');
}

async function generateWithFallback(client, messages, systemInstruction) {
  let lastErr;
  const fullMessages = [
    { role: 'system', content: systemInstruction },
    ...messages,
  ];

  for (const model of MODELS) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const response = await client.chat.completions.create({
          model,
          messages: fullMessages,
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
  optionalAuth,       // <--- Parses token if present, but doesn't block
  loggedInLimiter,    // <--- Runs only for logged-in users
  guestLimiter,       // <--- Runs only for guests
  asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw ApiError.badRequest('message is required');
    }

    if (!process.env.GROQ_API_KEY) {
      return success(res, { reply: 'Assistant not configured.' }, 'No API key');
    }

    // Load KB. You can pass req.user?.id if your service supports personalization.
    // For now, it's just the general FAQ/DB scan.
    const siteKnowledge = await getTargetedKnowledgeBase(message.trim());
    const dynamicSystemInstruction = `${BASE_SYSTEM}\n\n${siteKnowledge}`;

    const sanitizedHistory = Array.isArray(history)
      ? history
          .filter((h) => h && (h.role === 'user' || h.role === 'model'))
          .slice(-20)
          .map((h) => {
            const text = Array.isArray(h.parts)
              ? h.parts.filter((p) => p && typeof p.text === 'string').map((p) => p.text).join('\n')
              : '';
            return {
              role: h.role === 'model' ? 'assistant' : 'user',
              content: text,
            };
          })
          .filter((h) => h.content.trim().length > 0)
      : [];

    const contents = [
      ...sanitizedHistory,
      { role: 'user', content: message.trim() },
    ];

    try {
      const client = getClient();
      const { response } = await generateWithFallback(client, contents, dynamicSystemInstruction);
      const reply = response.choices?.[0]?.message?.content?.trim() || '';

      if (!reply) {
        return success(res, { reply: "I couldn't generate a response for that." }, 'Empty reply');
      }

      return success(res, { reply }, 'OK');
    } catch (err) {
      console.error('[chat] Groq error:', err.message);
      return success(
        res,
        {
          reply: "I'm having trouble answering right now. Please try again in a moment.",
          degraded: true,
        },
        'Fallback reply'
      );
    }
  })
);

module.exports = router;