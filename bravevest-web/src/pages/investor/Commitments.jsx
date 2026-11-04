import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commitmentsApi } from '@/api/commitments';
import { useCurrency } from '@/context/CurrencyContext';

export default function Commitments() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commitmentsApi.mine()
      .then(r => setItems(Array.isArray(r) ? r : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const total = items.reduce((s, c) => s + Number(c.amount || 0), 0);
  const active = items.filter(c => c.status === 'CONFIRMED').length;

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Commitments</h1>
          <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Your funding commitments across requests</p>
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="card">
            <div className="data-label">Total Committed</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>{loading ? '—' : format(total)}</div>
          </div>
          <div className="card">
            <div className="data-label">Active Commitments</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>{loading ? '—' : active}</div>
          </div>
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>You haven't made any commitments yet.</p>
            <Link to="/funding" className="btn btn--primary">Browse Funding</Link>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{c.request?.title || 'Funding Request'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>{c.request?.reference || c.reference}</div>
                    </td>
                    <td><span className={'pill ' + (c.status === 'CONFIRMED' ? 'pill--green' : c.status === 'PENDING' ? '' : 'pill--red')}>{c.status}</span></td>
                    <td className="num">{format(c.amount)}</td>
                    <td style={{ color: 'var(--bybit-text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      {c.request?.id && <Link to={'/funding/' + c.request.id} className="btn btn--ghost btn--sm">View</Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
