import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Download, FileText } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { downloadCSV, getQuarterRange } from '@/utils/exportReports';

export default function Dashboard() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [portfolio, setPortfolio] = useState({ totalInvested: 0, currentValue: 0, totalReturns: 0, items: [] });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/wallet').then(r => r.data?.data || {}).catch(() => ({})),
      api.get('/api/investments/portfolio').then(r => r.data?.data || {}).catch(() => ({})),
      api.get('/api/wallet/ledger', { params: { limit: 10 } }).then(r => r.data?.data || []).catch(() => []),
    ]).then(([w, p, l]) => {
      setWallet(w);
      setPortfolio({
        totalInvested: p.totalInvested || 0,
        currentValue: p.currentValue || 0,
        totalReturns: p.totalReturns || 0,
        items: p.items || [],
      });
      setRecent(l);
    }).finally(() => setLoading(false));
  }, []);

  function exportQuarter() {
    const { start, end, label } = getQuarterRange();
    const inRange = recent.filter(tx => {
      const d = new Date(tx.createdAt);
      return d >= start && d <= end;
    });
    const rows = inRange.map(tx => ({
      Date: new Date(tx.createdAt).toISOString().slice(0, 10),
      Type: tx.type,
      Reference: tx.reference,
      Amount: tx.amount,
      Direction: tx.direction,
      Description: tx.description || '',
    }));
    downloadCSV(`bravevest-statement-${label}.csv`, rows);
  }

  const pnl = portfolio.currentValue - portfolio.totalInvested;
  const pnlPct = portfolio.totalInvested > 0 ? (pnl / portfolio.totalInvested) * 100 : 0;

  return (
    <div style={{ padding: '24px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Portfolio</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>
              {user?.firstName || 'Investor'} · {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={exportQuarter} className="btn btn--outline btn--sm"><Download size={14} /> Quarterly Report</button>
            <Link to="/marketplace" className="btn btn--primary btn--sm">Invest</Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid-4" style={{ marginBottom: '16px' }}>
          <KPI label="Portfolio Value" value={loading ? '—' : format(portfolio.currentValue)} hint="Current market value" />
          <KPI label="Total Deployed" value={loading ? '—' : format(portfolio.totalInvested)} hint="Capital invested" />
          <KPI label="Unrealised P&L" value={loading ? '—' : format(pnl)} hint={loading ? '' : `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`} positive={pnl >= 0} />
          <KPI label="Available Cash" value={loading ? '—' : format(wallet.balance)} hint="Ready to deploy" highlight />
        </div>

        {/* Holdings table */}
        <div className="card" style={{ padding: 0, marginBottom: '16px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bybit-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Open Holdings</h3>
            <Link to="/portfolio" style={{ fontSize: '12px', color: 'var(--bybit-orange)' }}>View all</Link>
          </div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>
          ) : portfolio.items.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <FileText size={32} color="var(--bybit-text-dim)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No open holdings yet.</p>
              <Link to="/marketplace" className="btn btn--outline btn--sm">Browse markets</Link>
            </div>
          ) : (
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th style={{ textAlign: 'right' }}>Invested</th>
                  <th style={{ textAlign: 'right' }}>Current</th>
                  <th style={{ textAlign: 'right' }}>Return</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.items.slice(0, 5).map(it => {
                  const ret = it.amount > 0 ? ((it.currentValue - it.amount) / it.amount) * 100 : 0;
                  return (
                    <tr key={it.id}>
                      <td style={{ fontWeight: '600' }}>{it.projectTitle}</td>
                      <td className="num">{format(it.amount)}</td>
                      <td className="num">{format(it.currentValue)}</td>
                      <td className={`num ${ret >= 0 ? 'positive' : 'negative'}`}>
                        {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent activity */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bybit-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Transactions</h3>
            <Link to="/wallet" style={{ fontSize: '12px', color: 'var(--bybit-orange)' }}>View ledger</Link>
          </div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>
          ) : recent.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>No transactions yet.</div>
          ) : (
            <table className="fin-table">
              <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
              <tbody>
                {recent.slice(0, 5).map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                    <td className="data-mono" style={{ fontSize: '12px' }}>{tx.reference}</td>
                    <td className={`num ${tx.direction === 'credit' ? 'positive' : 'negative'}`}>
                      {tx.direction === 'credit' ? '+' : '−'}{format(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, hint, positive, highlight }) {
  return (
    <div className="card" style={{ padding: '16px' }}>
      <div className="data-label" style={{ fontSize: '10px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: highlight ? 'var(--bybit-orange)' : 'var(--bybit-text)' }}>{value}</div>
      {hint && (
        <div style={{ fontSize: '11px', color: positive === undefined ? 'var(--bybit-text-muted)' : positive ? 'var(--bybit-green)' : 'var(--bybit-red)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {positive !== undefined && (positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />)}
          {hint}
        </div>
      )}
    </div>
  );
}
