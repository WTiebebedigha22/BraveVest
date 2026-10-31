import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { ArrowUpRight, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [portfolio, setPortfolio] = useState({ totalInvested: 0, currentValue: 0, yieldEarned: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/wallet').then(r => r.data?.data || {}).catch(() => ({})),
      api.get('/api/investments/portfolio').then(r => r.data?.data || {}).catch(() => ({})),
      api.get('/api/wallet/ledger', { params: { limit: 5 } }).then(r => r.data?.data || []).catch(() => []),
    ]).then(([w, p, l]) => { setWallet(w); setPortfolio(p); setRecent(l); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-light" style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111' }}>Portfolio Overview</h1>
            <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>Welcome back, {user?.firstName || 'Investor'}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/wallet/deposit" className="btn btn--outline">Deposit</Link>
            <Link to="/marketplace" className="btn btn--primary">Invest Now</Link>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <div className="wallet-card" style={{ background: 'linear-gradient(135deg, rgba(246,165,0,0.05) 0%, #fff 100%)', borderColor: 'rgba(246,165,0,0.3)' }}>
            <div className="data-label" style={{ color: 'var(--bybit-orange)' }}>Total Portfolio Value</div>
            <div className="data-value" style={{ marginTop: '8px', fontSize: '32px', color: '#111' }}>{loading ? '—' : format(portfolio.currentValue)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '13px', color: '#0ECB81' }}>
              <ArrowUpRight size={14} /> +₦4,200 (1.2%) this month
            </div>
          </div>
          
          <div className="wallet-card">
            <div className="data-label">Capital Deployed</div>
            <div className="data-value" style={{ marginTop: '8px', fontSize: '28px', color: '#111' }}>{loading ? '—' : format(portfolio.totalInvested)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '13px', color: '#666' }}>
              Across 4 active projects
            </div>
          </div>
          
          <div className="wallet-card">
            <div className="data-label">Yield Earned</div>
            <div className="data-value" style={{ marginTop: '8px', fontSize: '28px', color: '#0ECB81' }}>{loading ? '—' : format(portfolio.yieldEarned || 0)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '13px', color: '#666' }}>
              Paid out to date
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Activity Table */}
          <div className="wallet-card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EAEAEA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#111' }}>Recent Activity</h3>
              <Link to="/wallet" style={{ fontSize: '12px', color: '#F6A500', fontWeight: '600' }}>View all</Link>
            </div>
            {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading…</div> : recent.length === 0 ? <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No activity yet.</div> : (
              <table className="light-table">
                <thead><tr><th>Date</th><th>Type</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>
                  {recent.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                      <td style={{ textAlign: 'right', color: tx.direction === 'credit' ? '#0ECB81' : '#111', fontWeight: '500' }}>
                        {tx.direction === 'credit' ? '+' : '−'}{format(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick Actions */}
          <div className="wallet-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#111' }}>Available Cash</h3>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#F6A500' }}>{loading ? '—' : format(wallet.balance)}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <Link to="/wallet/deposit" className="btn btn--primary" style={{ flex: 1 }}><Wallet size={16} /> Deposit</Link>
              <Link to="/wallet/withdraw" className="btn btn--outline" style={{ flex: 1 }}>Withdraw</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
