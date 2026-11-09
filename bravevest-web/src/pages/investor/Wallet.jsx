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
        if (!cancelled) setBalance(data?.balance ?? 0);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load wallet.');
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

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 24px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Wallet
          </h1>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto' }}>
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 18px',
                    background: active ? 'var(--surface)' : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    border: '1px solid ' + (active ? 'var(--border)' : 'transparent'),
                    borderBottom: '1px solid ' + (active ? 'var(--surface)' : 'transparent'),
                    borderRadius: '10px 10px 0 0',
                    marginBottom: -1,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                  }}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>

          {error && (
            <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12, marginBottom: 24 }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div style={{ padding: 32, background: 'linear-gradient(135deg, var(--surface) 0%, rgba(246,165,0,0.05) 100%)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <WalletIcon size={20} />
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available balance</span>
                </div>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                  {loading ? '—' : format(balance)}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={() => setTab('deposit')} className='bv-pill bv-pill--primary'>
                    <ArrowDownLeft size={16} /> Deposit
                  </button>
                  <button onClick={() => setTab('withdraw')} className='bv-pill bv-pill--ghost'>
                    <ArrowUpRight size={16} /> Withdraw
                  </button>
                  <button onClick={() => setTab('transfer')} className='bv-pill bv-pill--ghost'>
                    <Send size={16} /> Transfer
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Recent transactions</h2>
                  <button onClick={() => setTab('history')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    View all →
                  </button>
                </div>
                <div style={{ padding: 32, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text-muted)', fontSize: 14 }}>
                  Switch to the History tab to see full ledger.
                </div>
              </div>
            </>
          )}

          {/* Embedded tabs — no PortalLayout rendered inside */}
          {activeTab === 'deposit' && <Deposit embedded />}
          {activeTab === 'withdraw' && <Withdraw embedded />}
          {activeTab === 'transfer' && <Transfer embedded />}
          {activeTab === 'history' && <Statement embedded />}
        </div>
      </section>
    </PortalLayout>
  );
}
