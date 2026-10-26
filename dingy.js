#!/usr/bin/env node
// currency-api.js — Create backend currency rates endpoint
// Run from repo root: `node currency-api.js [--force] [--dry]`

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const API = path.join(ROOT, 'bravevest-api');

const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

const log = (m) => console.log(`\x1b[38;5;149m▸\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[38;5;214m!\x1b[0m ${m}`);
const err = (m) => console.log(`\x1b[38;5;203m✗\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[38;5;117m·\x1b[0m ${m}`);

function write(rel, contents) {
  const abs = path.join(API, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (fs.existsSync(abs) && !FORCE) {
    const cur = fs.readFileSync(abs, 'utf8');
    if (cur === contents) { log(`unchanged: ${rel}`); return; }
  }
  if (DRY) { info(`would write: ${rel}`); return; }
  fs.writeFileSync(abs, contents);
  log(`wrote: ${rel}`);
}
function backup(rel) {
  const abs = path.join(API, rel);
  if (!fs.existsSync(abs)) return;
  const bak = abs + '.bak';
  if (DRY) return;
  if (!fs.existsSync(bak)) { fs.copyFileSync(abs, bak); log(`backed up: ${rel}`); }
}

if (!fs.existsSync(API)) { err('bravevest-api not found. Run from repo root.'); process.exit(1); }

console.log('');
log('BraveVest — Currency API endpoint');
if (DRY) warn('DRY RUN');
console.log('');

// ============================================================
// 1. Create currency.routes.js
// ============================================================
log('1. src/modules/currency/currency.routes.js');
write('src/modules/currency/currency.routes.js', `const express = require('express');
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
    \`https://open.er-api.com/v6/latest/\${BASE}\`,
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
`);

// ============================================================
// 2. Mount in app.js
// ============================================================
log('2. src/app.js — mount /api/currency');
const appPath = path.join(API, 'src/app.js');
if (fs.existsSync(appPath)) {
  let c = fs.readFileSync(appPath, 'utf8');
  if (c.includes("require('./modules/currency/currency.routes')")) {
    info('   already mounted');
  } else {
    backup('src/app.js');
    const mount = "app.use('/api/currency', require('./modules/currency/currency.routes'));";
    if (c.includes('app.use(notFound);')) {
      c = c.replace('app.use(notFound);', `${mount}\n\napp.use(notFound);`);
      if (!DRY) { fs.writeFileSync(appPath, c); log('   + mounted /api/currency'); }
      else info('   would mount /api/currency');
    } else {
      warn('   could not find app.use(notFound) — add manually:');
      info(`   ${mount}`);
    }
  }
} else {
  err('src/app.js not found');
}

// ============================================================
// Summary
// ============================================================
console.log('');
log('---');
if (DRY) {
  warn('DRY RUN — nothing written');
} else {
  log('Currency API created and mounted.');
  console.log('');
  log('next:');
  console.log('  cd bravevest-api');
  console.log('  npm run dev');
  console.log('');
  log('verify from another terminal:');
  console.log('  curl http://localhost:3001/api/currency/rates');
  console.log('');
  log('expected response:');
  console.log('  { "success": true, "data": { "base": "NGN", "rates": { "NGN": 1, "USD": 0.000645, ... } } }');
  console.log('');
  info('rates are cached for 1 hour; fetched from open.er-api.com (free, no key)');
  info('falls back to hardcoded rates if the API is unreachable');
}
console.log('');