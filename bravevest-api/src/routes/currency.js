import express from 'express';

const router = express.Router();

// ── Config ────────────────────────────────────────────────
// Uses https://frankfurter.dev (free, no API key).
// If it doesn't return NGN (Frankfurter doesn't officially support it),
// the route falls back to static rates so the frontend doesn't break.
const FALLBACK_RATES_NGN = {
  NGN: 1,
  USD: 1600,
  GBP: 2000,
  EUR: 1750,
  CAD: 1150,
};

let cache = { data: null, fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchLiveRates() {
  // Fetch USD-based rates, then invert to NGN base.
  const r = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', {
    // add a 10s timeout via AbortController
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok) throw new Error(`Frankfurter ${r.status}`);
  const json = await r.json();

  // json.rates = { EUR: 0.92, GBP: 0.79, NGN: 1600? ... }
  const usdToNgn = json.rates.NGN;
  if (!usdToNgn) throw new Error('Frankfurter did not return NGN');

  // Build NGN-based table: 1 quote currency = X NGN
  const rates = { NGN: 1 };
  for (const [code, perUsd] of Object.entries(json.rates)) {
    if (code === 'NGN') continue;
    // 1 USD = perUsd CODE ; 1 USD = usdToNgn NGN
    // → 1 CODE = usdToNgn / perUsd NGN
    rates[code] = +(usdToNgn / perUsd).toFixed(4);
  }

  return {
    base: 'NGN',
    rates,
    updatedAt: new Date().toISOString(),
    source: 'frankfurter',
  };
}

router.get('/rates', async (_req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.fetchedAt < TTL_MS) {
      return res.json({ data: cache.data });
    }

    let payload;
    try {
      payload = await fetchLiveRates();
    } catch (err) {
      console.warn('Live FX fetch failed, using fallback:', err.message);
      payload = {
        base: 'NGN',
        rates: FALLBACK_RATES_NGN,
        updatedAt: new Date().toISOString(),
        source: 'fallback',
      };
    }

    cache = { data: payload, fetchedAt: now };
    return res.json({ data: payload });
  } catch (err) {
    console.error('currency/rates error:', err);
    return res.status(502).json({ error: 'rates_unavailable' });
  }
});

export default router;