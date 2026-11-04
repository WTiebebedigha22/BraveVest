import { useState } from 'react';
import { adminApi } from '@/api/admin';
import { useCurrency } from '@/context/CurrencyContext';

const REPORTS = [
  { key: 'kyc', label: 'KYC Report', fetcher: adminApi.reportKyc },
  { key: 'payments', label: 'Payments Report', fetcher: adminApi.reportPayments },
  { key: 'investments', label: 'Investments Report', fetcher: adminApi.reportInvestments },
];

export default function AdminReports() {
  const { format } = useCurrency();
  const [active, setActive] = useState('kyc');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(key) {
    setActive(key);
    setLoading(true);
    const r = REPORTS.find(x => x.key === key);
    try { setData(await r.fetcher({})); }
    catch { setData(null); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ margin: 0, fontSize: '24px', marginBottom: '4px' }}>Reports</h1>
        <p style={{ color: 'var(--bybit-text-muted)', margin: '0 0 24px', fontSize: '13px' }}>Export platform metrics</p>

        <div className="bybit-tabs" style={{ marginBottom: '16px' }}>
          {REPORTS.map(r => (
            <button key={r.key} onClick={() => run(r.key)} className={'bybit-tabs__item ' + (active === r.key ? 'active' : '')}>{r.label}</button>
          ))}
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Generating…</div> : data ? (
          <div className="card">
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(data).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--bybit-border)' }}>
                  <span style={{ textTransform: 'capitalize', color: 'var(--bybit-text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: '600' }}>{typeof v === 'number' && k.toLowerCase().includes('volume') ? format(v) : String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Select a report above</div>}
      </div>
    </div>
  );
}
