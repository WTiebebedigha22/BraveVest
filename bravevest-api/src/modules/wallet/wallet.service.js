const { prisma } = require('../../config/database');

async function ensureWallet(userId) {
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId } });
  }
  return wallet;
}

async function getWallet(userId) {
  return ensureWallet(userId);
}

async function getRecentLedger(userId, limit = 30) {
  return prisma.ledgerEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// Credit the wallet (adds balance). Called from the deposit webhook.
async function credit(userId, amount, { type, description, reference, transactionId } = {}) {
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) throw new Error('Invalid credit amount');

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.upsert({
      where: { userId },
      create: { userId, balance: amt },
      update: { balance: { increment: amt } },
    });

    const ref = reference || 'CR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const entry = await tx.ledgerEntry.create({
      data: {
        reference: ref,
        userId,
        type: type || 'deposit',
        direction: 'credit',
        amount: amt,
        balanceAfter: wallet.balance,
        description: description || 'Wallet credit',
        transactionId,
      },
    });

    return { wallet, entry };
  });
}

// Debit the wallet (subtracts balance). Called from withdrawal / commitment.
async function debit(userId, amount, { type, description, reference, transactionId, commitmentId } = {}) {
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) throw new Error('Invalid debit amount');

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.balance) < amt) throw new Error('Insufficient balance');

    const updated = await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amt } },
    });

    const ref = reference || 'DB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const entry = await tx.ledgerEntry.create({
      data: {
        reference: ref,
        userId,
        type: type || 'withdrawal',
        direction: 'debit',
        amount: amt,
        balanceAfter: updated.balance,
        description: description || 'Wallet debit',
        transactionId,
        commitmentId,
      },
    });

    return { wallet: updated, entry };
  });
}



/**
 * Credit interest earnings to a user's wallet.
 * Creates a RETURN transaction, a LedgerEntry, updates wallet balance,
 * and creates a notification. Idempotent on reference.
 */
async function creditInterest({ userId, amount, source, reference, description }) {
  const numAmount = Number(amount);
  if (!(numAmount > 0)) throw new Error('Amount must be greater than 0');

  const existing = await prisma.transaction.findUnique({ where: { reference } });
  if (existing) return existing;

  const wallet = await prisma.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 0, currency: 'NGN' },
  });

  return await prisma.$transaction(async (tx) => {
    const txn = await tx.transaction.create({
      data: {
        reference,
        userId,
        type: 'RETURN',
        status: 'SUCCESS',
        amount: numAmount,
        fee: 0,
        netAmount: numAmount,
        description: description || `Interest from ${source || 'investment'}`,
        paidAt: new Date(),
      },
    });

    const newBalance = Number(wallet.balance) + numAmount;
    await tx.wallet.update({
      where: { userId },
      data: { balance: newBalance },
    });

    await tx.ledgerEntry.create({
      data: {
        reference: `LEDGER-${reference}`,
        userId,
        type: 'payout',
        direction: 'credit',
        amount: numAmount,
        currency: 'NGN',
        balanceAfter: newBalance,
        description: description || 'Interest credit',
        transactionId: txn.id,
      },
    });

    try {
      await tx.notification.create({
        data: {
          userId,
          type: 'INTEREST_CREDITED',
          title: 'Interest earned',
          message: `₦${numAmount.toLocaleString()} interest has been credited to your wallet.`,
          metadata: { transactionId: txn.id, source },
        },
      });
    } catch (e) { /* notifications may not be enabled */ }

    return txn;
  });
}


module.exports = { ensureWallet, getWallet, getRecentLedger, credit, debit, creditInterest };
