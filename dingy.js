#!/usr/bin/env node
// fix-funding-currency.js — align funding pages to existing CurrencyContext API
// Run from repo root: `node fix-funding-currency.js [--dry]`

const fs = require('fs');
const path = require('path');

const WEB = path.join(process.cwd(), 'bravevest-web');
const DRY = process.argv.includes('--dry');

const log = (m) => console.log(`\x1b[38;5;149m▸\x1b[0m ${m}`);
const ok = (m) => console.log(`\x1b[38;5;42m✓\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[38;5;214m!\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[38;5;117m·\x1b[0m ${m}`);

const TARGETS = [
  'src/pages/funding/FundingList.jsx',
  'src/pages/funding/FundingDetail.jsx',
  'src/pages/funding/FundingNew.jsx',
  'src/pages/funding/FundingMine.jsx',
  'src/pages/funding/AdminReview.jsx',
  'src/components/funding/FundingCard.jsx',
  'src/components/funding/CommitModal.jsx',
  'src/pages/investor/Commitments.jsx',
  'src/pages/investor/Dashboard.jsx',
];

function read(rel) {
  const abs = path.join(WEB, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
}
function write(rel, c) {
  if (DRY) { info(`would write: ${rel}`); return; }
  const abs = path.join(WEB, rel);
  const bak = abs + '.bak';
  if (!fs.existsSync(bak)) fs.copyFileSync(abs, bak);
  fs.writeFileSync(abs, c);
  log(`wrote: ${rel}`);
}

console.log('');
log('Fixing funding page currency API alignment');
if (DRY) warn('DRY RUN');
console.log('');

let total = 0;
for (const rel of TARGETS) {
  const c = read(rel);
  if (!c) { warn(`skip: ${rel} (missing)`); continue; }
  let next = c;
  let touched = false;

  // 1. Destructure swap
  if (/const\s*\{[^}]*\bcurrency\b[^}]*\}\s*=\s*useCurrency\(\)/.test(next)) {
    next = next.replace(
      /const\s*\{([^}]*)\}\s*=\s*useCurrency\(\)/g,
      (m, inner) => {
        let parts = inner.split(',').map((s) => s.trim()).filter(Boolean);
        parts = parts.map((p) => {
          if (p === 'currency') return 'code';
          if (p === 'setCurrency') return 'setCode';
          return p;
        });
        return `const { ${parts.join(', ')} } = useCurrency();`;
      }
    );
    touched = true;
    ok(`${rel}: destructure currency -> code`);
  }

  // 2. Inline usages: {currency} {format(x)}  ->  {format(x)}
  //    and "{currency} 500" -> "{format(500)}"
  if (/\{currency\}\s*\{format\(/.test(next)) {
    next = next.replace(/\{currency\}\s+\{format\(/g, '{format(');
    next = next.replace(/\{format\(([^}]+)\)\}/g, '{format($1)}');
    touched = true;
    ok(`${rel}: removed currency prefix before format`);
  }

  // 3. String comparisons: currency === 'NGN'  ->  code === 'NGN'
  if (/\bcurrency\s*===/.test(next) || /\bcurrency\s*!==/.test(next)) {
    next = next.replace(/\bcurrency(\s*[!=]==?\s*)/g, 'code$1');
    touched = true;
    ok(`${rel}: currency comparisons -> code`);
  }

  // 4. Render as text: <span>{currency}</span> or similar  ->  <span>{code}</span>
  if (/>\s*\{currency\}\s*</.test(next)) {
    next = next.replace(/>\s*\{currency\}\s*</g, '>{code}<');
    touched = true;
    ok(`${rel}: standalone {currency} -> {code}`);
  }

  // 5. Template literals: `${currency} ${amount}` -> format(amount)
  //    Only touch the common "amount display" pattern
  if (/`\$\{currency\}\s*\$\{([^}]+)\}`/.test(next)) {
    next = next.replace(/`\$\{currency\}\s*\$\{([^}]+)\}`/g, '{format($1)}');
    touched = true;
    ok(`${rel}: template literal currency prefix removed`);
  }

  if (touched) {
    write(rel, next);
    total++;
  }
}

console.log('');
log(`--- ${total} file${total === 1 ? '' : 's'} updated ---`);
if (!DRY) {
  console.log('');
  info('next:');
  info('  git diff bravevest-web/src | head -200');
  info('  cd bravevest-web && npm run dev');
  info('  reload /funding, /dashboard, /commitments — all should render');
}
console.log('');