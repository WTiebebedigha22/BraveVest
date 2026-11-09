import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, FolderOpen, TrendingUp, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

export default function AdminDashboard() {
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch('/admin/dashboard');
        if (!cancelled) setData(result);
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
      <PortalLayout theme='dark'>
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading admin overview…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout theme='dark'>
        <div style={{ padding: 48, maxWidth: 480, margin: '0 auto' }}>
          <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} /> {error}
          </div>
        </div>
      </PortalLayout>
    );
  }

  const stats = data?.stats ?? {};
  const recentKyc = data?.recentKyc ?? [];

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Admin Overview
          </h1>
          <p style={{ margin: '0 0 32px', color: 'var(--text-muted)', fontSize: 15 }}>
            Platform health and activity at a glance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <AdminStat icon={<Users size={18} />} label='Total Investors' value={stats.totalInvestors ?? 0} href='/admin/investors' />
            <AdminStat icon={<Shield size={18} />} label='Pending KYC' value={stats.pendingKyc ?? 0} href='/admin/kyc' tone='warning' />
            <AdminStat icon={<FolderOpen size={18} />} label='Open Projects' value={stats.openProjects ?? 0} href='/admin/projects' />
            <AdminStat icon={<TrendingUp size={18} />} label='Investments MTD' value={format(stats.investmentsMtd ?? 0)} href='/admin/investments' />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Recent KYC submissions</h2>
              <Link to='/admin/kyc' style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                View queue <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
              </Link>
            </div>

            {recentKyc.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, fontSize: 14 }}>
                No pending KYC submissions.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentKyc.map((k) => (
                  <li key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{k.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Submitted {k.submittedAt ? new Date(k.submittedAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : '—'}
                      </div>
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
    </PortalLayout>
  );
}

function AdminStat({ icon, label, value, href, tone }) {
  const color = tone === 'warning' ? '#F59E0B' : 'var(--text)';
  return (
    <Link to={href || '#'} style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, textDecoration: 'none', color: 'var(--text)', display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </Link>
  );
}
