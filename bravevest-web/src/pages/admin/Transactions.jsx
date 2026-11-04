import { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { useCurrency } from '@/context/CurrencyContext';

const TABS = ['ALL', 'SUCCESS', 'PENDING', 'FAILED'];

export default function AdminTransactions() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (tab !== 'ALL') params.status = tab;
    adminApi.transactions(params).then(r => setItems(r || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [tab]);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ margin: 0, fontSize: '24px', marginBottom: '4px' }}>Transactions</h1>
        <p style={{ color: 'var(--bybit-text-muted)', margin: '0 0 24px', fontSize: '13px' }}>{items.length} records</p>

        <div className="bybit-tabs" style={{ marginBottom: '16px' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={'bybit-tabs__item ' + (tab === t ? 'active' : '')}>{t}</button>
          ))}
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead><tr><th>Reference</th><th>User</th><th>Type</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {items.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{tx.reference}</td>
                    <td style={{ fontSize: '12px' }}>{tx.user?.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                    <td><span className={'pill ' + (tx.status === 'SUCCESS' ? 'pill--green' : tx.status === 'FAILED' ? 'pill--red' : '')}>{tx.status}</span></td>
                    <td className="num">{format(tx.amount)}</td>
                    <td style={{ color: 'var(--bybit-text-muted)' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
