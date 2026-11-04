import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminDashboard() {
  const { format } = useCurrency();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.dashboard().catch(() => ({})),
      adminApi.activity(10).catch(() => []),
    ]).then(([s, a]) => { setStats(s); setActivity(a || []); }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Admin Overview</h1>
          <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Platform health at a glance</p>
        </div>

        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <KPI icon={Users} label="Total Users" value={stats?.totalUsers ?? '—'} />
          <KPI icon={Shield} label="Pending KYC" value={stats?.pendingKyc ?? '—'} alert={stats?.pendingKyc > 0} />
          <KPI icon={AlertCircle} label="Pending Funding" value={stats?.pendingFunding ?? '—'} alert={stats?.pendingFunding > 0} />
          <KPI icon={TrendingUp} label="Total Invested" value={loading ? '—' : format(stats?.totalInvested || 0)} />
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="card">
            <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              <Link to="/admin/kyc" className="btn btn--outline" style={{ justifyContent: 'space-between' }}>Review KYC Queue <span>→</span></Link>
              <Link to="/admin/funding/review" className="btn btn--outline" style={{ justifyContent: 'space-between' }}>Funding Review <span>→</span></Link>
              <Link to="/admin/projects" className="btn btn--outline" style={{ justifyContent: 'space-between' }}>Manage Projects <span>→</span></Link>
              <Link to="/admin/investors" className="btn btn--outline" style={{ justifyContent: 'space-between' }}>Investor Directory <span>→</span></Link>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Activity</h3>
            </div>
            {loading ? <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px' }}>Loading…</p> : activity.length === 0 ? <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px' }}>No activity yet</p> : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {activity.slice(0, 6).map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--bybit-border)' }}>
                    <span><strong style={{ textTransform: 'capitalize' }}>{a.action}</strong> on {a.entity}</span>
                    <span style={{ color: 'var(--bybit-text-muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, alert }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span className="data-label" style={{ fontSize: '10px' }}>{label}</span>
        <Icon size={14} color={alert ? 'var(--bybit-red)' : 'var(--bybit-text-muted)'} />
      </div>
      <div style={{ fontSize: '22px', fontWeight: '700', color: alert ? 'var(--bybit-orange)' : 'var(--bybit-text)' }}>{value}</div>
    </div>
  );
}
