#!/usr/bin/env node
// mvp-phase3b-api.js — BraveVest MVP Phase 3b: commitment endpoints
// Run from repo root: `node mvp-phase3b-api.js [--force] [--dry]`

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const API = path.join(ROOT, 'bravevest-api');
const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

const log = (m) => console.log(`\x1b[38;5;149m▸\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[38;5;214m!\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[38;5;117m·\x1b[0m ${m}`);

function exists(rel) { return fs.existsSync(path.join(API, rel)); }
function write(rel, contents) {
  const abs = path.join(API, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (fs.existsSync(abs) && !FORCE) {
    const cur = fs.readFileSync(abs, 'utf8');
    if (cur === contents) { log(`unchanged: ${rel}`); return; }
  }
  if (DRY) { info(`would write: ${rel}`); return; }
  const bak = abs + '.bak';
  if (fs.existsSync(abs) && !fs.existsSync(bak)) fs.copyFileSync(abs, bak);
  fs.writeFileSync(abs, contents);
  log(`wrote: ${rel}`);
}

console.log('');
log('BraveVest MVP — Phase 3b: commitment endpoints');
if (DRY) warn('DRY RUN');
console.log('');

// ============================================================
// 1. Commitment service
// ============================================================
log('1. src/modules/funding/commitment.service.js');
write('src/modules/funding/commitment.service.js', `const { prisma } = require('../../config/database');

function makeRef() {
  return 'CM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

class CommitError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

// Creates a commitment against a PUBLISHED funding request.
// Runs inside a transaction so overfunding checks are atomic.
async function createCommitment(requestId, investorId, amount) {
  return prisma.$transaction(async (tx) => {
    const req = await tx.fundingRequest.findUnique({ where: { id: requestId } });
    if (!req) throw new CommitError('NOT_FOUND', 'Funding request not found');

    if (req.status !== 'PUBLISHED') {
      throw new CommitError('NOT_OPEN', \`Request is \${req.status}, not accepting commitments\`);
    }
    if (req.fundingDeadline && req.fundingDeadline < new Date()) {
      throw new CommitError('DEADLINE_PASSED', 'Funding deadline has passed');
    }

    const amt = Number(amount);
    if (amt <= 0) throw new CommitError('INVALID_AMOUNT', 'Amount must be positive');
    if (req.minCommitment != null && amt < Number(req.minCommitment)) {
      throw new CommitError('BELOW_MIN', \`Minimum commitment is \${req.minCommitment}\`);
    }
    if (req.maxCommitment != null && amt > Number(req.maxCommitment)) {
      throw new CommitError('ABOVE_MAX', \`Maximum commitment is \${req.maxCommitment}\`);
    }

    const alreadyFunded = Number(req.amountFunded);
    const remaining = Number(req.amountRequested) - alreadyFunded;
    if (amt > remaining) {
      throw new CommitError('OVERFUND', \`Only \${remaining} remains to be funded\`);
    }

    const commitment = await tx.commitment.create({
      data: {
        reference: makeRef(),
        requestId,
        investorId,
        amount: amt,
        currency: req.currency,
        status: 'CONFIRMED',      // Phase 4 will gate this behind payment verification
        confirmedAt: new Date(),
      },
    });

    const newFunded = alreadyFunded + amt;
    const nextStatus = newFunded >= Number(req.amountRequested) ? 'FUNDED' : req.status;

    await tx.fundingRequest.update({
      where: { id: requestId },
      data: {
        amountFunded: newFunded,
        status: nextStatus,
      },
    });

    return { commitment, request: { ...req, amountFunded: newFunded, status: nextStatus } };
  });
}

async function cancelCommitment(id, investorId) {
  return prisma.$transaction(async (tx) => {
    const c = await tx.commitment.findUnique({ where: { id } });
    if (!c) throw new CommitError('NOT_FOUND', 'Commitment not found');
    if (c.investorId !== investorId) throw new CommitError('FORBIDDEN', 'Not your commitment');
    if (c.status !== 'CONFIRMED') throw new CommitError('INVALID_STATE', \`Cannot cancel from \${c.status}\`);

    const req = await tx.fundingRequest.findUnique({ where: { id: c.requestId } });
    const newFunded = Math.max(0, Number(req.amountFunded) - Number(c.amount));

    await tx.fundingRequest.update({
      where: { id: c.requestId },
      data: {
        amountFunded: newFunded,
        status: req.status === 'FUNDED' && newFunded < Number(req.amountRequested)
          ? 'PUBLISHED'
          : req.status,
      },
    });

    return tx.commitment.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: 'self-cancel' },
    });
  });
}

async function listMine(investorId) {
  return prisma.commitment.findMany({
    where: { investorId },
    orderBy: { createdAt: 'desc' },
    include: {
      request: {
        select: {
          id: true, reference: true, title: true, status: true,
          amountRequested: true, amountFunded: true,
          currency: true, proposedReturnPct: true, durationMonths: true,
          fundingDeadline: true,
        },
      },
    },
  });
}

async function listForRequest(requestId) {
  return prisma.commitment.findMany({
    where: { requestId, status: 'CONFIRMED' },
    orderBy: { createdAt: 'desc' },
    include: {
      investor: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

module.exports = { createCommitment, cancelCommitment, listMine, listForRequest, CommitError };
`);

// ============================================================
// 2. Commitment routes
// ============================================================
log('2. src/modules/funding/commitment.routes.js');
write('src/modules/funding/commitment.routes.js', `const express = require('express');
const { z } = require('zod');
const { audit } = require('../../middleware/audit');
const { requireRole } = require('../../middleware/role');
const { success } = require('../../utils/apiResponse');
const svc = require('./commitment.service');

const router = express.Router();

let authenticate;
try {
  authenticate = require('../../middleware/authenticate').authenticate
    || require('../../middleware/auth').authenticate
    || require('../../middleware/auth').protect;
} catch {}
if (!authenticate) {
  authenticate = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required', code: 'UNAUTHENTICATED' });
    next();
  };
}

const createSchema = z.object({
  requestId: z.string().min(1),
  amount: z.number().positive(),
});

function mapCommitError(err, res) {
  const statusMap = {
    NOT_FOUND: 404, NOT_OPEN: 409, DEADLINE_PASSED: 409,
    INVALID_AMOUNT: 400, BELOW_MIN: 400, ABOVE_MAX: 400,
    OVERFUND: 409, FORBIDDEN: 403, INVALID_STATE: 409,
  };
  return res.status(statusMap[err.code] || 400).json({
    success: false, message: err.message, code: err.code,
  });
}

// POST /api/funding/commitments  { requestId, amount }
router.post('/commitments', authenticate, requireRole('INVESTOR', 'BORROWER', 'ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', code: 'VALIDATION_ERROR', issues: parsed.error.issues });
    const { requestId, amount } = parsed.data;
    const result = await svc.createCommitment(requestId, req.user.id, amount);
    await audit(req, 'create_commitment', 'Commitment', result.commitment.id, { requestId, amount });
    return res.status(201).json({ success: true, data: result });
  } catch (e) {
    if (e instanceof svc.CommitError) return mapCommitError(e, res);
    next(e);
  }
});

// GET /api/funding/commitments/mine
router.get('/commitments/mine', authenticate, async (req, res, next) => {
  try {
    const items = await svc.listMine(req.user.id);
    return success(res, items);
  } catch (e) { next(e); }
});

// GET /api/funding/requests/:id/commitments
router.get('/requests/:id/commitments', authenticate, async (req, res, next) => {
  try {
    const items = await svc.listForRequest(req.params.id);
    return success(res, items);
  } catch (e) { next(e); }
});

// POST /api/funding/commitments/:id/cancel
router.post('/commitments/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const result = await svc.cancelCommitment(req.params.id, req.user.id);
    await audit(req, 'cancel_commitment', 'Commitment', result.id);
    return success(res, result);
  } catch (e) {
    if (e instanceof svc.CommitError) return mapCommitError(e, res);
    next(e);
  }
});

module.exports = router;
`);

// ============================================================
// 3. Mount in app.js
// ============================================================
log('3. src/app.js');
const appPath = path.join(API, 'src/app.js');
let appJs = fs.readFileSync(appPath, 'utf8');
if (appJs.includes("commitment.routes")) {
  info('   already mounted');
} else {
  const line = "app.use('/api/funding', require('./modules/funding/commitment.routes'));";
  if (appJs.includes("require('./modules/funding/funding.routes')")) {
    appJs = appJs.replace(
      /(app\.use\('\/api\/funding',\s*require\('\.\/modules\/funding\/funding\.routes'\)\);)/,
      `${line}\n$1`
    );
    if (!DRY) {
      const bak = appPath + '.bak';
      if (!fs.existsSync(bak)) fs.copyFileSync(appPath, bak);
      fs.writeFileSync(appPath, appJs);
    }
    log('wrote: src/app.js');
    log('   + mounted commitment.routes before funding.routes');
  } else {
    warn('   funding.routes mount not found — add both manually');
  }
}

console.log('');
log('---');
if (DRY) warn('DRY RUN');
else {
  log('Phase 3b applied.');
  console.log('');
  log('new endpoints:');
  console.log('  POST /api/funding/commitments               (investor)');
  console.log('  GET  /api/funding/commitments/mine');
  console.log('  GET  /api/funding/requests/:id/commitments');
  console.log('  POST /api/funding/commitments/:id/cancel');
  console.log('');
  log('next: cd bravevest-api && npm run dev');
}
console.log('');