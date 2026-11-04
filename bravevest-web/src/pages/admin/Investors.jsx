import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api/admin';

export default function AdminInvestors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.investors({ q }).then(r => setItems(r || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [q]);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Investor Directory</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>{items.length} users</p>
          </div>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or name" style={{ width: '240px' }} />
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead><tr><th>User</th><th>Roles</th><th>KYC</th><th>Investments</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {items.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>{u.email}</div>
                    </td>
                    <td><span className="pill">{(u.roles || []).join(', ')}</span></td>
                    <td><span className={'pill ' + (u.kyc?.status === 'APPROVED' ? 'pill--green' : u.kyc?.status === 'REJECTED' ? 'pill--red' : '')}>{u.kyc?.status || 'NONE'}</span></td>
                    <td style={{ textAlign: 'center' }}>{u._count?.investments || 0}</td>
                    <td><span className={'pill ' + (u.status === 'ACTIVE' ? 'pill--green' : 'pill--red')}>{u.status}</span></td>
                    <td style={{ textAlign: 'right' }}><Link to={'/admin/investors/' + u.id} className="btn btn--outline btn--sm">View</Link></td>
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
