import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fundingApi } from '../../api/funding';
import StatusBadge from '../../components/funding/StatusBadge';

function fmt(n, currency = 'NGN') {
  return Number(n || 0).toLocaleString();
}

export default function FundingMine() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function reload() {
    setLoading(true);
    fundingApi.mine()
      .then((r) => setItems(r.data ?? r ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function submit(id) {
    try { await fundingApi.submit(id); reload(); }
    catch (e) { alert(e?.response?.data?.message || e.message); }
  }

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>My credit requests</h1>
        <Link to="/funding/new" className="btn btn-primary">Request funding</Link>
      </div>

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: '#b71c1c' }}>{error.message}</div>}
      {!loading && items.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>
          No credit requests yet. <Link to="/funding/new" style={{ color: '#1b5e20' }}>Request funding</Link>.
        </div>
      )}

      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              border: '1px solid #e3e3e3',
              borderRadius: 14,
              background: '#fff',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to={`/funding/${it.id}`} style={{ color: 'inherit', fontWeight: 600 }}>{it.title}</Link>
                <StatusBadge status={it.status} />
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                {fmt(it.amountRequested)} · {it.category?.replace('_', ' ')} · {it.durationMonths ? `${it.durationMonths}mo` : '—'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {it.status === 'DRAFT' && (
                <button onClick={() => submit(it.id)} className="btn btn-primary">Submit for review</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
