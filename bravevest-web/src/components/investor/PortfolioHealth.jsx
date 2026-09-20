import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import AdminCard from '@/components/admin/AdminCard';
import Currency from '@/components/shared/Currency';
import './PortfolioHealth.css';

const PALETTE = ['#3FB8C4', '#B3D941', '#C9A6F2', '#F2C94C', '#EB5757', '#6FCF97'];

/**
 * Shows diversification and concentration of the investor's portfolio.
 * Props: investments[]  (each with project.category, amount, status)
 */
export default function PortfolioHealth({ investments = [] }) {
  const active = useMemo(
    () => investments.filter((i) => ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(i.status)),
    [investments]
  );

  const { byCategory, total, topShare, hhi } = useMemo(() => {
    const map = {};
    let tot = 0;
    for (const i of active) {
      const cat = i.project?.category || 'OTHER';
      map[cat] = (map[cat] || 0) + Number(i.amount);
      tot += Number(i.amount);
    }
    const arr = Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
    arr.sort((a, b) => b.value - a.value);

    const top = arr.length ? arr[0].value / (tot || 1) : 0;
    // Herfindahl index: lower = more diversified
    const h = arr.reduce((s, x) => s + Math.pow(x.value / (tot || 1), 2), 0);

    return { byCategory: arr, total: tot, topShare: top, hhi: h };
  }, [active]);

  const concentration = topShare > 0.7 ? 'High' : topShare > 0.4 ? 'Moderate' : 'Low';
  const concentrationColor = topShare > 0.7 ? '#8a2121' : topShare > 0.4 ? '#8a6c0a' : '#3a5a10';
  const concentrationBg = topShare > 0.7 ? '#FBE6E6' : topShare > 0.4 ? '#FDF4DB' : '#EAF7CE';

  const diversificationScore = Math.max(0, Math.min(100, Math.round((1 - hhi) * 100)));

  if (active.length === 0) {
    return (
      <AdminCard padded={false}>
        <AdminCard.Header title="Portfolio health" subtitle="Diversification & concentration" />
        <AdminCard.Body>
          <div className="phealth__empty">
            Once you have active investments, we'll show how diversified your portfolio is.
          </div>
        </AdminCard.Body>
      </AdminCard>
    );
  }

  return (
    <AdminCard padded={false}>
      <AdminCard.Header title="Portfolio health" subtitle="Diversification & concentration" />
      <AdminCard.Body>
        <div className="phealth__top">
          <div className="phealth__chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={3}
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                  formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="phealth__stats">
            <div className="phealth__stat">
              <div className="phealth__stat-label">Total active</div>
              <div className="phealth__stat-value"><Currency value={total} compact /></div>
            </div>
            <div className="phealth__stat">
              <div className="phealth__stat-label">Diversification score</div>
              <div className="phealth__stat-value">{diversificationScore}<span className="phealth__stat-unit">/100</span></div>
            </div>
            <div className="phealth__stat">
              <div className="phealth__stat-label">Concentration</div>
              <div className="phealth__stat-value">
                <span className="phealth__pill" style={{ background: concentrationBg, color: concentrationColor }}>
                  {concentration}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="phealth__list">
          {byCategory.map((c, i) => (
            <div key={c.name} className="phealth__row">
              <span className="phealth__dot" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="phealth__name">{c.name}</span>
              <span className="phealth__share">{Math.round((c.value / (total || 1)) * 100)}%</span>
            </div>
          ))}
        </div>

        <div className="phealth__tip">
          {diversificationScore >= 70
            ? '💡 Well diversified. Consider adding a different asset class to improve further.'
            : diversificationScore >= 40
            ? '💡 Moderately concentrated. Adding investments in other categories can reduce risk.'
            : '⚠️ Highly concentrated. Consider spreading capital across more categories.'}
        </div>
      </AdminCard.Body>
    </AdminCard>
  );
}
