import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminDashboard() {
  const { format } = useCurrency();
  const [stats, setStats] = useState({ aum: 0, investors: 0, projects: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats')
      .then(r => setStats(r.data?.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>Admin Console</h1>
        <p style={{ color: 'var(--bybit-text-muted)', margin: '0 0 32px', fontSize: '14px' }}>Platform-wide metrics and operations</p>

        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div className="card"><div className="data-label">Total AUM</div><div className="data-value" style={{ marginTop: '8px', fontSize: '24px' }}>{loading ? '—' : format(stats.aum)}</div></div>
          <div className="card"><div className="data-label">Total Investors</div><div className="data-value" style={{ marginTop: '8px', fontSize: '24px' }}>{loading ? '—' : stats.investors?.toLocaleString()}</div></div>
          <div className="card"><div className="data-label">Active Deals</div><div className="data-value" style={{ marginTop: '8px', fontSize: '24px' }}>{loading ? '—' : stats.projects}</div></div>
          <div className="card" style={{ borderColor: 'rgba(246,165,0,0.3)' }}><div className="data-label" style={{ color: 'var(--bybit-orange)' }}>Pending Review</div><div className="data-value" style={{ marginTop: '8px', fontSize: '24px', color: 'var(--bybit-orange)' }}>{loading ? '—' : stats.pending}</div></div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Operations Queue</h3>
          <p style={{ fontSize: '14px', color: 'var(--bybit-text-muted)', margin: 0 }}>Wire up admin tables (users, KYC queue, project approvals) here.</p>
        </div>
      </div>
    </div>
  );
}
