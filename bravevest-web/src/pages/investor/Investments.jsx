import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { investmentsApi } from '@/api/investments';
import { useCurrency } from '@/context/CurrencyContext';

export default function Investments() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.listMine()
      .then(r => setItems(Array.isArray(r) ? r : r.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>My Investments</h1>
          <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>{items.length} active and completed</p>
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No investments yet.</p>
            <Link to="/marketplace" className="btn btn--primary">Browse Markets</Link>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Invested</th>
                  <th style={{ textAlign: 'right' }}>Current Value</th>
                  <th style={{ textAlign: 'right' }}>Return</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(inv => {
                  const amount = Number(inv.amount || 0);
                  const current = Number(inv.currentValue || amount);
                  const ret = amount > 0 ? ((current - amount) / amount) * 100 : 0;
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: '600' }}>{inv.project?.title || inv.projectTitle || 'Investment'}</td>
                      <td><span className={'pill ' + (inv.status === 'ACTIVE' ? 'pill--green' : inv.status === 'PENDING' ? '' : '')}>{inv.status}</span></td>
                      <td className="num">{format(amount)}</td>
                      <td className="num">{format(current)}</td>
                      <td className={'num ' + (ret >= 0 ? 'positive' : 'negative')}>{ret >= 0 ? '+' : ''}{ret.toFixed(2)}%</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={'/investments/' + inv.id} className="btn btn--outline btn--sm">View</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
