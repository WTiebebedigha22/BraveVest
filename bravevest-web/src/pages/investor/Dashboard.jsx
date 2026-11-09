import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ArrowDownRight, Wallet as WalletIcon,
  TrendingUp, Plus, Eye, EyeOff, AlertCircle, Loader2,
  Calendar, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch('/dashboard');
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load dashboard.');
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
          Loading your dashboard…
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
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load dashboard</div>
              <div style={{ fontSize: 13 }}>{error}</div>
              <button onClick={() => window.location.reload()} className='bv-pill bv-pill--primary' style={{ marginTop: 12 }}>
                Try again
              </button>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const portfolioValue = data?.portfolioValue ?? 0;
  const monthlyDelta = data?.monthlyDelta ?? 0;
  const deltaPercent = data?.deltaPercent ?? 0;
  const isPositive = monthlyDelta >= 0;
  const activeInvestments = data?.activeInvestments ?? 0;
  const walletBalance = data?.walletBalance ?? 0;
  const nextPayout = data?.nextPayout ?? null;
  const recent = data?.recentActivity ?? [];

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
              Welcome back{user?.firstName ? ', ' + user.firstName : ''}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
              Here's how your portfolio is doing today.
            </p>
          </div>

          <article style={{ padding: 32, background: 'linear-gradient(135deg, var(--surface) 0%, rgba(246,165,0,0.05) 100%)', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Portfolio Value</span>
              <button onClick={() => setHideBalance(!hideBalance)} aria-label={hideBalance ? 'Show balance' : 'Hide balance'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: 'var(--text)' }}>
              {hideBalance ? '••••••' : format(portfolioValue)}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: isPositive ? 'var(--positive)' : 'var(--negative)' }}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {isPositive ? '+' : ''}{format(Math.abs(monthlyDelta))} this month
              {deltaPercent !== 0 && (
                <span style={{ marginLeft: 8, padding: '2px 8px', background: isPositive ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)', borderRadius: 4, fontSize: 12 }}>
                  {isPositive ? '+' : ''}{deltaPercent.toFixed(1)}%
                </span>
              )}
            </div>
          </article>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard icon={<TrendingUp size={18} />} label='Active Investments' value={activeInvestments} href='/investments' actionLabel='View all' />
            <StatCard icon={<WalletIcon size={18} />} label='Wallet Balance' value={hideBalance ? '••••' : format(walletBalance)} href='/wallet' actionLabel='Open wallet' />
            <StatCard icon={<Calendar size={18} />} label='Next Payout' value={nextPayout ? format(nextPayout.amount) : '—'} sub={nextPayout?.date ? new Date(nextPayout.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : null} />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link to='/marketplace' className='bv-pill bv-pill--primary'><Plus size={16} /> Invest in a project</Link>
            <Link to='/wallet?tab=deposit' className='bv-pill bv-pill--ghost'><WalletIcon size={16} /> Fund wallet</Link>
            <Link to='/opportunities/new' className='bv-pill bv-pill--ghost'><Plus size={16} /> Submit an opportunity</Link>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Recent activity</h2>
              <Link to='/statement' style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                View all <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>No activity yet</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Make your first investment to get started.</div>
                <Link to='/marketplace' className='bv-pill bv-pill--primary'>Browse opportunities</Link>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recent.map((item) => (
                  <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(item.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: item.positive ? 'var(--positive)' : 'var(--text)' }}>
                      {item.positive ? '+' : ''}{format(item.amount)}
                    </div>
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

function StatCard({ icon, label, value, sub, href, actionLabel }) {
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 10 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
      {actionLabel && href && (
        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 10 }}>{actionLabel} →</div>
      )}
    </>
  );
  const styles = { padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, display: 'block', textDecoration: 'none', color: 'inherit' };
  return href ? <Link to={href} style={styles}>{inner}</Link> : <div style={styles}>{inner}</div>;
}
