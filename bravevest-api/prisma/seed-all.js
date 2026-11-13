#!/usr/bin/env node
/**
 * BraveVest — Full demo seed (projects + investors + investments + transactions)
 * Auto-detects real enum values from the generated Prisma client.
 */

const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const D = (n) => new Prisma.Decimal(n);
const DEMO_PASSWORD = 'DemoPass123!';

// ─── 1. Detect real enum values ─────────────────────────────
function detectEnumValues() {
  return new Promise(async (resolve) => {
    let testUser = await prisma.user.findFirst();
    if (!testUser) {
      console.log('⚠️  no user exists — cannot detect enum, using fallback');
      return resolve({ transactionType: null, transactionStatus: null });
    }

    const candidates = {
      types: ['DEPOSIT', 'INVESTMENT', 'PAYOUT', 'WITHDRAWAL', 'REFUND', 'TRANSFER',
              'DEPOSIT_FUNDING', 'INVESTMENT_CAPITAL', 'PAYOUT_INCOME', 'WITHDRAWAL_REQUEST',
              'FUNDING', 'REPAYMENT', 'INTEREST', 'DIVIDEND', 'RETURN'],
      statuses: ['COMPLETED', 'SUCCESS', 'SETTLED', 'PAID', 'PENDING', 'FAILED',
                 'SUCCESSFUL', 'CONFIRMED']
    };

    const validTypes = [];
    const validStatuses = [];

    for (const type of candidates.types) {
      try {
        await prisma.transaction.create({
          data: {
            reference: 'PROBE-' + type + '-' + Date.now(),
            userId: testUser.id,
            type: type,
            status: 'PENDING',
            amount: D(1),
            fee: D(0),
            netAmount: D(1),
            description: 'probe',
          },
        });
        validTypes.push(type);
        await prisma.transaction.deleteMany({ where: { reference: { startsWith: 'PROBE-' + type } } });
      } catch (e) {
        // ignore
      }
    }

    const useType = validTypes[0] || 'DEPOSIT';
    for (const status of candidates.statuses) {
      try {
        await prisma.transaction.create({
          data: {
            reference: 'PROBES-' + status + '-' + Date.now(),
            userId: testUser.id,
            type: useType,
            status: status,
            amount: D(1),
            fee: D(0),
            netAmount: D(1),
            description: 'probe',
          },
        });
        validStatuses.push(status);
        await prisma.transaction.deleteMany({ where: { reference: { startsWith: 'PROBES-' + status } } });
      } catch (e) {}
    }

    await prisma.transaction.deleteMany({ where: { reference: { startsWith: 'PROBE' } } });

    console.log('\n🔍 Detected enum values:');
    console.log('   TransactionType:   ', validTypes.length ? validTypes.join(', ') : '(none — check schema.prisma)');
    console.log('   TransactionStatus: ', validStatuses.length ? validStatuses.join(', ') : '(none)');

    resolve({
      transactionType: validTypes[0] || null,
      transactionStatus: validStatuses[0] || null,
      allTypes: validTypes,
      allStatuses: validStatuses,
    });
  });
}

