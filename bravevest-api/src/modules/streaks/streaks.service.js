const { prisma } = require('../../config/database');
async function getOrCreate(userId) {
  let s = await prisma.investorStreak.findUnique({ where: { userId } });
  if (!s) s = await prisma.investorStreak.create({ data: { userId } });
  return s;
}
async function recordActivity(userId) {
  const s = await getOrCreate(userId);
  const now = new Date();
  let next = 1;
  if (s.lastActivityAt) {
    const last = new Date(s.lastActivityAt);
    const sameMonth = last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const isLastMonth = last.getFullYear() === prevMonth.getFullYear() && last.getMonth() === prevMonth.getMonth();
    if (sameMonth) next = s.currentStreak;
    else if (isLastMonth) next = s.currentStreak + 1;
  }
  return prisma.investorStreak.update({ where: { userId }, data: { currentStreak: next, longestStreak: Math.max(s.longestStreak, next), lastActivityAt: now } });
}
module.exports = { getOrCreate, recordActivity };
