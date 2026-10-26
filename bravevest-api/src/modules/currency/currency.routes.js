const express = require('express');
const { success } = require('../../utils/apiResponse');
const logger = require('../../config/logger');

const router = express.Router();

const SUPPORTED = ['NGN', 'USD', 'GBP', 'EUR', 'ZAR', 'KES', 'GHS'];
const BASE = 'NGN';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cache = { rates: null, fetchedAt: 0, source: null };

// Fallback rates used if the upstream API is unreachable.
const FALLBACK = {
  NGN: 1,
  USD: 1 / 1550,
  GBP: 1 / 1970,
  EUR: 1 / 1680,
  ZAR: 1 / 85,
  KES: 1 / 12,
  GHS: 1 / 105,
};

async function fetchRates() {
  const now = Date.now();
  if (cache.rates && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { rates: cache.rates, source: cache.source, stale: false };
  }

  // Try free exchange API — no key required
  const urls = [
    `https://open.er-api.com/v6/latest/${BASE}`,
    process.env.EXCHANGE_API_URL,
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const json = await res.json();
      const raw = json.rates || json.conversion_rates || json.data?.rates;
      if (!raw) continue;

      const rates = { [BASE]: 1 };
      for (const code of SUPPORTED) {
        if (code === BASE) continue;
        if (raw[code] != null) rates[code] = Number(raw[code]);
      }
      cache = { rates, fetchedAt: now, source: url };
      logger.info('currency rates refreshed', { source: url, count: Object.keys(rates).length });
      return { rates, source: url, stale: false };
    } catch (e) {
      logger.warn('currency fetch failed', { url, error: e.message });
    }
  }

  // All fetches failed — use fallback
  cache = { rates: FALLBACK, fetchedAt: now, source: 'fallback' };
  return { rates: FALLBACK, source: 'fallback', stale: true };
}

// GET /api/currency/rates — public
router.get('/rates', async (req, res, next) => {
  try {
    const { rates, source, stale } = await fetchRates();
    return success(res, {
      base: BASE,
      rates,
      supported: SUPPORTED,
      source,
      stale,
      fetchedAt: new Date(cache.fetchedAt).toISOString(),
    });
  } catch (e) { next(e); }
});

module.exports = router;
