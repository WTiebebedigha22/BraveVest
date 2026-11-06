#!/usr/bin/env node
// seed-demos.js — BraveVest demo seed
// Run from bravevest-api/: `npm run db:seed`
// Flags:  --wipe   delete existing demo users + their data first

const {
  PrismaClient,
  UserRole,
  UserStatus,
  KycStatus,
  ProjectCategory,
  ProjectStatus,
  FundingRequestStatus,
} = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const WIPE = process.argv.includes('--wipe');

const DEMO_PASSWORD = 'DemoPass123!';

// ═══════════════════════════════════════════════════════════════
// Users
// ═══════════════════════════════════════════════════════════════
const DEMO_USERS = [
  {
    email: 'admin@demo.bravevest.test',
    firstName: 'Ada',
    lastName: 'Admin',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    kycStatus: KycStatus.APPROVED,
  },
  {
    email: 'investor@demo.bravevest.test',
    firstName: 'Tunde',
    lastName: 'Investor',
    role: UserRole.INVESTOR,
    status: UserStatus.ACTIVE,
    kycStatus: KycStatus.APPROVED,
  },
  {
    email: 'investor.pending@demo.bravevest.test',
    firstName: 'Ngozi',
    lastName: 'Pending',
    role: UserRole.INVESTOR,
    status: UserStatus.ACTIVE,
    kycStatus: KycStatus.UNDER_REVIEW,
  },
  {
    email: 'investor.new@demo.bravevest.test',
    firstName: 'Chidi',
    lastName: 'New',
    role: UserRole.INVESTOR,
    status: UserStatus.PENDING_VERIFICATION,
    kycStatus: KycStatus.NOT_STARTED,
  },
  {
    email: 'borrower@demo.bravevest.test',
    firstName: 'Bola',
    lastName: 'Borrower',
    role: UserRole.BORROWER,
    status: UserStatus.ACTIVE,
    kycStatus: KycStatus.APPROVED,
  },
];

