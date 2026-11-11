#!/usr/bin/env node
/**
 * bravevest-api/scripts/check-roles.js
 *
 * Prints every user and their roles. Use this to confirm you have
 * an admin + super admin to test gating.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const users = await prisma.user.findMany({
    select: { email: true, roles: true, status: true },
    orderBy: { email: 'asc' },
  });
  console.log('\nUsers and roles:');
  for (const u of users) {
    const badge = u.roles.includes('SUPER_ADMIN') ? '🔴 SUPER'
               : u.roles.includes('ADMIN') ? '🟡 ADMIN'
               : '👤 user';
    console.log(`  ${badge}  ${u.email.padEnd(40)}  ${u.roles.join(', ')}`);
  }
  console.log('');
  await prisma.$disconnect();
})();
