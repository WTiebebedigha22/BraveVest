const { prisma } = require('../../config/database');
async function stats(userId) {
  const referrals = await prisma.referral.findMany({ where: { referrerId: userId } });
  const qualified = referrals.filter((r) => ['QUALIFIED', 'REWARDED'].includes(r.status));
  const rewarded = referrals.filter((r) => r.status === 'REWARDED');
  return {
    referred: referrals.length,
    qualified: qualified.length,
    earned: rewarded.reduce((s, r) => s + Number(r.rewardAmount || 0), 0),
    pending: qualified.length * 5000,
    tiers: [
      { threshold: 1, amount: 5000 },
      { threshold: 3, amount: 20000 },
      { threshold: 5, amount: 50000 },
    ],
  };
}
module.exports = { stats };
