import { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminFundingReview() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi.fundingReview().then(r => setItems(r || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function approve(id) {
    if (!confirm('Publish this funding request?')) return;
    await adminApi.fundingApprove(id);
    load();
  }
  async function reject(id) {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    await adminApi.fundingReject(id, reason);
    load();
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ margin: 0, fontSize: '24px', marginBottom: '4px' }}>Funding Review Queue</h1>
        <p style={{ color: 'var(--bybit-text-muted)', margin: '0 0 24px', fontSize: '13px' }}>{items.length} pending requests</p>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Queue empty — no pending funding requests</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {items.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{r.title}</h3>
                  <span className="pill">{r.category}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', marginBottom: '12px' }}>{r.summary}</p>
                <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>
                  <span><strong style={{ color: 'var(--bybit-text)' }}>{format(r.amountRequested)}</strong> requested</span>
                  <span>{r.proposedReturnPct}% return</span>
                  <span>{r.durationMonths}mo</span>
                  <span>{r.borrower?.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => approve(r.id)} className="btn btn--primary btn--sm">Approve</button>
                  <button onClick={() => reject(r.id)} className="btn btn--outline btn--sm" style={{ borderColor: 'var(--bybit-red)', color: 'var(--bybit-red)' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
