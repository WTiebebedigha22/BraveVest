import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Shield, FolderOpen, TrendingUp, ArrowLeftRight,
  Loader2, AlertCircle, RefreshCw, ChevronRight, Activity,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
import AdminShell from '@/components/admin/AdminShell';

const statCard = {
  padding: '16px 18px',
  background: 'var(--bv-bg-elevated)',
  border: '1px solid var(--bv-border)',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const statIcon = {
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'color-mix(in srgb, var(--bv-accent) 15%, transparent)',
  color: 'var(--bv-accent)',
  marginBottom: 6,
};

const fmtMoney = (n) => '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [statsRes, activityRes] = await Promise.all([
        apiFetch('/admin/dashboard').catch((e) => ({ error: e.message })),
        apiFetch('/admin/activity').catch(() => ({ data: [] })),
      ]);
      setStats(statsRes?.data || statsRes || null);
      setActivity(Array.isArray(activityRes?.data) ? activityRes.data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <PortalLayout>
      <AdminShell
        title="Overview"
        description="Platform stats and recent activity"
        actions={
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bv-accent)', color: '#000',
              border: 'none', fontWeight: 700, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        }
      >
        {error && (
          <div style={{
            padding: 16,
            background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)',
            borderRadius: 12,
            color: 'var(--bv-danger)',
            display: 'flex', gap: 10,
            marginBottom: 16,
            fontSize: 13,
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{error}</span>
          </div>
        )}

        {loading && !stats ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading stats…
          </div>
        ) : stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={statCard}>
              <div style={statIcon}><Users size={16} /></div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Users</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-text)' }}>
                {Number(stats.totalUsers || 0).toLocaleString()}
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}><Shield size={16} /></div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending KYC</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-warning)' }}>
                {Number(stats.pendingKyc || 0).toLocaleString()}
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}><FolderOpen size={16} /></div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Projects</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-text)' }}>
                {Number(stats.activeInvestments || stats.totalProjects || 0).toLocaleString()}
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}><TrendingUp size={16} /></div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Invested</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bv-success)', wordBreak: 'break-word' }}>
                {fmtMoney(stats.totalInvested)}
              </div>
            </div>

            <div style={statCard}>
              <div style={statIcon}><ArrowLeftRight size={16} /></div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Transactions</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-text)' }}>
                {Number(stats.totalTransactions || 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {/* Recent Activity Panel */}
          <div style={{
            background: 'var(--bv-bg-elevated)',
            border: '1px solid var(--bv-border)',
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Activity size={16} color="var(--bv-text-muted)" />
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>
                Recent Activity
              </h2>
            </div>

            {activity.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--bv-text-muted)' }}>
                No activity yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activity.slice(0, 8).map((a, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    background: 'var(--bv-surface)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}>
                    <div style={{ color: 'var(--bv-text)', wordBreak: 'break-word' }}>
                      {a.message || a.action || 'Activity'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginTop: 2 }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div style={{
            background: 'var(--bv-bg-elevated)',
            border: '1px solid var(--bv-border)',
            borderRadius: 12,
            padding: 16,
            height: 'fit-content',
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: 'var(--bv-text)' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/admin/submissions', label: 'Review submissions' },
                { to: '/admin/kyc', label: 'Review KYC queue' },
                { to: '/admin/investors', label: 'Manage investors' },
                { to: '/admin/projects', label: 'Manage projects' },
                { to: '/admin/transactions', label: 'View transactions' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 8,
                    background: 'var(--bv-surface)', color: 'var(--bv-text)',
                    textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={14} color="var(--bv-text-muted)" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    </PortalLayout>
  );
}