// ─── 2. Projects ────────────────────────────────────────────
const PROJECTS = [
  {
    slug: 'lagos-solar-fund-ii',
    title: 'Lagos Solar Fund II',
    summary: 'A 40MW distributed solar portfolio across Lagos and Ogun states.',
    description: 'Senior-secured with 15% first-loss protection. Fixed-price EPC contract. Offtaker base spans 6 industrial customers.',
    category: 'ENERGY',
    targetAmount: 250000000,
    minInvestment: 50000,
    expectedReturnPct: 14.5,
    tenorMonths: 18,
    payoutFrequency: 'quarterly',
    riskLevel: 'A',
    status: 'OPEN',
    location: 'Lagos & Ogun',
    isFeatured: true,
  },
  {
    slug: 'abuja-real-estate-note',
    title: 'Abuja Real Estate Note',
    summary: "24-month note backed by 12 serviced plots in Abuja's Guzape district.",
    description: 'First-loss protection of 20%. Collateral coverage ratio of 1.8x. Buyback guarantee at month 20.',
    category: 'REAL_ESTATE',
    targetAmount: 180000000,
    minInvestment: 100000,
    expectedReturnPct: 12.0,
    tenorMonths: 24,
    payoutFrequency: 'quarterly',
    riskLevel: 'AA',
    status: 'OPEN',
    location: 'Abuja',
    isFeatured: true,
  },
  {
    slug: 'ogun-agri-cooperative',
    title: 'Ogun Agri Cooperative',
    summary: 'Working capital for cassava and maize cooperative.',
    description: 'Collateralized by warehouse receipts and crop insurance. Forward contracts with off-taker.',
    category: 'AGRICULTURE',
    targetAmount: 75000000,
    minInvestment: 25000,
    expectedReturnPct: 14.0,
    tenorMonths: 12,
    payoutFrequency: 'monthly',
    riskLevel: 'BBB',
    status: 'OPEN',
    location: 'Ogun',
  },
  {
    slug: 'sme-trade-finance',
    title: 'SME Trade Finance',
    summary: 'Short-duration 6-month facilities for FMCG importers.',
    description: 'Collateralized by inventory and receivables with 1.5x coverage. Diversified across 12 importers.',
    category: 'SME',
    targetAmount: 50000000,
    minInvestment: 5000,
    expectedReturnPct: 16.5,
    tenorMonths: 6,
    payoutFrequency: 'monthly',
    riskLevel: 'BB',
    status: 'OPEN',
    location: 'Lagos',
  },
  {
    slug: 'kano-agro-processing',
    title: 'Kano Agro Processing',
    summary: 'Expansion financing for tomato paste processing facility.',
    description: 'Collateralized by equipment and land. Off-take agreement with major FMCG distributor.',
    category: 'AGRICULTURE',
    targetAmount: 120000000,
    minInvestment: 10000,
    expectedReturnPct: 15.0,
    tenorMonths: 12,
    payoutFrequency: 'monthly',
    riskLevel: 'BBB',
    status: 'OPEN',
    location: 'Kano',
  },
  {
    slug: 'port-harcourt-logistics',
    title: 'Port Harcourt Logistics',
    summary: 'Asset-backed financing for fleet of 8 heavy-duty trucks.',
    description: 'Trucks operate Port Harcourt–Aba corridor. Long-term contracts with 2 oil service companies.',
    category: 'INFRASTRUCTURE',
    targetAmount: 95000000,
    minInvestment: 50000,
    expectedReturnPct: 17.5,
    tenorMonths: 18,
    payoutFrequency: 'quarterly',
    riskLevel: 'B',
    status: 'OPEN',
    location: 'Port Harcourt',
  },
  {
    slug: 'lekki-phase-1-reit',
    title: 'Lekki Phase 1 REIT',
    summary: 'Stabilized income-producing commercial property in Lekki Phase 1.',
    description: '5-year lease to tier-1 bank. Quarterly distributions. Institutional-grade tenant.',
    category: 'REAL_ESTATE',
    targetAmount: 350000000,
    minInvestment: 200000,
    expectedReturnPct: 13.5,
    tenorMonths: 24,
    payoutFrequency: 'quarterly',
    riskLevel: 'A',
    status: 'OPEN',
    location: 'Lekki, Lagos',
    isFeatured: true,
  },
  {
    slug: 'retail-sme-growth',
    title: 'Retail SME Growth',
    summary: 'Working capital for 20 retail SMEs across Lagos and Ibadan.',
    description: '9-month facilities. Collateralized by inventory and personal guarantees.',
    category: 'SME',
    targetAmount: 45000000,
    minInvestment: 5000,
    expectedReturnPct: 18.0,
    tenorMonths: 9,
    payoutFrequency: 'monthly',
    riskLevel: 'BB',
    status: 'OPEN',
    location: 'Lagos & Ibadan',
  },
  {
    slug: 'kaduna-solar-grid',
    title: 'Kaduna Solar Grid',
    summary: '25MW solar + storage project in Kaduna state.',
    description: '36-month tenor. Federal government guarantee on 70% of offtake.',
    category: 'ENERGY',
    targetAmount: 400000000,
    minInvestment: 25000,
    expectedReturnPct: 15.5,
    tenorMonths: 36,
    payoutFrequency: 'quarterly',
    riskLevel: 'A',
    status: 'OPEN',
    location: 'Kaduna',
    isFeatured: true,
  },
];

