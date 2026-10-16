#!/usr/bin/env node
// seed-demos.js — BraveVest demo seed
// Run from bravevest-api/: `npm run db:seed`
// Flags:  --wipe   delete existing demo users + their data first

const { PrismaClient, UserRole, UserStatus, KycStatus, ProjectCategory, FundingRequestStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const WIPE = process.argv.includes('--wipe');

const DEMO_PASSWORD = 'DemoPass123!';

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

// Funding request templates (amounts in Decimal-compatible numbers)
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

    // Find demo users
    const existing = await prisma.user.findMany({
      where: { email: { in: demoEmails } },
      select: { id: true },
    });
    const ids = existing.map((u) => u.id);

    if (ids.length) {
      // Cascade should handle most, but be explicit for safety
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

    // If the user already existed, ensure their KYC row reflects the spec
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

    createdUsers.push({ spec, user });
    console.log(`\x1b[38;5;149m▸\x1b[0m user  ${spec.email.padEnd(42)} ${spec.role.padEnd(10)} kyc=${spec.kycStatus}`);
  }

  // ---------- upsert funding requests ----------
  // Only create if the table is empty of requests from this borrower
  const borrower = createdUsers.find((u) => u.spec.email === 'borrower@demo.bravevest.test')?.user;
  const admin = createdUsers.find((u) => u.spec.email === 'admin@demo.bravevest.test')?.user;

  if (borrower) {
    const existingCount = await prisma.fundingRequest.count({ where: { borrowerId: borrower.id } });
    if (existingCount > 0) {
      console.log(`\x1b[38;5;117m·\x1b[0m borrower already has ${existingCount} funding request(s) — skipping`);
    } else {
      console.log('');
      for (const spec of DEMO_REQUESTS) {
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
          reviewedById: spec.status === FundingRequestStatus.PUBLISHED ? admin?.id ?? null : null,
          reviewedAt: spec.status === FundingRequestStatus.PUBLISHED ? new Date() : null,
          publishedAt: spec.status === FundingRequestStatus.PUBLISHED ? new Date() : null,
          fundingDeadline:
            spec.status === FundingRequestStatus.PUBLISHED
              ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
              : null,
        };
        const req = await prisma.fundingRequest.create({ data });
        console.log(`\x1b[38;5;149m▸\x1b[0m req   ${req.reference}  ${spec.status.padEnd(12)} ${spec.title}`);
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