// ═══════════════════════════════════════════════════════════════
// Projects — matches your schema exactly
// Required: slug, title, summary, description, category,
//           targetAmount, minInvestment, expectedReturnPct,
//           tenorMonths, createdById
// ═══════════════════════════════════════════════════════════════
const DEMO_PROJECTS = [
  {
    slug: 'lagos-solar-fund-ii',
    title: 'Lagos Solar Fund II',
    summary: 'A 40MW distributed solar portfolio across Lagos and Ogun states.',
    description:
      'Senior-secured with 15% first-loss protection held by the sponsor. ' +
      'Fixed-price EPC contract with a tier-1 contractor. Offtaker base spans 6 ' +
      'industrial customers, none exceeding 30% of capacity.',
    category: ProjectCategory.ENERGY,
    targetAmount: 250000000,
    minInvestment: 50000,
    expectedReturnPct: 14.5,
    tenorMonths: 18,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'A',
    status: ProjectStatus.OPEN,
    location: 'Lagos & Ogun',
    isFeatured: true,
    closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'abuja-real-estate-note',
    title: 'Abuja Real Estate Note',
    summary: 'A 24-month note backed by 12 serviced plots in Abuja\'s Guzape district.',
    description:
      'First-loss protection of 20% held by the sponsor. Collateral coverage ' +
      'ratio of 1.8x. Borrower committed to a buyback guarantee if plots are ' +
      'not sold by month 20. If the borrower defaults, the trustee sells the ' +
      'underlying land at fair value.',
    category: ProjectCategory.REAL_ESTATE,
    targetAmount: 180000000,
    minInvestment: 100000,
    expectedReturnPct: 12.0,
    tenorMonths: 24,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'AA',
    status: ProjectStatus.OPEN,
    location: 'Abuja',
    isFeatured: true,
    closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'ogun-agri-cooperative',
    title: 'Ogun Agri Cooperative',
    summary: 'Working capital for a cassava and maize cooperative in Ogun State.',
    description:
      'Collateralized by warehouse receipts and crop insurance from a NAIC-backed ' +
      'underwriter. Commodity price risk hedged via forward contracts with the ' +
      'cooperative\'s off-taker. Concentration risk (single crop) mitigated by ' +
      'diversified planting.',
    category: ProjectCategory.AGRICULTURE,
    targetAmount: 75000000,
    minInvestment: 25000,
    expectedReturnPct: 14.0,
    tenorMonths: 12,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'BBB',
    status: ProjectStatus.OPEN,
    location: 'Ogun',
    closesAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'sme-trade-finance',
    title: 'SME Trade Finance',
    summary: 'Short-duration (6-month) facilities for importers of FMCG goods.',
    description:
      'Collateralized by inventory and receivables with 1.5x coverage. Rolling ' +
      'facility with 30-day revolving periods. Diversified across 12 importers. ' +
      'Fast cycle times, short duration, high turnover.',
    category: ProjectCategory.SME,
    targetAmount: 50000000,
    minInvestment: 5000,
    expectedReturnPct: 16.5,
    tenorMonths: 6,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'BB',
    status: ProjectStatus.OPEN,
    location: 'Lagos',
    closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'kano-agro-processing',
    title: 'Kano Agro Processing',
    summary: 'Expansion financing for a tomato paste processing facility in Kano.',
    description:
      'Collateralized by equipment and land. Off-take agreement with a major ' +
      'FMCG distributor covering 60% of capacity. Processing capacity expanding ' +
      'from 40 tonnes/day to 120 tonnes/day.',
    category: ProjectCategory.AGRICULTURE,
    targetAmount: 120000000,
    minInvestment: 10000,
    expectedReturnPct: 15.0,
    tenorMonths: 12,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'BBB',
    status: ProjectStatus.OPEN,
    location: 'Kano',
    closesAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'port-harcourt-logistics',
    title: 'Port Harcourt Logistics',
    summary: 'Asset-backed financing for a fleet of 8 heavy-duty trucks.',
    description:
      'Trucks operate on the Port Harcourt–Aba corridor with long-term logistics ' +
      'contracts with 2 oil service companies. Collateralized by trucks with ' +
      'insurance cover. High turnover on short hauls.',
    category: ProjectCategory.INFRASTRUCTURE,
    targetAmount: 95000000,
    minInvestment: 50000,
    expectedReturnPct: 17.5,
    tenorMonths: 18,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'B',
    status: ProjectStatus.OPEN,
    location: 'Port Harcourt',
    closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'lekki-phase-1-reit',
    title: 'Lekki Phase 1 REIT',
    summary: 'A stabilized income-producing commercial property in Lekki Phase 1.',
    description:
      '5-year lease to a tier-1 bank as anchor tenant. Distributions paid ' +
      'quarterly. Minimum 24-month lock with quarterly distributions. ' +
      'Institutional-grade tenant covenant.',
    category: ProjectCategory.REAL_ESTATE,
    targetAmount: 350000000,
    minInvestment: 200000,
    expectedReturnPct: 13.5,
    tenorMonths: 24,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'A',
    status: ProjectStatus.OPEN,
    location: 'Lekki, Lagos',
    isFeatured: true,
    closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'retail-sme-growth',
    title: 'Retail SME Growth',
    summary: 'Working capital for 20 retail SMEs across Lagos and Ibadan.',
    description:
      'Each facility is 9-month duration, collateralized by inventory and ' +
      'personal guarantees. Portfolio approach spreads single-borrower risk ' +
      'across 20 businesses.',
    category: ProjectCategory.SME,
    targetAmount: 45000000,
    minInvestment: 5000,
    expectedReturnPct: 18.0,
    tenorMonths: 9,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'BB',
    status: ProjectStatus.OPEN,
    location: 'Lagos & Ibadan',
    closesAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'kaduna-solar-grid',
    title: 'Kaduna Solar Grid',
    summary: 'A 25MW solar + storage project in Kaduna state.',
    description:
      '36-month tenor with quarterly distributions. Secured by project assets ' +
      'and a power purchase agreement with the state utility. Federal government ' +
      'guarantee on 70% of offtake.',
    category: ProjectCategory.ENERGY,
    targetAmount: 400000000,
    minInvestment: 25000,
    expectedReturnPct: 15.5,
    tenorMonths: 36,
    payoutFrequency: 'QUARTERLY',
    riskLevel: 'A',
    status: ProjectStatus.OPEN,
    location: 'Kaduna',
    isFeatured: true,
    closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
];

// ═══════════════════════════════════════════════════════════════
// Funding requests
// ═══════════════════════════════════════════════════════════════
const DEMO_REQUESTS = [
  {
    borrowerEmail: 'borrower@demo.bravevest.test',
    title: 'Lagos Cold Storage Expansion',
    summary: 'Working capital to add two refrigerated units for produce distribution.',
    description:
      'We operate a cold-chain distribution business serving markets in Lagos and Ibadan. ' +
      'Funding will be used to add two refrigerated storage units, increasing capacity by 40%. ' +
      'Repayment is structured monthly over 18 months from operating cash flow.',
    category: ProjectCategory.SME,
    amountRequested: 4500000,
    minCommitment: 50000,
    maxCommitment: 2000000,
    proposedReturnPct: 16.5,
    durationMonths: 18,
    repaymentFrequency: 'monthly',
    status: FundingRequestStatus.PUBLISHED,
  },
  {
    borrowerEmail: 'borrower@demo.bravevest.test',
    title: 'Cassava Processing Equipment',
    summary: 'Equipment financing for a smallholder co-operative in Ogun State.',
    description:
      'Co-operative of 42 farmers processing cassava into garri and starch. ' +
      'Funding covers a mechanized grater and press, cutting processing time from 3 days to 6 hours. ' +
      'Repayment is quarterly, aligned with harvest cycles.',
    category: ProjectCategory.AGRICULTURE,
    amountRequested: 2800000,
    minCommitment: 25000,
    maxCommitment: 1000000,
    proposedReturnPct: 14.0,
    durationMonths: 12,
    repaymentFrequency: 'quarterly',
    status: FundingRequestStatus.PUBLISHED,
  },
  {
    borrowerEmail: 'borrower@demo.bravevest.test',
    title: 'Rooftop Solar Installation — Ikeja',
    summary: 'Draft request. Not yet submitted for review.',
    description: 'Residential solar installation for a 4-bedroom property in Ikeja GRA.',
    category: ProjectCategory.ENERGY,
    amountRequested: 1800000,
    minCommitment: 100000,
    proposedReturnPct: 12.0,
    durationMonths: 24,
    repaymentFrequency: 'monthly',
    status: FundingRequestStatus.DRAFT,
  },
];

function ref(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function main() {
  console.log('');
  console.log('\x1b[38;5;149m▸\x1b[0m BraveVest demo seed');
  console.log(`  mode: ${WIPE ? 'WIPE + recreate' : 'upsert'}`);
  console.log('');

  // ---------- optional wipe ----------
  if (WIPE) {
    console.log('\x1b[38;5;214m!\x1b[0m  wiping demo data…');
    const demoEmails = DEMO_USERS.map((u) => u.email);

    const existing = await prisma.user.findMany({
      where: { email: { in: demoEmails } },
      select: { id: true },
    });
    const ids = existing.map((u) => u.id);

    if (ids.length) {
      // Delete demo projects created by demo admin
      const demoAdmin = existing.find((u) => u.email === 'admin@demo.bravevest.test');
      if (demoAdmin) {
        await prisma.investment.deleteMany({
          where: { project: { createdById: demoAdmin.id } },
        });
        await prisma.project.deleteMany({ where: { createdById: demoAdmin.id } });
      }

      await prisma.fundingRequestDocument.deleteMany({
        where: { OR: [{ uploadedById: { in: ids } }, { request: { borrowerId: { in: ids } } }] },
      });
      await prisma.fundingRequest.deleteMany({ where: { borrowerId: { in: ids } } });
      await prisma.auditLog.deleteMany({ where: { userId: { in: ids } } });
      await prisma.document.deleteMany({ where: { userId: { in: ids } } });
      await prisma.kycProfile.deleteMany({ where: { userId: { in: ids } } });
      await prisma.transaction.deleteMany({ where: { userId: { in: ids } } });
      await prisma.investment.deleteMany({ where: { userId: { in: ids } } });
      await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
      console.log(`   removed ${ids.length} demo user(s) and their data`);
    } else {
      console.log('   no demo users found');
    }
    console.log('');
  }

  // ---------- hash password once ----------
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------- upsert users ----------
  const createdUsers = [];
  for (const spec of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: spec.email },
      update: {
        firstName: spec.firstName,
        lastName: spec.lastName,
        role: spec.role,
        status: spec.status,
        passwordHash,
      },
      create: {
        email: spec.email,
        firstName: spec.firstName,
        lastName: spec.lastName,
        role: spec.role,
        status: spec.status,
        emailVerified: spec.status === UserStatus.ACTIVE ? new Date() : null,
        passwordHash,
        kyc: {
          create: {
            status: spec.kycStatus,
            submittedAt: spec.kycStatus !== KycStatus.NOT_STARTED ? new Date() : null,
            reviewedAt: spec.kycStatus === KycStatus.APPROVED ? new Date() : null,
          },
        },
      },
    });

    const existingKyc = await prisma.kycProfile.findUnique({ where: { userId: user.id } });
    if (!existingKyc) {
      await prisma.kycProfile.create({
        data: {
          userId: user.id,
          status: spec.kycStatus,
          submittedAt: spec.kycStatus !== KycStatus.NOT_STARTED ? new Date() : null,
          reviewedAt: spec.kycStatus === KycStatus.APPROVED ? new Date() : null,
        },
      });
    } else if (existingKyc.status !== spec.kycStatus) {
      await prisma.kycProfile.update({
        where: { userId: user.id },
        data: { status: spec.kycStatus },
      });
    }

    // Ensure wallet exists with a healthy balance so investing works
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: spec.role === UserRole.INVESTOR ? 5000000 : 0,
      },
    });

    createdUsers.push({ spec, user });
    console.log(
      `\x1b[38;5;149m▸\x1b[0m user  ${spec.email.padEnd(42)} ${spec.role.padEnd(10)} kyc=${spec.kycStatus}`
    );
  }

  // ---------- upsert projects ----------
  const admin = createdUsers.find((u) => u.spec.email === 'admin@demo.bravevest.test')?.user;

  if (!admin) {
    console.log('\x1b[38;5;203m✗\x1b[0m no admin user — cannot create projects');
    return;
  }

  console.log('');
  console.log('\x1b[38;5;117m·\x1b[0m creating demo projects…');

  let projectsCreated = 0;
  let projectsSkipped = 0;

  for (const spec of DEMO_PROJECTS) {
    try {
      const existing = await prisma.project.findUnique({ where: { slug: spec.slug } });
      if (existing) {
        projectsSkipped++;
        continue;
      }

      await prisma.project.create({
        data: {
          ...spec,
          createdById: admin.id,
        },
      });
      projectsCreated++;
      console.log(
        `\x1b[38;5;149m▸\x1b[0m proj  ${spec.slug.padEnd(35)} ${spec.category.padEnd(15)} ${spec.expectedReturnPct}%`
      );
    } catch (err) {
      console.log(
        `\x1b[38;5;203m✗\x1b[0m ${spec.slug} — ${err.message.slice(0, 150)}`
      );
    }
  }

  if (projectsSkipped > 0) {
    console.log(`   (${projectsSkipped} project(s) already existed)`);
  }

  // ---------- upsert funding requests ----------
  const borrower = createdUsers.find(
    (u) => u.spec.email === 'borrower@demo.bravevest.test'
  )?.user;

  if (borrower) {
    const existingCount = await prisma.fundingRequest.count({
      where: { borrowerId: borrower.id },
    });

    if (existingCount > 0) {
      console.log('');
      console.log(
        `\x1b[38;5;117m·\x1b[0m borrower already has ${existingCount} funding request(s) — skipping`
      );
    } else {
      console.log('');
      for (const spec of DEMO_REQUESTS) {
        try {
          const data = {
            reference: ref('FR'),
            borrowerId: borrower.id,
            title: spec.title,
            summary: spec.summary,
            description: spec.description,
            category: spec.category,
            currency: 'NGN',
            amountRequested: spec.amountRequested,
            amountFunded: 0,
            minCommitment: spec.minCommitment ?? null,
            maxCommitment: spec.maxCommitment ?? null,
            proposedReturnPct: spec.proposedReturnPct ?? null,
            durationMonths: spec.durationMonths ?? null,
            repaymentFrequency: spec.repaymentFrequency ?? null,
            status: spec.status,
            reviewedById:
              spec.status === FundingRequestStatus.PUBLISHED ? admin?.id ?? null : null,
            reviewedAt:
              spec.status === FundingRequestStatus.PUBLISHED ? new Date() : null,
            publishedAt:
              spec.status === FundingRequestStatus.PUBLISHED ? new Date() : null,
            fundingDeadline:
              spec.status === FundingRequestStatus.PUBLISHED
                ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                : null,
          };
          const req = await prisma.fundingRequest.create({ data });
          console.log(
            `\x1b[38;5;149m▸\x1b[0m req   ${req.reference}  ${spec.status.padEnd(12)} ${spec.title}`
          );
        } catch (err) {
          console.log(
            `\x1b[38;5;203m✗\x1b[0m funding request "${spec.title}" — ${err.message.slice(0, 150)}`
          );
        }
      }
    }
  }

  // ---------- summary ----------
  console.log('');
  console.log('\x1b[38;5;149m▸\x1b[0m done');
  console.log('');
  console.log(`  password for all demo accounts:  ${DEMO_PASSWORD}`);
  console.log('');
  console.log('  accounts:');
  for (const u of DEMO_USERS) {
    console.log(`    ${u.email.padEnd(42)} ${u.role}`);
  }
  console.log('');
  console.log(`  projects:   ${projectsCreated} created, ${projectsSkipped} skipped`);
  console.log('');
  console.log('  re-run with --wipe to reset demo data:');
  console.log('    npm run db:wipe');
  console.log('');
}

main()
  .catch((e) => {
    console.error('');
    console.error('\x1b[38;5;203m✗\x1b[0m seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });