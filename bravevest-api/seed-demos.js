// node seed-demos.js       — seed
// node seed-demos.js --wipe — remove all demo data
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isWipe = process.argv.includes('--wipe');

const PASSWORD = 'DemoPass123!';
const DOMAIN = 'demo.bravevest.test';

const USERS = [
  { email: 'admin@' + DOMAIN, role: 'ADMIN', firstName: 'Brave', lastName: 'Admin', phone: '+2348011110001', kyc: 'APPROVED' },
  { email: 'investor@' + DOMAIN, role: 'INVESTOR', firstName: 'Uko', lastName: 'Ekpe', phone: '+2348011110002', kyc: 'APPROVED' },
  { email: 'investor.pending@' + DOMAIN, role: 'INVESTOR', firstName: 'Amara', lastName: 'Okafor', phone: '+2348011110003', kyc: 'UNDER_REVIEW' },
  { email: 'investor.rejected@' + DOMAIN, role: 'INVESTOR', firstName: 'Tunde', lastName: 'Bello', phone: '+2348011110004', kyc: 'REJECTED' },
  { email: 'investor.new@' + DOMAIN, role: 'INVESTOR', firstName: 'Chioma', lastName: 'Adeyemi', phone: '+2348011110005', kyc: 'NOT_STARTED' },
  { email: 'investor.diaspora@' + DOMAIN, role: 'INVESTOR', firstName: 'Kelechi', lastName: 'Nwosu', phone: '+447700900111', kyc: 'APPROVED' },
];

const PROJECTS = [
  { slug: 'skyline-apartments', title: 'Skyline Apartments', summary: 'Modern 24-unit residential development in Lekki Phase 1.', description: 'Skyline Apartments is a 24-unit luxury residential development in Lekki Phase 1, Lagos. Projected 15% annual return over 24 months.', category: 'REAL_ESTATE', coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', targetAmount: 50000000, minInvestment: 100000, raisedAmount: 32500000, expectedReturnPct: 15, tenorMonths: 24, payoutFrequency: 'quarterly', location: 'Lekki Phase 1, Lagos', riskLevel: 'medium', isFeatured: true },
  { slug: 'greenfarm-project', title: 'GreenFarm Project', summary: '100-hectare mechanized maize and soybean farm in Kaduna.', description: 'GreenFarm is a 100-hectare mechanized farm producing maize and soybean. Projected 16.2% annual return over 18 months.', category: 'AGRICULTURE', coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200', targetAmount: 30000000, minInvestment: 100000, raisedAmount: 12000000, expectedReturnPct: 16.2, tenorMonths: 18, payoutFrequency: 'quarterly', location: 'Kaduna, Nigeria', riskLevel: 'medium', isFeatured: true },
  { slug: 'solar-power-plant', title: 'Solar Power Plant', summary: '5MW solar mini-grid serving 3,000 households in Ogun State.', description: 'A 5MW solar mini-grid in Ogun State. 17.4% projected annual return over 36 months.', category: 'ENERGY', coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200', targetAmount: 80000000, minInvestment: 500000, raisedAmount: 72000000, expectedReturnPct: 17.4, tenorMonths: 36, payoutFrequency: 'quarterly', location: 'Ogun State, Nigeria', riskLevel: 'high', isFeatured: true },
  { slug: 'bravevest-projects-001', title: 'BraveVest Projects 001', summary: 'Pilot project pool — estate fencing, drainage, site prep.', description: 'The initial pilot product: estate fencing, drainage works, site clearing, road prep. 36% annualized over 6 months.', category: 'INFRASTRUCTURE', coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200', targetAmount: 5000000, minInvestment: 50000, raisedAmount: 1750000, expectedReturnPct: 36, tenorMonths: 6, payoutFrequency: 'monthly', location: 'Lagos, Nigeria', riskLevel: 'medium', isFeatured: false },
  { slug: 'ikeja-warehouse', title: 'Ikeja Logistics Warehouse', summary: 'Grade-A warehouse with 5-year leaseback.', description: '4,500 sqm Grade-A logistics warehouse with signed 5-year leaseback. 14.5% annual return.', category: 'REAL_ESTATE', coverImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200', targetAmount: 120000000, minInvestment: 250000, raisedAmount: 45000000, expectedReturnPct: 14.5, tenorMonths: 60, payoutFrequency: 'monthly', location: 'Ikeja, Lagos', riskLevel: 'low', isFeatured: false },
  { slug: 'abuja-sme-loan-pool', title: 'Abuja SME Loan Pool', summary: 'Credit-backed pool of 40 vetted SME loans.', description: 'Diversified pool of 40 vetted SME loans with guarantees and collateral. 19.5% annual return.', category: 'SME', coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', targetAmount: 100000000, minInvestment: 100000, raisedAmount: 38000000, expectedReturnPct: 19.5, tenorMonths: 18, payoutFrequency: 'monthly', location: 'Abuja, Nigeria', riskLevel: 'high', isFeatured: false },
];

const INSIGHTS = [
  { title: 'Why Nigerian Real Estate Is Re-Rating in 2026', summary: 'Three structural shifts repricing prime Lagos and Abuja stock.', category: 'Real Estate', body: 'Real estate has always been the default store of value in Nigeria. Three structural shifts are repricing prime stock right now.\n\n## FX stability is returning\nAfter two years of volatility, we are seeing tentative stabilization.\n\n## Title digitization is working\nThe Lagos State e-GIS system is reducing friction on land transfers.\n\n## Institutional capital is entering\nPension funds and insurance companies are allocating to mid-market residential.', isPublished: true, coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200' },
  { title: 'Agriculture in Nigeria: The Yield Gap Problem', summary: 'Nigerian farms produce 30–40% less per hectare than East African peers. Closing that gap is the biggest opportunity.', category: 'Agriculture', body: 'Nigeria has 34 million hectares of arable land yet imports $10 billion of food annually.\n\n## The gap in numbers\nNigerian maize: 2.1 tonnes per hectare. Kenyan: 3.5. South African: 5.2.\n\n## Why this is an opportunity\nThe gap is operational, not structural. Farms that mechanize hit 4+ tonnes per hectare.\n\n## What we look for\nMechanization, irrigation, storage, offtake contracts, operator track record.', isPublished: true, coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200' },
  { title: 'Understanding Project Risk Ratings', summary: 'Every BraveVest project carries a risk rating. Here is what each one means.', category: 'Education', body: 'Every investment on BraveVest carries a risk rating. It is not decoration — it is the single most important number on the project page.\n\n## What the ratings mean\nLow risk: contractual or fully collateralized repayment.\nMedium risk: depends on operational execution with a track record.\nHigh risk: new markets, new products, incomplete security.\n\n## How to use ratings\n40–60% low risk, 30–40% medium, 10–20% high risk.', isPublished: true, coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200' },
  { title: 'Solar Mini-Grids: The Real Numbers', summary: 'Off-grid solar in Nigeria is finally profitable without subsidy.', category: 'Energy', body: 'For a decade, solar mini-grids ran on donor money. That changed in 2024.\n\n## The unit economics\nA 5MW grid serving 3,000 households: ₦4–5B capex, ₦700–900M annual revenue, ₦450–650M net operating income. 10–13% unlevered yield.\n\n## Why it works now\nSmart meters are cheap. Batteries are 40% cheaper. Tariff enforcement is real.\n\n## The risk\nRegulatory. This is why most solar projects are rated high risk.', isPublished: true, coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200' },
  { title: 'How Diaspora Investors Should Think About Naira Risk', summary: 'The most important decision is not which project — it is how much currency exposure you carry.', category: 'Market Notes', body: 'You earn in pounds, dollars, or euros. You invest in naira. Every return has to survive the FX move.\n\n## The three positions\nCurrency-hedged returns, structural naira exposure, or a directional naira bet.\n\n## The practical framework\nMost diaspora investors should run 30–40% Position 1, 40–50% Position 2, 10–20% Position 3.', isPublished: true, coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200' },
  { title: 'Announcing BraveVest Circle', summary: 'A private investment community for our highest-conviction investors.', category: 'Platform', body: 'We are launching BraveVest Circle — a private investment community.\n\n## What Circle members get\nEarly access, priority allocation, private briefings, site inspections.\n\n## Who qualifies\n₦10M cumulative investment, five successful referrals, or institutional accounts with 10+ members.', isPublished: false, coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200' },
];

async function seed() {
  console.log('════════════════════════════════════════════════════════');
  console.log('  BraveVest — Seed demo data');
  console.log('════════════════════════════════════════════════════════\n');

  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const userMap = {};

  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, firstName: u.firstName, lastName: u.lastName, phone: u.phone, passwordHash, role: u.role, status: 'ACTIVE', emailVerified: new Date() },
    });
    userMap[u.email] = user.id;

    const kycData = { status: u.kyc, dateOfBirth: new Date('1990-01-15'), gender: 'male', nationality: 'NG', occupation: 'Professional', idType: 'NIN', idNumber: '12345678901', addressLine1: '12 Marina Road', city: 'Lagos', state: 'Lagos', country: 'NG', bankName: 'GTBank', bankCode: '058', accountNumber: '0123456789', accountName: u.firstName + ' ' + u.lastName, submittedAt: u.kyc !== 'NOT_STARTED' ? new Date() : null, reviewedAt: ['APPROVED', 'REJECTED'].includes(u.kyc) ? new Date() : null };
    await prisma.kycProfile.upsert({ where: { userId: user.id }, update: kycData, create: { userId: user.id, ...kycData } });

    console.log('  ✔ ' + u.email + '  [' + u.role + ', KYC:' + u.kyc + ']');
  }

  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@' + DOMAIN } });
  const projectMap = {};
  for (const p of PROJECTS) {
    const proj = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, status: 'OPEN', createdById: adminUser.id },
    });
    projectMap[p.slug] = proj.id;
    console.log('  ✔ ' + p.title);
  }

  for (const i of INSIGHTS) {
    const exists = await prisma.insight.findFirst({ where: { title: i.title } });
    if (!exists) {
      await prisma.insight.create({ data: { title: i.title, summary: i.summary, body: i.body, category: i.category, coverImage: i.coverImage, isPublished: i.isPublished, publishedAt: i.isPublished ? new Date() : null } });
      console.log('  ✔ ' + (i.isPublished ? '[published] ' : '[draft] ') + i.title);
    }
  }

  console.log('\n✅ Seed complete.');
  console.log('\n🔑 Demo accounts (password: ' + PASSWORD + ')');
  console.log('   admin@' + DOMAIN + ' / DemoPass123!');
  console.log('   investor@' + DOMAIN + ' / DemoPass123!');
  console.log('   ... and 4 more');
}

async function wipe() {
  console.log('🧹 Wiping demo data...');
  const demoEmails = USERS.map((u) => u.email);
  const demoUsers = await prisma.user.findMany({ where: { email: { in: demoEmails } } });
  const ids = demoUsers.map((u) => u.id);
  if (ids.length) {
    await prisma.transaction.deleteMany({ where: { userId: { in: ids } } });
    await prisma.investment.deleteMany({ where: { userId: { in: ids } } });
    await prisma.kycProfile.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
  }
  await prisma.project.deleteMany({ where: { slug: { in: PROJECTS.map((p) => p.slug) } } });
  await prisma.insight.deleteMany({ where: { title: { in: INSIGHTS.map((i) => i.title) } } });
  console.log('✅ Done.');
}

(isWipe ? wipe() : seed()).catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
