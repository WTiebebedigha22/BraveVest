// src/modules/streaks/streaks.service.js
const { prisma } = require('../../config/database');

async function getOrCreate(userId) {
  let s = await prisma.investorStreak.findUnique({ where: { userId } });
  if (!s) s = await prisma.investorStreak.create({ data: { userId } });
  return s;
}

/** Called when user makes an investment — updates streak based on month-over-month activity */
async function recordActivity(userId) {
  const streak = await getOrCreate(userId);
  const now = new Date();

  // If lastActivity was in the previous month → increment
  // If same month → no change
  // If more than one month ago → reset to 1
  let next = 1;
  if (streak.lastActivityAt) {
    const last = new Date(streak.lastActivityAt);
    const sameMonth = last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const isLastMonth = last.getFullYear() === prevMonth.getFullYear() && last.getMonth() === prevMonth.getMonth();

    if (sameMonth) next = streak.currentStreak;
    else if (isLastMonth) next = streak.currentStreak + 1;
    else next = 1;
  }

  return prisma.investorStreak.update({
    where: { userId },
    data: {
      currentStreak: next,
      longestStreak: Math.max(streak.longestStreak, next),
      lastActivityAt: now,
    },
  });
}

module.exports = { getOrCreate, recordActivity };