// ─── 3. Investors ───────────────────────────────────────────
const INVESTORS = [
  { email: 'tunde@demo.bravevest.test',  firstName: 'Tunde',  lastName: 'Adeyemi',   phone: '+2348012345001', kyc: 'APPROVED',     balance: 8500000 },
  { email: 'ngozi@demo.bravevest.test',  firstName: 'Ngozi',  lastName: 'Okonkwo',   phone: '+2348012345002', kyc: 'APPROVED',     balance: 2200000 },
  { email: 'chidi@demo.bravevest.test',  firstName: 'Chidi',  lastName: 'Nwosu',     phone: '+2348012345003', kyc: 'APPROVED',     balance: 12500000 },
  { email: 'aisha@demo.bravevest.test',  firstName: 'Aisha',  lastName: 'Bello',     phone: '+2348012345004', kyc: 'APPROVED',     balance: 450000 },
  { email: 'emeka@demo.bravevest.test',  firstName: 'Emeka',  lastName: 'Obi',       phone: '+2348012345005', kyc: 'UNDER_REVIEW', balance: 0 },
  { email: 'funke@demo.bravevest.test',  firstName: 'Funke',  lastName: 'Adeleke',   phone: '+2348012345006', kyc: 'APPROVED',     balance: 3100000 },
  { email: 'kola@demo.bravevest.test',   firstName: 'Kola',   lastName: 'Adebowale', phone: '+2348012345007', kyc: 'UNDER_REVIEW', balance: 0 },
  { email: 'zainab@demo.bravevest.test', firstName: 'Zainab', lastName: 'Musa',      phone: '+2348012345008', kyc: 'UNDER_REVIEW', balance: 0 },
];

// ─── 4. Investments ────────────────────────────────────────
const INVESTMENTS = [
  { investor: 'tunde@demo.bravevest.test', projectSlug: 'lagos-solar-fund-ii',   amount: 2500000, daysAgo: 90 },
  { investor: 'tunde@demo.bravevest.test', projectSlug: 'abuja-real-estate-note', amount: 500000,  daysAgo: 60 },
  { investor: 'tunde@demo.bravevest.test', projectSlug: 'sme-trade-finance',      amount: 100000,  daysAgo: 45 },
  { investor: 'tunde@demo.bravevest.test', projectSlug: 'lekki-phase-1-reit',     amount: 1200000, daysAgo: 30 },
  { investor: 'ngozi@demo.bravevest.test', projectSlug: 'abuja-real-estate-note', amount: 800000,  daysAgo: 120 },
  { investor: 'ngozi@demo.bravevest.test', projectSlug: 'ogun-agri-cooperative',  amount: 300000,  daysAgo: 75 },
  { investor: 'chidi@demo.bravevest.test', projectSlug: 'lekki-phase-1-reit',     amount: 5000000, daysAgo: 150 },
  { investor: 'chidi@demo.bravevest.test', projectSlug: 'lagos-solar-fund-ii',    amount: 3000000, daysAgo: 100 },
  { investor: 'chidi@demo.bravevest.test', projectSlug: 'kaduna-solar-grid',      amount: 2000000, daysAgo: 60 },
  { investor: 'aisha@demo.bravevest.test', projectSlug: 'sme-trade-finance',      amount: 50000,   daysAgo: 20 },
  { investor: 'aisha@demo.bravevest.test', projectSlug: 'retail-sme-growth',      amount: 25000,   daysAgo: 10 },
  { investor: 'funke@demo.bravevest.test', projectSlug: 'ogun-agri-cooperative',  amount: 500000,  daysAgo: 90 },
  { investor: 'funke@demo.bravevest.test', projectSlug: 'kano-agro-processing',   amount: 750000,  daysAgo: 60 },
  { investor: 'funke@demo.bravevest.test', projectSlug: 'sme-trade-finance',      amount: 150000,  daysAgo: 30 },
];

// ─── 5. Transactions ──
const TX_LABELS = {
  DEPOSIT:    'deposit',
  INVESTMENT: 'investment',
  PAYOUT:     'return',
  WITHDRAWAL: 'withdrawal',
  REFUND:     'refund',
};

