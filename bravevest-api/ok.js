require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  console.log('Total projects:', await prisma.project.count());

  const all = await prisma.project.findMany({
    select: { slug: true, status: true, isFeatured: true, title: true },
  });
  console.table(all);

  const open = await prisma.project.count({ where: { status: 'OPEN' } });
  console.log('OPEN projects:', open);

  await prisma.$disconnect();
})();