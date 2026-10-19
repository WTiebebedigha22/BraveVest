#!/usr/bin/env node
// mvp-phase6-schema.js — Phase 6 schema extensions
// Run from repo root: `node mvp-phase6-schema.js [--force] [--dry]`

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

if (!fs.existsSync(API)) { err('bravevest-api not found'); process.exit(1); }

const schemaPath = path.join(API, 'prisma/schema.prisma');

console.log('');
log('Phase 6 — Schema');
if (DRY) warn('DRY RUN');
console.log('');

let schema = fs.readFileSync(schemaPath, 'utf8');
let changed = false;

// ---------- 1. Extend CommitmentStatus enum ----------
const commitStatusRe = /enum\s+CommitmentStatus\s*\{([^}]*)\}/;
const csMatch = schema.match(commitStatusRe);
if (!csMatch) {
  err('enum CommitmentStatus not found — Phase 1–3 not applied?');
  process.exit(1);
}
const requiredStatuses = ['PENDING_TRANSFER', 'TRANSFERRED', 'PENDING_VERIFY', 'DISBURSED', 'EXPIRED', 'REFUNDED'];
const missing = requiredStatuses.filter((s) => !csMatch[1].includes(s));
if (missing.length) {
  const newBlock = csMatch[0].replace(/\}/, missing.map((s) => `  ${s}`).join('\n') + '\n}');
  schema = schema.replace(commitStatusRe, newBlock);
  changed = true;
  log(`   + CommitmentStatus: ${missing.join(', ')}`);
} else {
  info('   CommitmentStatus already extended');
}

// ---------- 2. Extend Commitment model ----------
const commitModelRe = /model\s+Commitment\s*\{[\s\S]*?\n\}/;
const cmMatch = schema.match(commitModelRe);
if (!cmMatch) {
  err('model Commitment not found');
  process.exit(1);
}
const cmFields = [
  ['transferWindowExpiresAt', 'DateTime?'],
  ['disbursementVerifyExpiresAt', 'DateTime?'],
  ['paystackReference', 'String? @unique'],
  ['paystackAccessCode', 'String?'],
  ['transferredAt', 'DateTime?'],
  ['disbursedAt', 'DateTime?'],
  ['expiredAt', 'DateTime?'],
  ['refundedAt', 'DateTime?'],
];
const cmBody = cmMatch[0];
const additions = cmFields.filter(([name]) => !new RegExp(`\\b${name}\\b`).test(cmBody));
if (additions.length) {
  const padded = additions.map(([name, type]) => `  ${name.padEnd(28)} ${type}`);
  const newBlock = cmBody.replace(/\n\}/, '\n' + padded.join('\n') + '\n}');
  schema = schema.replace(commitModelRe, newBlock);
  changed = true;
  log(`   + Commitment: ${additions.map(([n]) => n).join(', ')}`);
} else {
  info('   Commitment already extended');
}

// ---------- 3. Extend FundingRequest ----------
const frModelRe = /model\s+FundingRequest\s*\{[\s\S]*?\n\}/;
const frMatch = schema.match(frModelRe);
if (!frMatch) {
  err('model FundingRequest not found');
  process.exit(1);
}
const frFields = [
  ['disbursedAt', 'DateTime?'],
  ['fullyFundedAt', 'DateTime?'],
];
const frBody = frMatch[0];
const frAdditions = frFields.filter(([name]) => !new RegExp(`\\b${name}\\b`).test(frBody));
if (frAdditions.length) {
  const padded = frAdditions.map(([name, type]) => `  ${name.padEnd(20)} ${type}`);
  const newBlock = frBody.replace(/\n\}/, '\n' + padded.join('\n') + '\n}');
  schema = schema.replace(frModelRe, newBlock);
  changed = true;
  log(`   + FundingRequest: ${frAdditions.map(([n]) => n).join(', ')}`);
} else {
  info('   FundingRequest already extended');
}

if (!changed) {
  info('no schema changes needed');
} else if (DRY) {
  info('would write prisma/schema.prisma');
} else {
  const bak = schemaPath + '.bak';
  if (!fs.existsSync(bak)) fs.copyFileSync(schemaPath, bak);
  fs.writeFileSync(schemaPath, schema);
  log('wrote: prisma/schema.prisma');
}

console.log('');
log('---');
log('next:');
console.log('  cd bravevest-api');
console.log('  npx prisma format');
console.log('  npx prisma migrate dev --name phase6_money_movement');
console.log('  npx prisma generate');
console.log('');
warn('READ the migration SQL before confirming — expect only ADD COLUMN and ALTER TYPE ADD VALUE');
console.log('');