const TX_SPECS = [
  { investor: 'tunde@demo.bravevest.test',  semantic: 'deposit',    amount: 8500000,  daysAgo: 95, description: 'Initial wallet funding' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'investment', amount: 2500000,  daysAgo: 90, description: 'Invested in Lagos Solar Fund II' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'investment', amount: 500000,   daysAgo: 60, description: 'Invested in Abuja Real Estate Note' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'return',     amount: 180000,   daysAgo: 45, description: 'Q1 payout — Lagos Solar' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'investment', amount: 100000,   daysAgo: 45, description: 'Invested in SME Trade Finance' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'investment', amount: 1200000,  daysAgo: 30, description: 'Invested in Lekki Phase 1 REIT' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'withdrawal', amount: 300000,   daysAgo: 20, description: 'Withdrawal to Providus Bank' },
  { investor: 'tunde@demo.bravevest.test',  semantic: 'return',     amount: 95000,    daysAgo: 10, description: 'Q2 payout — Abuja Real Estate' },
  { investor: 'ngozi@demo.bravevest.test',  semantic: 'deposit',    amount: 2500000,  daysAgo: 130, description: 'Bank transfer deposit' },
  { investor: 'ngozi@demo.bravevest.test',  semantic: 'investment', amount: 800000,   daysAgo: 120, description: 'Invested in Abuja Real Estate Note' },
  { investor: 'ngozi@demo.bravevest.test',  semantic: 'investment', amount: 300000,   daysAgo: 75,  description: 'Invested in Ogun Agri Cooperative' },
  { investor: 'ngozi@demo.bravevest.test',  semantic: 'return',     amount: 65000,    daysAgo: 40,  description: 'Q1 payout — Abuja Real Estate' },
  { investor: 'ngozi@demo.bravevest.test',  semantic: 'withdrawal', amount: 150000,   daysAgo: 15,  description: 'Withdrawal to GTBank' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'deposit',    amount: 13000000, daysAgo: 160, description: 'Wire transfer deposit' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'investment', amount: 5000000,  daysAgo: 150, description: 'Invested in Lekki Phase 1 REIT' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'investment', amount: 3000000,  daysAgo: 100, description: 'Invested in Lagos Solar Fund II' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'return',     amount: 580000,   daysAgo: 60,  description: 'Q1 payout — Lekki REIT' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'investment', amount: 2000000,  daysAgo: 60,  description: 'Invested in Kaduna Solar Grid' },
  { investor: 'chidi@demo.bravevest.test',  semantic: 'return',     amount: 310000,   daysAgo: 20,  description: 'Q1 payout — Lagos Solar' },
  { investor: 'aisha@demo.bravevest.test',  semantic: 'deposit',    amount: 500000,   daysAgo: 25,  description: 'Bank transfer deposit' },
  { investor: 'aisha@demo.bravevest.test',  semantic: 'investment', amount: 50000,    daysAgo: 20,  description: 'Invested in SME Trade Finance' },
  { investor: 'aisha@demo.bravevest.test',  semantic: 'investment', amount: 25000,    daysAgo: 10,  description: 'Invested in Retail SME Growth' },
  { investor: 'aisha@demo.bravevest.test',  semantic: 'return',     amount: 2500,     daysAgo: 5,   description: 'First payout — SME Trade' },
  { investor: 'funke@demo.bravevest.test',  semantic: 'deposit',    amount: 3500000,  daysAgo: 100, description: 'Bank transfer deposit' },
  { investor: 'funke@demo.bravevest.test',  semantic: 'investment', amount: 500000,   daysAgo: 90,  description: 'Invested in Ogun Agri Cooperative' },
  { investor: 'funke@demo.bravevest.test',  semantic: 'investment', amount: 750000,   daysAgo: 60,  description: 'Invested in Kano Agro Processing' },
  { investor: 'funke@demo.bravevest.test',  semantic: 'return',     amount: 47000,    daysAgo: 30,  description: 'Q1 payout — Ogun Agri' },
  { investor: 'funke@demo.bravevest.test',  semantic: 'investment', amount: 150000,   daysAgo: 30,  description: 'Invested in SME Trade Finance' },
];

