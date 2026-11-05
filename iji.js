#!/usr/bin/env node
/**
 * BraveVest — All-in-One Improvement Script
 * Applies: Performance (P1) + Trust (P2) + Premium UI/UX (P3) + Technical (P4)
 *
 * Usage:
 *   node bravevest-improve.js            # apply all
 *   node bravevest-improve.js --dry-run  # preview changes only
 *   node bravevest-improve.js --only perf,ui   # apply specific pillars
 *
 * Safe: backs up every modified file to .bravevest-backup/<timestamp>/
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry-run');
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.split('=')[1].split(',') : null;
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.join(ROOT, '.bravevest-backup', STAMP);

const WEB = path.join(ROOT, 'bravevest-web');
const API = path.join(ROOT, 'bravevest-api');

// ---------------------------------------------------------------- utilities
const log = (icon, msg) => console.log(`${icon}  ${msg}`);
const skip = (msg) => log('⏭️ ', msg);
const done = (msg) => log('✅', msg);
const warn = (msg) => log('⚠️ ', msg);

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function backup(file) {
  if (!fs.existsSync(file)) return;
  const rel = path.relative(ROOT, file);
  const dest = path.join(BACKUP_DIR, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(file, dest);
}

function write(file, content) {
  const rel = path.relative(ROOT, file);
  if (DRY) {
    log('📝', `[dry-run] would write ${rel}`);
    return;
  }
  if (fs.existsSync(file)) {
    const existing = fs.readFileSync(file, 'utf8');
    if (existing === content) { skip(`unchanged: ${rel}`); return; }
  }
  ensureDir(path.dirname(file));
  backup(file);
  fs.writeFileSync(file, content);
  done(`wrote ${rel}`);
}

function patch(file, replacer, description) {
  const rel = path.relative(ROOT, file);
  if (!fs.existsSync(file)) { warn(`missing: ${rel}`); return; }
  const before = fs.readFileSync(file, 'utf8');
  const after = replacer(before);
  if (after === before) { skip(`no change needed: ${rel}`); return; }
  if (DRY) { log('📝', `[dry-run] would patch ${rel} — ${description}`); return; }
  backup(file);
  fs.writeFileSync(file, after);
  done(`patched ${rel} — ${description}`);
}

function should(pillar) {
  return !ONLY || ONLY.includes(pillar);
}

// ---------------------------------------------------------------- PILLAR 1: PERFORMANCE
function pillarPerformance() {
  console.log('\n🔧 PILLAR 1 — PERFORMANCE\n');

  // 1.1 Vite config with code splitting + manualChunks
  write(path.join(WEB, 'vite.config.js'), `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-http': ['axios'],
        },
      },
    },
  },
  server: { port: 5173 },
});
`);

  // 1.2 vercel.json cache headers
  write(path.join(ROOT, 'vercel.json'), JSON.stringify({
    headers: [
      {
        source: '/assets/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*).html',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ],
  }, null, 2) + '\n');

  // 1.3 Font tokens CSS
  write(path.join(WEB, 'src', 'styles', 'fonts.css'), `@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`);

  // 1.4 Patch index.html to add font preloads + api preconnect
  const indexHtml = path.join(WEB, 'index.html');
  patch(indexHtml, (src) => {
    if (src.includes('rel="preload" href="/fonts/inter-400.woff2"')) return src;
    const inject = `    <link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/playfair-700.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preconnect" href="https://bravevest-api.onrender.com" crossorigin>
    <link rel="dns-prefetch" href="https://bravevest-api.onrender.com">
`;
    return src.replace(/<\/head>/i, inject + '</head>');
  }, 'font preload + api preconnect');

  // 1.5 Image optimization middleware
  write(path.join(API, 'middleware', 'optimizeUpload.js'), `import sharp from 'sharp';
import path from 'path';

export async function optimizeUpload(req, res, next) {
  if (!req.file) return next();
  try {
    const out = path.join(req.file.destination, req.file.filename + '.webp');
    await sharp(req.file.path)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    req.file.optimizedPath = out;
  } catch (e) {
    console.error('optimizeUpload:', e);
  }
  next();
}
`);

  // 1.6 Prisma indexes — patch schema
  const schema = path.join(API, 'prisma', 'schema.prisma');
  patch(schema, (src) => {
    let out = src;
    if (out.includes('model Project') && !out.includes('@@index([category, status])')) {
      out = out.replace(
        /(model Project\s*\{[\s\S]*?)(\n\})/,
        '$1\n  @@index([category, status])\n  @@index([status, createdAt])$2'
      );
    }
    if (out.includes('model Investment') && !out.includes('@@index([userId, status])')) {
      out = out.replace(
        /(model Investment\s*\{[\s\S]*?)(\n\})/,
        '$1\n  @@index([userId, status])\n  @@index([projectId])\n  @@index([createdAt])$2'
      );
    }
    if (out.includes('model Transaction') && !out.includes('@@index([reference])')) {
      out = out.replace(
        /(model Transaction\s*\{[\s\S]*?)(\n\})/,
        '$1\n  @@index([userId, createdAt])\n  @@index([reference])$2'
      );
    }
    return out;
  }, 'Prisma indexes');

  // 1.7 Pagination util
  write(path.join(API, 'utils', 'paginate.js'), `export function getPagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
  return { skip: (page - 1) * limit, take: limit, page, limit };
}
`);

  // 1.8 Dashboard aggregate endpoint
  write(path.join(API, 'routes', 'dashboard.js'), `import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/summary', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [investments, wallet, recentTx, projects] = await Promise.all([
      prisma.investment.findMany({ where: { userId, status: 'ACTIVE' } }),
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.project.count({ where: { status: 'OPEN' } }),
    ]);
    const totalValue = investments.reduce((s, i) => s + (i.currentValue || i.amount), 0);
    const monthlyDelta = investments.reduce((s, i) => s + (i.monthlyReturn || 0), 0);
    res.json({
      portfolio: { totalValue, monthlyDelta, deltaPercent: totalValue ? (monthlyDelta / totalValue) * 100 : 0 },
      investments,
      wallet,
      recentTx,
      stats: { activeInvestments: investments.length, openProjects: projects },
    });
  } catch (e) { next(e); }
});

export default router;
`);

  // 1.9 Install html2canvas if missing (note only — script doesn't run npm)
  warn('remember to run: cd bravevest-web && npm i html2canvas @tanstack/react-query');
  warn('remember to run: cd bravevest-api && npm i sharp');
}

// ---------------------------------------------------------------- PILLAR 2: TRUST
function pillarTrust() {
  console.log('\n🛡️  PILLAR 2 — TRUST SIGNALS\n');

  write(path.join(WEB, 'src', 'components', 'TrustStrip.jsx'), `import './TrustStrip.css';

const items = [
  { icon: '🛡️', label: 'Bravelion Holdings' },
  { icon: '🔒', label: 'Paystack Secured' },
  { icon: '📄', label: 'SEC-aligned KYC' },
  { icon: '✅', label: '0 Defaults Since 2023' },
];

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust signals">
      {items.map((it) => (
        <div key={it.label} className="trust-item">
          <span aria-hidden="true">{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </section>
  );
}
`);

  write(path.join(WEB, 'src', 'components', 'TrustStrip.css'), `.trust-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-5, 24px);
  padding: var(--s-4, 16px) var(--s-5, 24px);
  border-top: 1px solid var(--border, #e5e7eb);
  border-bottom: 1px solid var(--border, #e5e7eb);
  background: var(--bg, #fafafa);
}
.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans, 'Inter', sans-serif);
  font-size: 14px;
  color: var(--muted, #6b7280);
  font-weight: 500;
}
`);

  // KYC step indicator component
  write(path.join(WEB, 'src', 'components', 'KycProgress.jsx'), `export default function KycProgress({ current, total = 5 }) {
  return (
    <div className="kyc-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      <span className="kyc-progress-label">Step {current} of {total}</span>
      <ol className="kyc-progress-dots">
        {Array.from({ length: total }, (_, i) => i + 1).map(n => (
          <li key={n} className={\`kyc-dot \${n < current ? 'done' : ''} \${n === current ? 'active' : ''}\`}>
            {n}
          </li>
        ))}
      </ol>
    </div>
  );
}
`);

  // KYC auto-save hook
  write(path.join(WEB, 'src', 'hooks', 'useAutoSave.js'), `import { useEffect, useRef } from 'react';

export function useAutoSave(key, value) {
  const timer = useRef();
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }, 500);
    return () => clearTimeout(timer.current);
  }, [key, value]);
}

export function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
`);

  // Hero copy patch — non-destructive: inject a hero tagline file
  write(path.join(WEB, 'src', 'content', 'hero.js'), `export const hero = {
  headline: 'Direct access to vetted Nigerian real-estate and credit opportunities.',
  subhead: 'Verified by Bravelion Capital. Starting at ₦5,000.',
  primaryCta: 'Browse Opportunities',
  secondaryCta: 'How It Works',
};
`);

  done('trust assets written — wire TrustStrip into Landing.jsx and KycProgress into your KYC step');
}

// ---------------------------------------------------------------- PILLAR 3: PREMIUM UI/UX
function pillarUI() {
  console.log('\n🎨 PILLAR 3 — PREMIUM UI/UX\n');

  // 3.1 Design tokens
  write(path.join(WEB, 'src', 'styles', 'tokens.css'), `:root {
  --accent: #0d6e4f;
  --accent-hover: #0a5a40;
  --accent-soft: #e8f4ef;

  --positive: #0d8a5f;
  --negative: #c0392b;

  --text: #1a1a1a;
  --muted: #6b7280;
  --border: #e5e7eb;
  --surface: #ffffff;
  --bg: #fafafa;

  --radius: 10px;

  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Playfair Display', serif;
}
`);

  // 3.2 Dashboard hero
  write(path.join(WEB, 'src', 'components', 'DashboardHero.jsx'), `import './DashboardHero.css';

export default function DashboardHero({ portfolio, stats, wallet }) {
  const positive = (portfolio?.monthlyDelta ?? 0) >= 0;
  const fmt = (n) => \`₦\${(n ?? 0).toLocaleString('en-NG')}\`;
  return (
    <section className="dashboard-hero">
      <div className="hero-metric">
        <p className="label">Total Portfolio Value</p>
        <h1 className="amount">{fmt(portfolio?.totalValue)}</h1>
        <p className={\`delta \${positive ? 'positive' : 'negative'}\`}>
          {positive ? '+' : '−'}{fmt(Math.abs(portfolio?.monthlyDelta ?? 0))} this month
          {portfolio?.deltaPercent != null && \` · \${portfolio.deltaPercent.toFixed(1)}%\`}
        </p>
      </div>
      <div className="hero-secondary">
        <Stat label="Active Investments" value={stats?.activeInvestments ?? 0} />
        <Stat label="Wallet Balance" value={fmt(wallet?.balance)} />
        <Stat label="Open Opportunities" value={stats?.openProjects ?? 0} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
`);

  write(path.join(WEB, 'src', 'components', 'DashboardHero.css'), `.dashboard-hero { display: grid; gap: var(--s-5, 24px); margin-bottom: var(--s-6, 32px); }
.hero-metric { text-align: left; }
.hero-metric .label { font-size: 14px; color: var(--muted, #6b7280); margin: 0 0 var(--s-2, 8px); }
.hero-metric .amount { font-family: var(--font-serif, 'Playfair Display', serif); font-size: clamp(36px, 5vw, 56px); font-weight: 700; margin: 0; color: var(--text, #1a1a1a); line-height: 1.1; }
.hero-metric .delta { font-size: 15px; font-weight: 600; margin: var(--s-2, 8px) 0 0; }
.hero-metric .delta.positive { color: var(--positive, #0d8a5f); }
.hero-metric .delta.negative { color: var(--negative, #c0392b); }
.hero-secondary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--s-4, 16px); }
.stat-card { background: var(--surface, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: var(--radius, 10px); padding: var(--s-4, 16px); }
.stat-label { display: block; font-size: 13px; color: var(--muted, #6b7280); }
.stat-value { display: block; font-size: 22px; font-weight: 600; margin-top: var(--s-1, 4px); }
`);

  // 3.3 Return Calculator
  write(path.join(WEB, 'src', 'components', 'ReturnCalculator.jsx'), `import { useMemo, useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import './ReturnCalculator.css';

export default function ReturnCalculator({ project }) {
  const [principal, setPrincipal] = useState(project.minAmount);
  const [tenor, setTenor] = useState(project.defaultTenor || 12);

  const projected = useMemo(() => {
    const rate = (project.annualRate || 0) / 100;
    return principal * (1 + rate * (tenor / 12));
  }, [principal, tenor, project.annualRate]);

  const earnings = projected - principal;
  const savingsEquivalent = principal * 0.04 * (tenor / 12);

  const animatedProjected = useCountUp(projected);
  const animatedEarnings = useCountUp(earnings);

  const fmt = (n) => \`₦\${Math.round(n).toLocaleString('en-NG')}\`;

  return (
    <div className="calculator">
      <div className="calc-inputs">
        <label>
          <span>You invest</span>
          <input
            type="range"
            min={project.minAmount}
            max={project.maxAmount}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
          />
          <strong>{fmt(principal)}</strong>
        </label>
        <label>
          <span>Tenor</span>
          <input
            type="range"
            min={3}
            max={36}
            step={3}
            value={tenor}
            onChange={(e) => setTenor(+e.target.value)}
          />
          <strong>{tenor} months</strong>
        </label>
      </div>

      <div className="calc-outputs" aria-live="polite">
        <div><span className="muted">You invest</span><strong>{fmt(principal)}</strong></div>
        <div><span className="muted">You earn</span><strong className="positive">{fmt(animatedEarnings)}</strong></div>
        <div><span className="muted">You receive</span><strong>{fmt(animatedProjected)}</strong></div>
      </div>

      <p className="comparison">
        A typical savings account would earn ~{fmt(savingsEquivalent)} over the same period.
      </p>
    </div>
  );
}
`);

  write(path.join(WEB, 'src', 'components', 'ReturnCalculator.css'), `.calculator { background: var(--surface, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: var(--radius, 10px); padding: var(--s-5, 24px); }
.calc-inputs { display: grid; gap: var(--s-4, 16px); margin-bottom: var(--s-5, 24px); }
.calc-inputs label { display: grid; gap: var(--s-2, 8px); font-size: 14px; color: var(--muted, #6b7280); }
.calc-inputs input[type=range] { width: 100%; accent-color: var(--accent, #0d6e4f); }
.calc-inputs strong { font-size: 16px; color: var(--text, #1a1a1a); font-weight: 600; }
.calc-outputs { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s-3, 12px); padding: var(--s-4, 16px) 0; border-top: 1px solid var(--border, #e5e7eb); border-bottom: 1px solid var(--border, #e5e7eb); }
.calc-outputs > div { display: grid; gap: 4px; }
.calc-outputs .muted { font-size: 12px; color: var(--muted, #6b7280); }
.calc-outputs strong { font-size: 18px; font-weight: 600; }
.calc-outputs .positive { color: var(--positive, #0d8a5f); }
.comparison { margin: var(--s-4, 16px) 0 0; font-size: 13px; color: var(--muted, #6b7280); font-style: italic; }
@media (max-width: 640px) { .calc-outputs { grid-template-columns: 1fr; } }
`);

  // 3.4 useCountUp hook
  write(path.join(WEB, 'src', 'hooks', 'useCountUp.js'), `import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 400) {
  const [value, setValue] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const start = prev.current;
    const delta = target - start;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(start + delta * p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
`);

  // 3.5 Risk Card
  write(path.join(WEB, 'src', 'components', 'RiskCard.jsx'), `import './RiskCard.css';

export default function RiskCard({ project }) {
  const level = project.riskLevel ?? 3;
  const name = level <= 2 ? 'Low' : level <= 3 ? 'Medium' : 'High';
  const tone = level <= 2 ? 'low' : level <= 3 ? 'medium' : 'high';
  return (
    <div className="risk-card" aria-label="Risk profile">
      <p className="risk-label">RISK PROFILE</p>
      <div className="risk-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={\`bar \${i <= level ? 'filled' : ''} \${tone}\`} />
        ))}
        <span className={\`risk-name \${tone}\`}>{name}</span>
      </div>
      <dl>
        <dt>Backed by</dt><dd>{project.backing || 'Registered property title'}</dd>
        <dt>Liquidity</dt><dd>Locked {project.tenor || 12} months</dd>
        <dt>Default history</dt><dd>0%</dd>
      </dl>
    </div>
  );
}
`);

  write(path.join(WEB, 'src', 'components', 'RiskCard.css'), `.risk-card { background: var(--surface, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: var(--radius, 10px); padding: var(--s-4, 16px); }
.risk-label { margin: 0 0 var(--s-3, 12px); font-size: 11px; letter-spacing: 1px; color: var(--muted, #6b7280); font-weight: 600; }
.risk-bars { display: flex; align-items: center; gap: 4px; margin-bottom: var(--s-4, 16px); }
.risk-bars .bar { flex: 1; height: 6px; border-radius: 3px; background: var(--border, #e5e7eb); }
.risk-bars .bar.filled.low { background: var(--positive, #0d8a5f); }
.risk-bars .bar.filled.medium { background: #d97706; }
.risk-bars .bar.filled.high { background: var(--negative, #c0392b); }
.risk-name { font-size: 14px; font-weight: 600; margin-left: var(--s-2, 8px); }
.risk-name.low { color: var(--positive, #0d8a5f); }
.risk-name.medium { color: #d97706; }
.risk-name.high { color: var(--negative, #c0392b); }
.risk-card dl { display: grid; grid-template-columns: auto 1fr; gap: 6px var(--s-3, 12px); margin: 0; font-size: 13px; }
.risk-card dt { color: var(--muted, #6b7280); }
.risk-card dd { margin: 0; color: var(--text, #1a1a1a); }
`);

  // 3.6 Mobile sticky CTA component
  write(path.join(WEB, 'src', 'components', 'MobileProjectCTA.jsx'), `import './MobileProjectCTA.css';

export default function MobileProjectCTA({ minAmount, onInvest }) {
  return (
    <div className="project-cta-mobile">
      <span className="min-amount">Min ₦{(minAmount ?? 5000).toLocaleString('en-NG')}</span>
      <button onClick={onInvest}>Invest →</button>
    </div>
  );
}
`);

  write(path.join(WEB, 'src', 'components', 'MobileProjectCTA.css'), `.project-cta-mobile { display: none; }
@media (max-width: 768px) {
  .project-cta-mobile {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--surface, #fff);
    padding: 12px 16px;
    border-top: 1px solid var(--border, #e5e7eb);
    display: flex; gap: 12px; align-items: center;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.06);
    z-index: 50;
  }
  .project-cta-mobile .min-amount { flex: 1; font-size: 14px; color: var(--muted, #6b7280); }
  .project-cta-mobile button {
    flex: 2; background: var(--accent, #0d6e4f); color: #fff;
    border: none; border-radius: var(--radius, 10px);
    padding: 14px; font-weight: 600; font-size: 15px; cursor: pointer;
  }
}
`);

  // 3.7 Year in Review share hook
  write(path.join(WEB, 'src', 'hooks', 'useShareYearInReview.js'), `export async function shareYearInReview(nodeId, filename = 'bravevest-year-in-review.png') {
  const node = document.getElementById(nodeId);
  if (!node) throw new Error('Year in Review card not found');
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(node, { backgroundColor: '#0d6e4f', scale: 2 });
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}
`);

  done('UI components written — import them in their pages');
}

// ---------------------------------------------------------------- PILLAR 4: TECHNICAL
function pillarTech() {
  console.log('\n🛠️  PILLAR 4 — TECHNICAL HARDENING\n');

  // 4.3 React Query setup
  write(path.join(WEB, 'src', 'lib', 'queryClient.js'), `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
`);

  // 4.4 Accessibility helper CSS
  write(path.join(WEB, 'src', 'styles', 'a11y.css'), `:focus-visible { outline: 2px solid var(--accent, #0d6e4f); outline-offset: 2px; border-radius: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
`);

  // 4.5 Route loader component
  write(path.join(WEB, 'src', 'components', 'RouteLoader.jsx'), `export default function RouteLoader() {
  return (
    <div className="route-loader" aria-busy="true" aria-live="polite" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <span className="sr-only">Loading…</span>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#0d6e4f', borderRadius: '50%', animation: 'bv-spin 0.8s linear infinite' }} />
      <style>{\`@keyframes bv-spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  );
}
`);

  // 4.6 Lazy App.jsx
  write(path.join(WEB, 'src', 'App.jsx'), `import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import RouteLoader from './components/RouteLoader';

const Landing = lazy(() => import('./pages/Landing'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Wallet = lazy(() => import('./pages/Wallet'));
const KYC = lazy(() => import('./pages/KYC'));
const YearInReview = lazy(() => import('./pages/YearInReview'));
const Admin = lazy(() => import('./pages/admin/Admin'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/kyc/*" element={<KYC />} />
            <Route path="/year-in-review" element={<YearInReview />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </QueryClientProvider>
  );
}
`);

  // 4.7 Aggregated styles import
  write(path.join(WEB, 'src', 'styles', 'index.css'), `@import './fonts.css';
@import './tokens.css';
@import './a11y.css';
`);

  done('technical scaffolding written — import styles/index.css once in main.jsx');
}

// ---------------------------------------------------------------- RUN
function main() {
  console.log('🚀 BraveVest Improvement Script');
  console.log(`   root: ${ROOT}`);
  console.log(`   backup: ${DRY ? '(skipped — dry run)' : path.relative(ROOT, BACKUP_DIR)}`);
  if (ONLY) console.log(`   pillars: ${ONLY.join(', ')}`);
  if (DRY) console.log('   mode: DRY RUN\n');

  if (!fs.existsSync(WEB) || !fs.existsSync(API)) {
    console.error('❌ bravevest-web/ and bravevest-api/ must exist in cwd');
    process.exit(1);
  }

  if (should('perf')) pillarPerformance();
  if (should('trust')) pillarTrust();
  if (should('ui')) pillarUI();
  if (should('tech')) pillarTech();

  console.log('\n📦 NEXT STEPS');
  console.log('  1. cd bravevest-web && npm i @tanstack/react-query html2canvas');
  console.log('  2. cd bravevest-api && npm i sharp');
  console.log('  3. cd bravevest-api && npx prisma migrate dev --name add_indexes');
  console.log('  4. In src/main.jsx add: import "./styles/index.css";');
  console.log('  5. In src/pages/Landing.jsx import <TrustStrip /> under hero');
  console.log('  6. In src/pages/ProjectDetail.jsx add <RiskCard />, <ReturnCalculator />, <MobileProjectCTA />');
  console.log('  7. In src/pages/Dashboard.jsx add <DashboardHero /> at top, drop old charts below fold');
  console.log('  8. Download font .woff2 files into bravevest-web/public/fonts/');
  console.log('  9. Run npm run build and npx vite-bundle-visualizer to confirm');
  console.log(`\n✨ Done${DRY ? ' (dry run)' : ''}.`);
}

main();