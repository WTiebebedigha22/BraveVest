import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet as WalletIcon, ArrowRightLeft, Download } from 'lucide-react';
import { walletApi } from '@/api/wallet';
import { useCurrency } from '@/context/CurrencyContext';

const TX_TYPES = {
  deposit: { label: 'Deposit', color: '#0ECB81', icon: ArrowDownRight },
  withdrawal: { label: 'Withdrawal', color: '#F6465D', icon: ArrowUpRight },
  investment: { label: 'Investment', color: '#F6A500', icon: ArrowRightLeft },
  return: { label: 'Return', color: '#0ECB81', icon: ArrowDownRight },
  fee: { label: 'Fee', color: '#888', icon: ArrowUpRight },
};

export default function Wallet() {
  const { format } = useCurrency();
  const [data, setData] = useState({ balance: 0, held: 0, ledger: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      walletApi.get().catch(() => ({ balance: 0, held: 0 })),
      walletApi.ledger(50).catch(() => []),
    ]).then(([w, l]) => {
      setData({ balance: w?.balance || 0, held: w?.held || 0, ledger: l || [] });
    }).finally(() => setLoading(false));
  }, []);

  const filteredLedger = filter === 'all'
    ? data.ledger
    : data.ledger.filter(tx => tx.type === filter);

  const total = data.balance + data.held;

  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA', paddingBottom: '64px' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Account</span>
              <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', margin: '8px 0 4px' }}>Wallet</h1>
              <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>Your cash position and full transaction ledger.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/wallet/deposit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#F6A500', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                <ArrowDownRight size={16} /> Deposit
              </Link>
              <Link to="/wallet/withdraw" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#fff', color: '#111', border: '1px solid #EAEAEA', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                <ArrowUpRight size={16} /> Withdraw
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Balances */}
      <div className="container" style={{ maxWidth: '1200px', paddingTop: '32px' }}>
        <div className="grid-3" style={{ marginBottom: '32px' }}>

          {/* Total Balance */}
          <div style={{ padding: '28px', background: 'linear-gradient(135deg, #111 0%, #1A1A1A 100%)', borderRadius: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #F6A500, transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              <WalletIcon size={14} /> Total Balance
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {loading ? '—' : format(total)}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Available + Held</div>
          </div>

          {/* Available */}
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Available
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111' }}>
              {loading ? '—' : format(data.balance)}
            </div>
            <div style={{ fontSize: '13px', color: '#0ECB81', marginTop: '8px', fontWeight: '500' }}>Ready to deploy</div>
          </div>

          {/* Held */}
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Held in Escrow
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#F6A500' }}>
              {loading ? '—' : format(data.held)}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>Committed to pending investments</div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: 0 }}>Transaction Ledger</h3>
            <span style={{ background: '#F5F5F5', color: '#666', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
              {data.ledger.length}
            </span>
          </div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'withdrawal', label: 'Withdrawals' },
            { id: 'investment', label: 'Investments' },
            { id: 'return', label: 'Returns' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                border: 'none',
                background: filter === f.id ? 'rgba(246,165,0,0.1)' : '#F5F5F5',
                color: filter === f.id ? '#F6A500' : '#666',
                fontFamily: 'inherit',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>Loading transactions…</div>
          ) : filteredLedger.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <WalletIcon size={32} color="#CCC" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                {data.ledger.length === 0 ? 'No transactions yet' : 'No matching transactions'}
              </h4>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                {data.ledger.length === 0 ? 'Your ledger will populate once you make your first deposit.' : 'Try a different filter.'}
              </p>
              {data.ledger.length === 0 && (
                <Link to="/wallet/deposit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                  Make a Deposit
                </Link>
              )}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Date', 'Type', 'Reference', 'Description', 'Amount', 'Balance'].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 4 ? 'right' : 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #EAEAEA' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((tx) => {
                  const meta = TX_TYPES[tx.type] || { label: tx.type, color: '#888', icon: ArrowRightLeft };
                  const Icon = meta.icon;
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#666' }}>
                        {new Date(tx.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: `${meta.color}15`, color: meta.color, borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                          <Icon size={12} /> {meta.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#666' }}>
                        {tx.reference || '—'}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#666' }}>
                        {tx.description || '—'}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', textAlign: 'right', color: tx.direction === 'credit' ? '#0ECB81' : '#111' }}>
                        {tx.direction === 'credit' ? '+' : '−'}{format(tx.amount)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', textAlign: 'right', color: '#666', fontFamily: 'monospace' }}>
                        {tx.balanceAfter != null ? format(tx.balanceAfter) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}