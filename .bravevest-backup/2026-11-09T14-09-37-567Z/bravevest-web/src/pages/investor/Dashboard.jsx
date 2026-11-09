import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ArrowDownRight, Wallet as WalletIcon,
  TrendingUp, Plus, Eye, EyeOff, AlertCircle, Loader2,
  Copy, Gift, CheckCircle2, Megaphone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.db { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B; --by-red:#D6334B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; min-height:60vh; }
.db * { box-sizing:border-box; }
.db-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.db-top { position:relative; overflow:hidden; padding:48px 0 32px; }
.db-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(560px 300px at 85% 0%, rgba(247,166,0,.2), transparent 70%); }
.db-top .db-wrap { position:relative; }
.db h1 { font-size:clamp(28px,4vw,40px); font-weight:800; letter-spacing:-0.035em; margin:0 0 8px; }
.db-sub { margin:0; color:var(--by-mute); font-size:15px; }
.db-main { padding-bottom:80px; }

.db-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:44px; padding:0 20px; border-radius:8px; font-size:14px; font-weight:600; font-family:inherit; text-decoration:none; border:0; cursor:pointer; transition:background .15s, border-color .15s, color .15s; }
.db-btn--y { background:var(--by-yellow); color:#121214; }
.db-btn--y:hover { background:#FFB82E; }
.db-btn--g { background:#fff; color:var(--by-text); border:1px solid var(--by-line); }
.db-btn--g:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.db-btn:focus-visible, .db-eye:focus-visible { outline:2px solid #121214; outline-offset:2px; }

.db-hero { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:32px; margin-bottom:16px; }
.db-hero-head { display:flex; justify-content:space-between; align-items:center; }
.db-lbl { font-size:13px; color:var(--by-mute); font-weight:600; }
.db-eye { background:none; border:0; cursor:pointer; color:var(--by-mute); padding:6px; border-radius:6px; display:inline-flex; }
.db-eye:hover { color:var(--by-text); background:var(--by-card2); }
.db-big { font-size:clamp(34px,5.5vw,56px); font-weight:800; letter-spacing:-0.035em; line-height:1.1; margin:10px 0 10px; font-variant-numeric:tabular-nums; }
.db-delta { display:inline-flex; align-items:center; gap:4px; font-size:14px; font-weight:700; padding:4px 10px; border-radius:6px; font-variant-numeric:tabular-nums; }
.db-delta.up { color:var(--by-green); background:rgba(14,159,91,.1); }
.db-delta.down { color:var(--by-red); background:rgba(214,51,75,.1); }
.db-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:28px; }

.db-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:40px; }
.db-stat { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:22px; transition:border-color .15s, background .15s; }
.db-stat:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.db-stat-top { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.db-ic { width:34px; height:34px; border-radius:8px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; flex:none; }
.db-stat-val { font-size:24px; font-weight:800; letter-spacing:-0.02em; font-variant-numeric:tabular-nums; }
.db-link { display:inline-block; margin-top:10px; font-size:13px; font-weight:600; color:var(--by-amber); text-decoration:none; }
.db-link:hover { text-decoration:underline; }

.db-sechead { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.db-sechead h2 { font-size:20px; font-weight:800; letter-spacing:-0.02em; margin:0; }
.db-list { list-style:none; margin:0; padding:8px; background:var(--by-card); border-radius:16px; }
.db-list li { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:14px 16px; border-radius:10px; }
.db-list li:hover { background:var(--by-card2); }
.db-item-t { font-size:14px; font-weight:600; }
.db-item-d { font-size:12px; color:var(--by-mute); margin-top:2px; }
.db-item-a { font-size:14px; font-weight:700; font-variant-numeric:tabular-nums; white-space:nowrap; }
.db-item-a.pos { color:var(--by-green); }
.db-empty { padding:48px 24px; text-align:center; background:var(--by-card); border-radius:16px; }
.db-empty b { display:block; font-size:16px; margin-bottom:6px; }
.db-empty p { font-size:13px; color:var(--by-mute); margin:0 0 20px; }

.db-two { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-top:40px; }
.db-card { background:var(--by-card); border-radius:16px; padding:24px; }
.db-card-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.db-card-head h2 { font-size:17px; font-weight:800; margin:0; }
.db-card p { font-size:14px; color:var(--by-mute); line-height:1.6; margin:0 0 16px; }
.db-code { padding:12px; background:#fff; border:1px solid var(--by-line); border-radius:8px; margin-bottom:12px; font-family:ui-monospace,Menlo,monospace; font-size:12px; word-break:break-all; color:var(--by-mute); }
.db-dash { padding:16px; background:#fff; border:1px dashed var(--by-line); border-radius:8px; font-size:13px; color:var(--by-mute); line-height:1.6; }
.db-card .db-btn { width:100%; }

.db-state { padding:96px 20px; display:flex; align-items:center; justify-content:center; gap:12px; color:var(--by-mute); }
.db-spin { animation:db-spin 1s linear infinite; }
@keyframes db-spin { to { transform:rotate(360deg); } }
.db-err { display:flex; gap:12px; padding:16px; background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); border-radius:12px; color:var(--by-red); font-size:14px; max-width:480px; margin:48px auto; }
.db-err svg { flex:none; }
.db-err .db-btn { margin-top:12px; }
@media (prefers-reduced-motion:reduce) { .db-spin { animation:none; } }
@media (max-width:760px) { .db-stats { grid-template-columns:1fr; } .db-two { grid-template-columns:1fr; } .db-hero { padding:24px; } }
`;

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
        const dashboard = await apiFetch('/dashboard');
        if (!cancelled) setData(dashboard);
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
      <PortalLayout theme="dark">
        <style>{CSS}</style>
        <div className='db'>
          <div className='db-state' role='status'>
            <Loader2 size={20} className='db-spin' /> Loading your dashboard…
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout theme="dark">
        <style>{CSS}</style>
        <div className='db'>
          <div role='alert' className='db-err'>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Could not load dashboard</div>
              <div>{error}</div>
              <button onClick={() => window.location.reload()} className='db-btn db-btn--y'>Try again</button>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const portfolioValue = data?.portfolioValue ?? 0;
  const monthlyDelta = data?.monthlyDelta ?? 0;
  const isPositive = monthlyDelta >= 0;
  const activeInvestments = data?.activeInvestments ?? 0;
  const walletBalance = data?.walletBalance ?? 0;
  const nextPayout = data?.nextPayout ?? null;
  const recent = data?.recentActivity ?? [];

  return (
    <PortalLayout theme="dark">
      <style>{CSS}</style>
      <div className='db'>
        <section className='db-top'>
          <div className='db-glow' aria-hidden='true' />
          <div className='db-wrap'>
            <h1>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}</h1>
            <p className='db-sub'>Here's how your portfolio is doing today.</p>
          </div>
        </section>

        <div className='db-wrap db-main'>
          <article className='db-hero'>
            <div className='db-hero-head'>
              <span className='db-lbl'>Total Portfolio Value</span>
              <button
                type='button'
                className='db-eye'
                onClick={() => setHideBalance(!hideBalance)}
                aria-label={hideBalance ? 'Show portfolio balance' : 'Hide portfolio balance'}
              >
                {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className='db-big'>{hideBalance ? '••••••' : format(portfolioValue)}</div>
            <span className={`db-delta ${isPositive ? 'up' : 'down'}`}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {isPositive ? '+' : ''}{format(Math.abs(monthlyDelta))} this month
            </span>
            <div className='db-actions'>
              <Link to='/marketplace' className='db-btn db-btn--y'><Plus size={16} /> Invest in a project</Link>
              <Link to='/deposit' className='db-btn db-btn--g'><WalletIcon size={16} /> Fund wallet</Link>
              <Link to='/investments' className='db-btn db-btn--g'><TrendingUp size={16} /> View investments</Link>
            </div>
          </article>

          <div className='db-stats'>
            <StatCard icon={<TrendingUp size={18} />} label='Active Investments' value={activeInvestments} />
            <StatCard icon={<WalletIcon size={18} />} label='Wallet Balance' value={hideBalance ? '••••' : format(walletBalance)} actionLabel='Withdraw' actionHref='/withdraw' />
            <StatCard icon={<TrendingUp size={18} />} label='Next Payout' value={nextPayout ? `${format(nextPayout.amount)} · ${nextPayout.date}` : '—'} />
          </div>

          <div className='db-sechead'>
            <h2>Recent Activity</h2>
            <Link to='/investments' className='db-link' style={{ margin: 0 }}>View all →</Link>
          </div>

          {recent.length === 0 ? (
            <div className='db-empty'>
              <b>No activity yet</b>
              <p>Make your first investment to get started.</p>
              <Link to='/marketplace' className='db-btn db-btn--y'>Browse opportunities</Link>
            </div>
          ) : (
            <ul className='db-list'>
              {recent.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <div>
                    <div className='db-item-t'>{item.title}</div>
                    <div className='db-item-d'>{item.date}</div>
                  </div>
                  <div className={`db-item-a${item.positive ? ' pos' : ''}`}>
                    {item.positive ? '+' : ''}{item.amount}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <ReferralAndFeatured />
        </div>
      </div>
    </PortalLayout>
  );
}

function StatCard({ icon, label, value, actionLabel, actionHref }) {
  return (
    <article className='db-stat'>
      <div className='db-stat-top'>
        <div className='db-ic'>{icon}</div>
        <span className='db-lbl'>{label}</span>
      </div>
      <div className='db-stat-val'>{value}</div>
      {actionLabel && actionHref && <Link to={actionHref} className='db-link'>{actionLabel} →</Link>}
    </article>
  );
}

function ReferralAndFeatured() {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/referrals/me').catch(() => null);
        if (!cancelled && data) setCode(data.code || data.referralCode || '');
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const link = typeof window !== 'undefined' ? window.location.origin + '/#/register?ref=' + (code || '') : '';

  function copy() {
    try {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className='db-two'>
      <div className='db-card'>
        <div className='db-card-head'>
          <div className='db-ic'><Gift size={18} /></div>
          <h2>Refer &amp; earn</h2>
        </div>
        <p>Share your link. Earn 1% of every investment your referrals make.</p>
        {code ? (
          <>
            <div className='db-code'>{link}</div>
            <button onClick={copy} className='db-btn db-btn--g'>
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy link'}
            </button>
          </>
        ) : (
          <div className='db-dash'>Your referral code will appear once your KYC is approved.</div>
        )}
      </div>

      <div className='db-card'>
        <div className='db-card-head'>
          <div className='db-ic'><Megaphone size={18} /></div>
          <h2>Notifications</h2>
        </div>
        <a href='#/notifications' className='db-btn db-btn--g'>View all notifications →</a>
      </div>
    </div>
  );
}