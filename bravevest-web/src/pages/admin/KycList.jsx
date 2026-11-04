import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api/admin';

const TABS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

export default function AdminKycList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');
  const [q, setQ] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (tab !== 'ALL') params.status = tab;
    if (q) params.q = q;
    adminApi.kycList(params).then(res => setItems(res || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [tab, q]);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>KYC Review Queue</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>{items.length} submissions</p>
          </div>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email or name" style={{ width: '240px' }} />
        </div>

        <div className="bybit-tabs" style={{ marginBottom: '16px' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={'bybit-tabs__item ' + (tab === t ? 'active' : '')}>{t.replace('_', ' ')}</button>
          ))}
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>No KYC submissions in this category</div>
        ) : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead><tr><th>User</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
              <tbody>
                {items.map(k => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{k.user?.firstName} {k.user?.lastName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>{k.user?.email}</div>
                    </td>
                    <td><span className={'pill ' + (k.status === 'APPROVED' ? 'pill--green' : k.status === 'REJECTED' ? 'pill--red' : '')}>{k.status}</span></td>
                    <td style={{ color: 'var(--bybit-text-muted)' }}>{new Date(k.updatedAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={'/admin/kyc/' + k.id} className="btn btn--outline btn--sm">Review</Link>
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
