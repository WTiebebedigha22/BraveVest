#!/usr/bin/env node
// make-it-pop.js — Motion, gradients, glow, depth across the entire site
// Run from repo root: `node make-it-pop.js [--dry]`

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WEB = path.join(ROOT, 'bravevest-web');
const SRC = path.join(WEB, 'src');
const DRY = process.argv.includes('--dry');

const log = (m) => console.log(`\x1b[38;5;149m▸\x1b[0m ${m}`);
const err = (m) => console.log(`\x1b[38;5;203m✗\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[38;5;117m·\x1b[0m ${m}`);

function write(rel, contents) {
  const abs = path.join(WEB, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (DRY) { info(`would write: ${rel}`); return; }
  fs.writeFileSync(abs, contents);
  log(`wrote: ${rel}`);
}

if (!fs.existsSync(WEB)) { err('bravevest-web not found'); process.exit(1); }

console.log('');
log('Making BraveVest pop');
console.log('');

// ============================================================
// 1. THE POP CSS
// ============================================================
write('src/assets/styles/pop.css', `/* ============================================================
   BRAVEVEST POP — motion, gradients, depth
   Loaded after theme-overrides.css
   ============================================================ */

/* ============================================================
   ANIMATION TOKENS
   ============================================================ */
:root {
  --pop-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --pop-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --pop-dur-fast: 0.2s;
  --pop-dur: 0.35s;
  --pop-dur-slow: 0.6s;

  --pop-grad-orange: linear-gradient(135deg, #F6A500 0%, #FFD966 100%);
  --pop-grad-hero: linear-gradient(135deg, #F6A500 0%, #D98F00 100%);
  --pop-grad-shine: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
}

/* ============================================================
   GLOBAL SMOOTHING
   ============================================================ */
* {
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
}

/* ============================================================
   AMBIENT GLOW ORBS
   Floating backgrounds that give the page depth
   ============================================================ */
.ambient-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  animation: orbDrift 20s ease-in-out infinite;
}

.ambient-orb--orange {
  background: rgba(246, 165, 0, 0.3);
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}

.ambient-orb--green {
  background: rgba(14, 203, 129, 0.2);
  width: 350px;
  height: 350px;
  bottom: -150px;
  left: -150px;
  animation-delay: -10s;
}

@keyframes orbDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

:root[data-theme="light"] .ambient-orb {
  opacity: 0.25;
}

/* ============================================================
   GRADIENT TEXT — for hero headlines
   ============================================================ */
.text-gradient {
  background: var(--pop-grad-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h1 .text-gradient {
  background: linear-gradient(135deg, #F6A500 0%, #FFD966 50%, #F6A500 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ============================================================
   BUTTONS — gradient + shine sweep
   ============================================================ */
.btn--primary {
  position: relative;
  overflow: hidden;
  background: var(--pop-grad-hero);
  box-shadow: 0 4px 16px rgba(246, 165, 0, 0.3);
  transition: transform var(--pop-dur-fast) var(--pop-ease), box-shadow var(--pop-dur-fast) var(--pop-ease);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(246, 165, 0, 0.45);
}

.btn--primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--pop-grad-shine);
  transform: translateX(-100%);
  transition: transform var(--pop-dur-slow) var(--pop-ease);
}

.btn--primary:hover::before {
  transform: translateX(100%);
}

.btn--primary:active {
  transform: translateY(0) scale(0.98);
}

/* Secondary buttons get a subtle scale */
.btn--outline:hover {
  transform: translateY(-1px);
}

/* ============================================================
   CARDS — magnetic hover with lift + shadow bloom
   ============================================================ */
.card {
  transition: transform var(--pop-dur) var(--pop-ease),
              box-shadow var(--pop-dur) var(--pop-ease),
              border-color var(--pop-dur-fast) var(--pop-ease);
  will-change: transform;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--bv-border-strong);
}

:root[data-theme="light"] .card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--bv-border-strong);
}

/* Interactive cards (project cards, links) get cursor pointer + bigger lift */
a .card,
a.card,
.card[onclick],
.card[role="button"] {
  cursor: pointer;
}

a .card:hover,
a.card:hover {
  transform: translateY(-6px) scale(1.01);
}

/* ============================================================
   SCROLL REVEAL
   Elements with class .reveal start hidden and animate in when visible
   ============================================================ */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s var(--pop-ease), transform 0.8s var(--pop-ease);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.08s; }
.reveal-delay-2 { transition-delay: 0.16s; }
.reveal-delay-3 { transition-delay: 0.24s; }
.reveal-delay-4 { transition-delay: 0.32s; }

/* ============================================================
   PILLS AND BADGES — micro-animation
   ============================================================ */
.pill {
  transition: transform var(--pop-dur-fast) var(--pop-ease-bounce),
              box-shadow var(--pop-dur-fast) var(--pop-ease);
}

.pill:hover {
  transform: scale(1.05);
}

.pill--green {
  box-shadow: 0 0 0 0 rgba(14, 203, 129, 0.5);
  animation: pillPulse 2.5s infinite;
}

@keyframes pillPulse {
  0% { box-shadow: 0 0 0 0 rgba(14, 203, 129, 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(14, 203, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 203, 129, 0); }
}

/* ============================================================
   TABS — underline slides in
   ============================================================ */
.bybit-tabs__item {
  position: relative;
  transition: color var(--pop-dur-fast) var(--pop-ease);
}

.bybit-tabs__item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--bv-orange);
  transition: all var(--pop-dur) var(--pop-ease);
  transform: translateX(-50%);
}

.bybit-tabs__item.active::after {
  width: 100%;
}

/* ============================================================
   HERO — layered glow + entrance
   ============================================================ */
.hero {
  position: relative;
  overflow: hidden;
}

.hero::before {
  animation: heroGlow 8s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
}

.hero h1 {
  animation: heroEntrance 0.9s var(--pop-ease) both;
}

.hero .lede {
  animation: heroEntrance 0.9s var(--pop-ease) 0.15s both;
}

.hero__ctas {
  animation: heroEntrance 0.9s var(--pop-ease) 0.3s both;
}

@keyframes heroEntrance {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   NUMBER COUNTERS — used by JS
   ============================================================ */
.count-up {
  font-variant-numeric: tabular-nums;
  display: inline-block;
}

/* ============================================================
   SPARKLINES — glowing stroke
   ============================================================ */
svg polyline[stroke="var(--bv-orange)"],
svg polyline[stroke="#F6A500"] {
  filter: drop-shadow(0 0 6px rgba(246, 165, 0, 0.5));
}

/* ============================================================
   SKELETON LOADING
   ============================================================ */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bv-surface) 0%,
    var(--bv-surface-2) 50%,
    var(--bv-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  display: inline-block;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-line { height: 12px; width: 100%; margin-bottom: 8px; }
.skeleton-line.short { width: 40%; }
.skeleton-circle { width: 40px; height: 40px; border-radius: 50%; }

/* ============================================================
   PAGE TRANSITIONS — fade on route change
   ============================================================ */
.page-fade-in {
  animation: pageFadeIn 0.3s var(--pop-ease) both;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   LINKS — underline grows on hover
   ============================================================ */
a:not(.btn):not(.sidebar-link):hover {
  color: var(--bv-orange);
}

/* ============================================================
   TABLES — row lift on hover
   ============================================================ */
.fin-table tbody tr {
  transition: transform var(--pop-dur-fast) var(--pop-ease), background var(--pop-dur-fast) var(--pop-ease);
}

.fin-table tbody tr:hover td {
  background: var(--bv-hover);
}

.fin-table tbody tr:hover {
  transform: translateX(2px);
}

/* ============================================================
   MODALS — scale entrance
   ============================================================ */
.modal-inner, [role="dialog"] > div {
  animation: modalIn 0.3s var(--pop-ease-bounce) both;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* ============================================================
   ICONS — subtle bounce on parent hover
   ============================================================ */
.card:hover svg,
.btn:hover svg {
  animation: iconBounce 0.4s var(--pop-ease-bounce);
}

@keyframes iconBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* ============================================================
   CURSOR — custom pointer on interactive areas (desktop only)
   ============================================================ */
@media (hover: hover) and (pointer: fine) {
  .btn, .card, a, button, [role="button"] {
    cursor: pointer;
  }
}

/* ============================================================
   REDUCED MOTION — respect accessibility preference
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
`);

// ============================================================
// 2. MOTION HOOKS
// ============================================================
write('src/hooks/useReveal.js', `import { useEffect, useRef } from 'react';

// Automatically adds .reveal to children when they enter the viewport
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.classList.add('reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// Apply reveal to all sections and cards automatically
export function useAutoReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const els = document.querySelectorAll('section, .card, .reveal-target');
    els.forEach((el, i) => {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('reveal');
      if (i < 8) el.classList.add('reveal-delay-' + Math.min(4, i));
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
`);

write('src/hooks/useCountUp.js', `import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const numTarget = Number(target) || 0;
    startRef.current = null;

    function step(ts) {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(numTarget * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
`);

// ============================================================
// 3. WIRE POP INTO THE APP
// ============================================================
// Import pop.css in main.jsx
const mainPath = path.join(SRC, 'main.jsx');
if (fs.existsSync(mainPath)) {
  let c = fs.readFileSync(mainPath, 'utf8');
  if (!c.includes('pop.css')) {
    c = c.replace(
      /import\s+['"]\.\/assets\/styles\/theme-overrides\.css['"];?/,
      "import './assets/styles/theme-overrides.css';\nimport './assets/styles/pop.css';"
    );
    // If theme-overrides wasn't there, append after global
    if (!c.includes('pop.css')) {
      c = c.replace(
        /import\s+['"]\.\/assets\/styles\/global\.css['"];?/,
        "import './assets/styles/global.css';\nimport './assets/styles/pop.css';"
      );
    }
    if (!DRY) { fs.writeFileSync(mainPath, c); log('imported pop.css in main.jsx'); }
  } else {
    info('pop.css already imported');
  }
}

// Add useAutoReveal call to App.jsx
const appPath = path.join(SRC, 'App.jsx');
if (fs.existsSync(appPath)) {
  let c = fs.readFileSync(appPath, 'utf8');
  if (!c.includes('useAutoReveal')) {
    // Add import
    if (!c.includes("from '@/hooks/useReveal'")) {
      c = c.replace(
        /(import[^\n]*react['"];?\n)/,
        `$1import { useAutoReveal } from '@/hooks/useReveal';\n`
      );
    }
    // Add hook call inside the App component
    const appFuncRe = /export default function App\(\)\s*\{/;
    if (appFuncRe.test(c)) {
      c = c.replace(appFuncRe, `export default function App() {\n  useAutoReveal();\n`);
    }
    if (!DRY) { fs.writeFileSync(appPath, c); log('wired useAutoReveal into App.jsx'); }
  } else {
    info('App.jsx already has useAutoReveal');
  }
}

// ============================================================
// 4. UPDATE HOME HERO WITH GRADIENT TEXT + ORBS
// ============================================================
const homePath = path.join(SRC, 'pages/public/Home.jsx');
if (fs.existsSync(homePath)) {
  let c = fs.readFileSync(homePath, 'utf8');
  const original = c;

  // Add gradient span around the second line of the h1 if not already there
  if (!c.includes('text-gradient')) {
    c = c.replace(
      /One place to grow<br \/>\s*your money\./,
      'One place to grow<br /><span className="text-gradient">your money.</span>'
    );
    // Add ambient orbs at the top of the returned div
    c = c.replace(
      /return \(\s*<div>/,
      `return (\n    <div>\n      <div className="ambient-orb ambient-orb--orange" />\n      <div className="ambient-orb ambient-orb--green" />`
    );
  }

  if (c !== original && !DRY) {
    fs.writeFileSync(homePath, c);
    log('added gradient text + orbs to Home.jsx');
  }
}

// ============================================================
// 5. ADD SKELETON LOADERS TO DASHBOARD
// ============================================================
// Replace "Loading…" text with skeleton on key pages
const pagesToSkeleton = [
  'src/pages/investor/Dashboard.jsx',
  'src/pages/investor/Portfolio.jsx',
  'src/pages/investor/Wallet.jsx',
  'src/pages/investor/Investments.jsx',
  'src/pages/admin/Dashboard.jsx',
];

for (const rel of pagesToSkeleton) {
  const abs = path.join(WEB, rel);
  if (!fs.existsSync(abs)) continue;
  let c = fs.readFileSync(abs, 'utf8');
  if (c.includes('Loading…') && !c.includes('skeleton')) {
    c = c.replace(
      /<div style=\{\{\s*padding:[^}]+textAlign:\s*'center'[^}]*\}\}>Loading…<\/div>/g,
      `<div style={{ padding: '24px' }}>
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>`
    );
    if (!DRY) { fs.writeFileSync(abs, c); log('skeletonised loading states in ' + path.basename(rel)); }
  }
}

console.log('');
log('---');
if (DRY) {
  console.log(`\x1b[38;5;214m!\x1b[0m DRY RUN — nothing written`);
} else {
  log('Site polished to pop.');
  console.log('');
  log('what changed:');
  console.log('  ✓ Gradient hero headline (orange → gold)');
  console.log('  ✓ Ambient glow orbs drifting behind pages');
  console.log('  ✓ Magnetic card hover: lift + shadow bloom');
  console.log('  ✓ Buttons: gradient background + shine sweep');
  console.log('  ✓ Scroll reveal on cards and sections');
  console.log('  ✓ Pill pulse animation on green status');
  console.log('  ✓ Tab underline slide-in');
  console.log('  ✓ Icon bounce on parent hover');
  console.log('  ✓ Skeleton loaders instead of plain text');
  console.log('  ✓ Sparkline glow on portfolio chart');
  console.log('  ✓ Hero entrance animation');
  console.log('  ✓ Reduced-motion respected');
  console.log('');
  log('next:');
  console.log('  cd bravevest-web && npm run dev');
  console.log('');
  log('what to look for:');
  console.log('  - Home: text gradient on "your money." + orbs drifting');
  console.log('  - Hover any card: it lifts up');
  console.log('  - Hover any primary button: shine sweeps across');
  console.log('  - Scroll down: cards fade in as they enter view');
  console.log('  - Portfolio: sparkline has orange glow');
  console.log('  - Dashboard loading: skeleton shimmer');
}
console.log('');