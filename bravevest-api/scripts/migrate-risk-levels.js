
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const map = { A: 'Low', AA: 'Low', BBB: 'Medium', BB: 'High', B: 'High' };
  let total = 0;
  for (const [oldVal, newVal] of Object.entries(map)) {
    const r = await prisma.project.updateMany({
      where: { riskLevel: oldVal },
      data: { riskLevel: newVal },
    });
    if (r.count > 0) console.log('  ' + oldVal + ' → ' + newVal + ': ' + r.count);
    total += r.count;
  }
  console.log('  Total: ' + total + ' projects updated');
  await prisma.$disconnect();
})();
