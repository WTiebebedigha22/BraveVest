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

module.exports = { ensureWallet, getWallet, getRecentLedger, credit, debit };
