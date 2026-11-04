import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { investmentsApi } from '@/api/investments';
import { useCurrency } from '@/context/CurrencyContext';

export default function Portfolio() {
  const { format } = useCurrency();
  const [summary, setSummary] = useState({ totalInvested: 0, currentValue: 0, totalReturns: 0, items: [] });
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      investmentsApi.portfolio().catch(() => ({})),
      investmentsApi.series().catch(() => []),
    ]).then(([p, s]) => {
      setSummary({
        totalInvested: Number(p.totalInvested || 0),
        currentValue: Number(p.currentValue || 0),
        totalReturns: Number(p.totalReturns || 0),
        items: p.items || [],
      });
      setSeries(Array.isArray(s) ? s : []);
    }).finally(() => setLoading(false));
  }, []);

  const pnl = summary.currentValue - summary.totalInvested;
  const pnlPct = summary.totalInvested > 0 ? (pnl / summary.totalInvested) * 100 : 0;

  // Group holdings by category
  const byCategory = summary.items.reduce((acc, inv) => {
    const cat = inv.category || inv.project?.category || 'Other';
    if (!acc[cat]) acc[cat] = { amount: 0, count: 0 };
    acc[cat].amount += Number(inv.amount || 0);
    acc[cat].count += 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Portfolio</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Your capital allocation and performance</p>
          </div>
          <Link to="/marketplace" className="btn btn--primary btn--sm">Invest More</Link>
        </div>

        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="card">
            <div className="data-label">Current Value</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>
              {loading ? '—' : format(summary.currentValue)}
            </div>
          </div>
          <div className="card">
            <div className="data-label">Total Invested</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>
              {loading ? '—' : format(summary.totalInvested)}
            </div>
          </div>
          <div className="card">
            <div className="data-label">Unrealised P&L</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: pnl >= 0 ? 'var(--bybit-green)' : 'var(--bybit-red)' }}>
              {loading ? '—' : format(pnl)}
              {!loading && <span style={{ fontSize: '14px', marginLeft: '8px' }}>({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)</span>}
            </div>
          </div>
        </div>

        {/* Chart */}
        {series.length > 1 && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '16px' }}>Value over time</h3>
            <Sparkline points={series.map(s => s.value || 0)} height={120} />
          </div>
        )}

        {/* Holdings table */}
        <div className="card" style={{ padding: 0, marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bybit-border)' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Holdings ({summary.items.length})</h3>
          </div>
          {loading ? <div style={{ padding: '24px' }}>
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div> : summary.items.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No holdings yet</p>
              <Link to="/marketplace" className="btn btn--outline btn--sm">Browse Opportunities</Link>
            </div>
          ) : (
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Invested</th>
                  <th style={{ textAlign: 'right' }}>Current</th>
                  <th style={{ textAlign: 'right' }}>Return</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {summary.items.map(inv => {
                  const amount = Number(inv.amount || 0);
                  const current = Number(inv.currentValue || amount);
                  const ret = amount > 0 ? ((current - amount) / amount) * 100 : 0;
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: '600' }}>{inv.projectTitle || inv.project?.title || 'Investment'}</td>
                      <td><span className={'pill ' + (inv.status === 'ACTIVE' ? 'pill--green' : '')}>{inv.status || 'PENDING'}</span></td>
                      <td className="num">{format(amount)}</td>
                      <td className="num">{format(current)}</td>
                      <td className={'num ' + (ret >= 0 ? 'positive' : 'negative')}>{ret >= 0 ? '+' : ''}{ret.toFixed(2)}%</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={'/investments/' + inv.id} className="btn btn--ghost btn--sm">View</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Category breakdown */}
        {Object.keys(byCategory).length > 0 && (
          <div className="card">
            <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '16px' }}>Allocation by Category</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(byCategory).map(([cat, data]) => {
                const pct = summary.totalInvested > 0 ? (data.amount / summary.totalInvested) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>{cat} <span style={{ color: 'var(--bybit-text-muted)' }}>({data.count})</span></span>
                      <span style={{ fontWeight: '600' }}>{format(data.amount)} · {pct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bybit-surface-2)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: 'var(--bybit-orange)' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sparkline({ points, height = 60 }) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 100; // percent
  const step = width / (points.length - 1 || 1);
  
  const pathPoints = points.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return x + ',' + y;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={'0 0 ' + width + ' ' + height} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline points={pathPoints} fill="none" stroke="var(--bybit-orange)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
