#!/usr/bin/env node
// One-shot: copy existing `role` values into the new `roles[]` array.
// Run AFTER `npx prisma migrate dev` has created the roles column.
// Run from bravevest-api/: `node scripts/migrate-roles-to-array.js`

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT id, role FROM users WHERE (roles IS NULL OR array_length(roles, 1) IS NULL)`
  ).catch(() => []);

  if (!rows.length) {
    console.log('nothing to migrate — roles[] already populated or column gone');
    return;
  }

  console.log(`migrating ${rows.length} users…`);
  for (const row of rows) {
    await prisma.user.update({
      where: { id: row.id },
      data: { roles: [row.role] },
    });
  }
  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
