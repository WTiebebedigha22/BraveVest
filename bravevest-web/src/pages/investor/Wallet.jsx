import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, Send, List, AlertCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Transfer from './Transfer';
import Statement from './Statement';

const TABS = [
  { id: 'overview', label: 'Overview', icon: WalletIcon },
  { id: 'deposit', label: 'Deposit', icon: ArrowDownLeft },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { id: 'transfer', label: 'Transfer', icon: Send },
  { id: 'history', label: 'History', icon: List },
];

const CSS = `
.wl { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-red:#D6334B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; min-height:60vh; }
.wl * { box-sizing:border-box; }
.wl-wrap { max-width:1100px; margin:0 auto; padding:0 20px; }
.wl-top { position:relative; overflow:hidden; padding:48px 0 8px; }
.wl-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(520px 260px at 85% 0%, rgba(247,166,0,.2), transparent 70%); }
.wl-top .wl-wrap { position:relative; }
.wl h1 { font-size:clamp(30px,4.2vw,44px); font-weight:800; letter-spacing:-0.035em; margin:0 0 28px; }
.wl-main { padding-bottom:96px; }

.wl-tabs { display:flex; gap:28px; border-bottom:1px solid var(--by-line); margin-bottom:32px; overflow-x:auto; scrollbar-width:none; }
.wl-tabs::-webkit-scrollbar { display:none; }
.wl-tab { position:relative; display:inline-flex; align-items:center; gap:8px; padding:12px 2px 14px; background:none; border:0; color:var(--by-mute); font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; white-space:nowrap; transition:color .15s; }
.wl-tab:hover { color:var(--by-text); }
.wl-tab[aria-selected='true'] { color:var(--by-text); }
.wl-tab[aria-selected='true']::after { content:''; position:absolute; left:0; right:0; bottom:-1px; height:3px; border-radius:3px 3px 0 0; background:var(--by-yellow); }
.wl-tab:focus-visible { outline:2px solid #121214; outline-offset:2px; border-radius:4px; }

.wl-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:46px; padding:0 24px; border-radius:8px; font-size:15px; font-weight:600; font-family:inherit; border:0; cursor:pointer; transition:background .15s, border-color .15s, color .15s; }
.wl-btn--y { background:var(--by-yellow); color:#121214; }
.wl-btn--y:hover { background:#FFB82E; }
.wl-btn--g { background:#fff; color:var(--by-text); border:1px solid var(--by-line); }
.wl-btn--g:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.wl-btn:focus-visible { outline:2px solid #121214; outline-offset:2px; }

.wl-hero { position:relative; overflow:hidden; background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:36px; margin-bottom:40px; }
.wl-hero::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(420px 240px at 100% 0%, rgba(247,166,0,.22), transparent 70%); }
.wl-hero > * { position:relative; }
.wl-lbl { display:flex; align-items:center; gap:10px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:12px; }
.wl-ic { width:34px; height:34px; border-radius:8px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; }
.wl-big { font-size:clamp(38px,6vw,60px); font-weight:800; letter-spacing:-0.04em; line-height:1.1; margin-bottom:28px; font-variant-numeric:tabular-nums; }
.wl-actions { display:flex; gap:10px; flex-wrap:wrap; }

.wl-sechead { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.wl-sechead h2 { font-size:20px; font-weight:800; letter-spacing:-0.02em; margin:0; }
.wl-link { background:none; border:0; color:var(--by-amber); font-weight:600; font-size:14px; font-family:inherit; cursor:pointer; padding:0; }
.wl-link:hover { text-decoration:underline; }
.wl-empty { padding:40px 24px; text-align:center; background:var(--by-card); border-radius:16px; color:var(--by-mute); font-size:14px; }

.wl-err { display:flex; gap:12px; align-items:flex-start; padding:16px; background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); border-radius:12px; color:var(--by-red); font-size:14px; margin-bottom:24px; }
.wl-err svg { flex:none; }
.wl-state { padding:96px 20px; display:flex; align-items:center; justify-content:center; gap:12px; color:var(--by-mute); }
.wl-spin { animation:wl-spin 1s linear infinite; }
@keyframes wl-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .wl-spin { animation:none; } }
@media (max-width:560px) { .wl-hero { padding:24px; } .wl-actions .wl-btn { flex:1; padding:0 12px; } .wl-tabs { gap:20px; } }
`;

export default function Wallet() {
  const { format } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/wallet');
        if (!cancelled) setBalance((data && data.balance) || 0);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load wallet.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab]);

  function setTab(id) {
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    setSearchParams(next);
  }

  if (loading) {
    return (
      <PortalLayout theme="dark">
        <style>{CSS}</style>
        <div className='wl'>
          <div className='wl-state' role='status'>
            <Loader2 size={20} className='wl-spin' /> Loading wallet…
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme="dark">
      <style>{CSS}</style>
      <div className='wl'>
        <section className='wl-top'>
          <div className='wl-glow' aria-hidden='true' />
          <div className='wl-wrap'>
            <h1>Wallet</h1>
            <div className='wl-tabs' role='tablist' aria-label='Wallet sections'>
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type='button'
                    role='tab'
                    className='wl-tab'
                    aria-selected={activeTab === t.id}
                    onClick={() => setTab(t.id)}
                  >
                    <Icon size={16} /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className='wl-wrap wl-main'>
          {error && (
            <div className='wl-err' role='alert'><AlertCircle size={20} /> {error}</div>
          )}

          {activeTab === 'overview' && (
            <>
              <div className='wl-hero'>
                <div className='wl-lbl'>
                  <span className='wl-ic'><WalletIcon size={18} /></span> Available balance
                </div>
                <div className='wl-big'>{format(balance)}</div>
                <div className='wl-actions'>
                  <button type='button' onClick={() => setTab('deposit')} className='wl-btn wl-btn--y'><ArrowDownLeft size={16} /> Deposit</button>
                  <button type='button' onClick={() => setTab('withdraw')} className='wl-btn wl-btn--g'><ArrowUpRight size={16} /> Withdraw</button>
                  <button type='button' onClick={() => setTab('transfer')} className='wl-btn wl-btn--g'><Send size={16} /> Transfer</button>
                </div>
              </div>

              <div className='wl-sechead'>
                <h2>Recent transactions</h2>
                <button type='button' onClick={() => setTab('history')} className='wl-link'>View all →</button>
              </div>
              <div className='wl-empty'>Switch to the History tab to see full ledger.</div>
            </>
          )}

          {activeTab === 'deposit' && <Deposit />}
          {activeTab === 'withdraw' && <Withdraw />}
          {activeTab === 'transfer' && <Transfer />}
          {activeTab === 'history' && <Statement />}
        </div>
      </div>
    </PortalLayout>
  );
}