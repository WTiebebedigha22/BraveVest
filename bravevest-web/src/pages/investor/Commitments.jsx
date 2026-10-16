import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commitmentsApi } from '../../api/commitments';

function fmt(n, currency = 'NGN') {
  return `${currency} ${Number(n || 0).toLocaleString()}`;
}

export default function Commitments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function reload() {
    setLoading(true);
    commitmentsApi.mine()
      .then((r) => setItems(r.data ?? r ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }
  useEffect(reload, []);

  const total = items.reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>My commitments</h1>
      <p style={{ color: '#666' }}>Funding requests you’ve backed.</p>

      <div style={{ display: 'flex', gap: 16, margin: '20px 0' }}>
        <Stat label="Total committed" value={fmt(total)} />
        <Stat label="Active" value={items.filter((c) => c.status === 'CONFIRMED').length} />
      </div>

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: '#b71c1c' }}>{error.message}</div>}
      {!loading && items.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>
          No commitments yet. <Link to="/funding" style={{ color: '#1b5e20' }}>Browse opportunities</Link>.
        </div>
      )}

      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {items.map((c) => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: 20, border: '1px solid #e3e3e3', borderRadius: 14, background: '#fff', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <Link to={`/funding/${c.request?.id}`} style={{ color: 'inherit', fontWeight: 600 }}>
                {c.request?.title ?? 'Request'}
              </Link>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                {fmt(c.amount, c.currency)} · {c.status} · request {c.request?.status}
              </div>
            </div>
            <div style={{ fontVariantNumeric: 'tabular-nums', color: '#555' }}>
              {c.request?.proposedReturnPct != null && <>{Number(c.request.proposedReturnPct).toFixed(1)}%</>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: '16px 20px', border: '1px solid #e3e3e3', borderRadius: 12, background: '#fafafa', minWidth: 160 }}>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
