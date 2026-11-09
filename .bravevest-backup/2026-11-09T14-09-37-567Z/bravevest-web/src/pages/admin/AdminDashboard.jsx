import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, FolderOpen, TrendingUp, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiFetch } from '@/lib/api';
import PageShell from '@/components/shared/PageShell';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await apiFetch('/admin/dashboard').catch(() => apiFetch('/admin/overview').catch(() => null));
        if (!cancelled) setData(json || {});
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load overview.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <PageShell theme="dark">
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading admin overview…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell theme="dark">
        <div style={{ padding: 48 }}>
          <div role="alert" style={{ padding: 16, maxWidth: 480, margin: '0 auto', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} /> {error}
          </div>
        </div>
      </PageShell>
    );
  }

  const stats = data?.stats ?? data ?? {};
  const chart = data?.chart ?? [];
  const recentKyc = data?.recentKyc ?? [];

  return (
    <PageShell theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 className="bv-fade-up" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Admin Overview
          </h1>
          <p className="bv-fade-up" style={{ color: 'var(--text-muted)', margin: '0 0 32px', fontSize: 15 }}>
            Platform health and activity at a glance.
          </p>

          <div className="bv-grid-4 bv-fade-up" style={{ marginBottom: 32 }}>
            <StatCard icon={<Users size={18} />} label="Total Investors" value={stats.totalInvestors ?? stats.activeInvestors ?? 0} href="/admin/investors" />
            <StatCard icon={<Shield size={18} />} label="Pending KYC" value={stats.pendingKyc ?? 0} tone="warning" href="/admin/kyc" />
            <StatCard icon={<FolderOpen size={18} />} label="Open Projects" value={stats.openProjects ?? 0} href="/admin/projects" />
            <StatCard icon={<TrendingUp size={18} />} label="Investments MTD" value={stats.investmentsMtd ?? '₦0'} href="/admin/investments" />
          </div>

          <div className="bv-card-lift bv-fade-up" style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Platform growth</h2>
            {chart.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No chart data available.</div>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={chart}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13 }} />
                    <Line type="monotone" dataKey="investors" stroke="#F6A500" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bv-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Recent KYC submissions</h2>
              <Link to="/admin/kyc" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>View all →</Link>
            </div>
            {recentKyc.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, fontSize: 14 }}>
                No pending KYC submissions.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentKyc.map((k) => (
                  <li key={k.id} className="bv-card-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{k.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Submitted {k.submittedAt}</div>
                    </div>
                    <Link to={`/admin/kyc/${k.id}`} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                      Review →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({ icon, label, value, href, tone }) {
  const color = tone === 'warning' ? '#F59E0B' : 'var(--text)';
  return (
    <Link to={href || '#'} className="bv-card-lift" style={{
      padding: 24, background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, textDecoration: 'none', color: 'var(--text)',
      display: 'block', transition: 'transform 0.25s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </Link>
  );
}
