const { prisma } = require('../../config/database');

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
      throw new CommitError('NOT_OPEN', `Request is ${req.status}, not accepting commitments`);
    }
    if (req.fundingDeadline && req.fundingDeadline < new Date()) {
      throw new CommitError('DEADLINE_PASSED', 'Funding deadline has passed');
    }

    const amt = Number(amount);
    if (amt <= 0) throw new CommitError('INVALID_AMOUNT', 'Amount must be positive');
    if (req.minCommitment != null && amt < Number(req.minCommitment)) {
      throw new CommitError('BELOW_MIN', `Minimum commitment is ${req.minCommitment}`);
    }
    if (req.maxCommitment != null && amt > Number(req.maxCommitment)) {
      throw new CommitError('ABOVE_MAX', `Maximum commitment is ${req.maxCommitment}`);
    }

    const alreadyFunded = Number(req.amountFunded);
    const remaining = Number(req.amountRequested) - alreadyFunded;
    if (amt > remaining) {
      throw new CommitError('OVERFUND', `Only ${remaining} remains to be funded`);
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
    if (c.status !== 'CONFIRMED') throw new CommitError('INVALID_STATE', `Cannot cancel from ${c.status}`);

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