// ─── Helpers ───────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function ref() {
  return 'DEMO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function mapSemantic(semantic, detected) {
  if (!detected || detected.length === 0) return null;
  const upper = semantic.toUpperCase();
  const exact = detected.find(d => d === upper);
  if (exact) return exact;
  const contains = detected.find(d => d.includes(upper));
  if (contains) return contains;
  return detected[0];
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Full BraveVest demo seed\n');

  const enums = await detectEnumValues();

  if (!enums.allTypes || enums.allTypes.length === 0) {
    console.log('\n❌ Could not detect any valid TransactionType values.');
    console.log('   Skipping transactions — investors + projects will still be created.\n');
  }

  const TX_TYPE_MAP = {};
  for (const [label, semantic] of Object.entries(TX_LABELS)) {
    TX_TYPE_MAP[semantic] = mapSemantic(semantic, enums.allTypes);
  }
  console.log('\n📋 Transaction semantic → enum mapping:');
  for (const [k, v] of Object.entries(TX_TYPE_MAP)) {
    console.log(`   ${k.padEnd(12)} → ${v || '(none)'}`);
  }

  // ── 1. Projects ──
  console.log('\n·  seeding projects…');
  const adminEmail = 'admin@demo.bravevest.test';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: 'Ada',
        lastName: 'Admin',
        roles: ['ADMIN'],
        status: 'ACTIVE',
        emailVerified: new Date(),
        passwordHash: hash,
      },
    });
    console.log(`   ✅ created admin user: ${adminEmail}`);
  }

  let projectCreated = 0;
  for (const p of PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      if (existing.payoutFrequency !== p.payoutFrequency) {
        await prisma.project.update({
          where: { slug: p.slug },
          data: { payoutFrequency: p.payoutFrequency },
        });
      }
      continue;
    }
    await prisma.project.create({
      data: {
        ...p,
        targetAmount: D(p.targetAmount),
        minInvestment: D(p.minInvestment),
        expectedReturnPct: D(p.expectedReturnPct),
        createdById: admin.id,
      },
    });
    projectCreated++;
    console.log(`   ✅ ${p.slug}${p.payoutFrequency ? ' (' + p.payoutFrequency + ')' : ''}`);
  }
  console.log(`   ${projectCreated} created, ${PROJECTS.length - projectCreated} already existed`);

  // ── 2. Investors ──
  console.log('\n·  seeding investors…');
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const created = {};

  for (const inv of INVESTORS) {
    const user = await prisma.user.upsert({
      where: { email: inv.email },
      update: {
        firstName: inv.firstName,
        lastName: inv.lastName,
        phone: inv.phone,
        roles: ['INVESTOR'],
        status: 'ACTIVE',
        passwordHash: hash,
      },
      create: {
        email: inv.email,
        firstName: inv.firstName,
        lastName: inv.lastName,
        phone: inv.phone,
        roles: ['INVESTOR'],
        status: 'ACTIVE',
        emailVerified: new Date(),
        passwordHash: hash,
      },
    });
    created[inv.email] = user;

    const kyc = await prisma.kycProfile.findUnique({ where: { userId: user.id } });
    if (!kyc) {
      await prisma.kycProfile.create({
        data: {
          userId: user.id,
          status: inv.kyc,
          submittedAt: inv.kyc !== 'NOT_STARTED' ? daysAgo(5) : null,
          reviewedAt: inv.kyc === 'APPROVED' ? daysAgo(3) : null,
        },
      });
    } else if (kyc.status !== inv.kyc) {
      await prisma.kycProfile.update({ where: { userId: user.id }, data: { status: inv.kyc } });
    }

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: { balance: D(inv.balance) },
      create: { userId: user.id, balance: D(inv.balance) },
    });

    if (inv.kyc === 'APPROVED') {
      await prisma.investorStreak.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          currentStreak: Math.floor(Math.random() * 8) + 1,
          longestStreak: Math.floor(Math.random() * 20) + 8,
          lastActivityAt: daysAgo(1),
        },
      }).catch(() => {});
    }

    console.log(`   ✅ ${inv.email.padEnd(38)} kyc=${inv.kyc} balance=₦${inv.balance.toLocaleString()}`);
  }

  // ── 3. Investments ──
  console.log('\n·  seeding investments…');
  let invCreated = 0;
  const projCache = {};
  for (const p of PROJECTS) {
    projCache[p.slug] = await prisma.project.findUnique({ where: { slug: p.slug } });
  }

  for (const spec of INVESTMENTS) {
    const user = created[spec.investor];
    if (!user) continue;
    const project = projCache[spec.projectSlug];
    if (!project) {
      console.log(`   ⚠️  ${spec.projectSlug} missing`);
      continue;
    }
    const existing = await prisma.investment.findFirst({
      where: { userId: user.id, projectId: project.id },
    });
    if (existing) continue;

    const rate = Number(project.expectedReturnPct || 0);
    const tenor = Number(project.tenorMonths || 12);
    const expected = Math.round(spec.amount * (1 + (rate / 100) * (tenor / 12)));
    const investedAt = daysAgo(spec.daysAgo);
    const maturesAt = new Date(investedAt);
    maturesAt.setMonth(maturesAt.getMonth() + tenor);

    await prisma.investment.create({
      data: {
        userId: user.id,
        projectId: project.id,
        amount: D(spec.amount),
        expectedReturn: D(expected),
        actualReturn: D(0),
        status: 'ACTIVE',
        units: 1,
        investedAt,
        maturesAt,
        createdAt: investedAt,
      },
    });
    invCreated++;
  }
  console.log(`   ${invCreated} created`);

  // ── 4. Transactions ──
  if (enums.allTypes && enums.allTypes.length > 0) {
    console.log('\n·  seeding transactions…');
    let txCreated = 0, txSkipped = 0, txFailed = 0;

    for (const spec of TX_SPECS) {
      const user = created[spec.investor];
      if (!user) continue;

      const typeValue = TX_TYPE_MAP[spec.semantic];
      if (!typeValue) { txFailed++; continue; }

      const existing = await prisma.transaction.findFirst({
        where: {
          userId: user.id,
          type: typeValue,
          amount: D(spec.amount),
          description: spec.description,
        },
      });
      if (existing) { txSkipped++; continue; }

      try {
        await prisma.transaction.create({
          data: {
            reference: ref(),
            userId: user.id,
            type: typeValue,
            status: 'SUCCESS',
            amount: D(spec.amount),
            fee: D(0),
            netAmount: D(spec.amount),
            description: spec.description,
            paidAt: daysAgo(spec.daysAgo),
            createdAt: daysAgo(spec.daysAgo),
          },
        });
        txCreated++;
      } catch (e) {
        txFailed++;
        if (txFailed <= 5) {
          console.log(`   ❌ ${spec.semantic}: ${e.message.slice(0, 200)}`);
        }
      }
    }
    console.log(`   ${txCreated} created, ${txSkipped} skipped, ${txFailed} failed`);
  }

  // ── 5. Wallet + Ledger sync ──
  console.log('\n·  syncing wallets + ledgers…');
  for (const inv of INVESTORS) {
    const user = created[inv.email];
    if (!user) continue;

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, balance: D(0), currency: 'NGN' },
    });

    // Credits
    const credits = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
        status: 'SUCCESS',
        type: { in: ['DEPOSIT', 'RETURN', 'REFUND'] },
      },
      _sum: { netAmount: true },
    });

    // Debits
    const debits = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
        status: 'SUCCESS',
        type: { in: ['INVESTMENT', 'WITHDRAWAL', 'FEE'] },
      },
      _sum: { netAmount: true },
    });

    const balance = Number(credits._sum.netAmount ?? 0) - Number(debits._sum.netAmount ?? 0);
    await prisma.wallet.update({ where: { userId: user.id }, data: { balance: D(balance) } });

    const txs = await prisma.transaction.findMany({
      where: { userId: user.id, status: 'SUCCESS' },
      orderBy: { createdAt: 'asc' },
    });

    let running = 0;
    for (const tx of txs) {
      const isCredit = ['DEPOSIT', 'RETURN', 'REFUND'].includes(tx.type);
      const direction = isCredit ? 'credit' : 'debit';
      running += Number(isCredit ? tx.netAmount : -tx.netAmount);

      await prisma.ledgerEntry.upsert({
        where: { reference: `LEDGER-${tx.reference}` },
        update: {},
        create: {
          reference: `LEDGER-${tx.reference}`,
          userId: user.id,
          type: tx.type.toLowerCase(),
          direction,
          amount: tx.netAmount,
          currency: tx.currency ?? 'NGN',
          balanceAfter: D(running),
          description: tx.description,
          transactionId: tx.id,
          createdAt: tx.createdAt,
        },
      });
    }

    console.log(`   💰 ${inv.email.padEnd(38)} balance=₦${balance.toLocaleString()} ledger=${txs.length}`);
  }

  // ── 6. Summary ──
  console.log('\n──────────────────────────────');
  console.log('Demo password for ALL: DemoPass123!\n');
  console.log('Investor accounts:');
  INVESTORS.filter(i => i.kyc === 'APPROVED').forEach(i => {
    console.log(`  ${i.email.padEnd(40)} ${i.firstName} ${i.lastName}`);
  });
  console.log('\nPending KYC:');
  INVESTORS.filter(i => i.kyc === 'UNDER_REVIEW').forEach(i => {
    console.log(`  ${i.email.padEnd(40)} ${i.firstName} ${i.lastName}`);
  });
  console.log('\nAdmin:');
  console.log(`  ${adminEmail.padEnd(40)} Ada Admin`);
  console.log('');
}

main()
  .catch(e => { console.error('❌ seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());