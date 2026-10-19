import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fundingApi } from '../../api/funding';
import StatusBadge from '../../components/funding/StatusBadge';

function fmt(n, currency = 'NGN') {
  return {format(Number(n || 0).toLocaleString())};
}

export default function AdminReview() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectFor, setRejectFor] = useState(null);
  const [reason, setReason] = useState('');

  function reload() {
    setLoading(true);
    fundingApi.reviewQueue()
      .then((r) => setItems(r.data ?? r ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function approve(id) {
    try { await fundingApi.approve(id); reload(); }
    catch (e) { alert(e?.response?.data?.message || e.message); }
  }

  async function reject() {
    if (!reason.trim() || reason.trim().length < 3) return;
    try {
      await fundingApi.reject(rejectFor, reason.trim());
      setRejectFor(null); setReason('');
      reload();
    } catch (e) { alert(e?.response?.data?.message || e.message); }
  }

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Review queue</h1>
      <p style={{ color: '#666' }}>Credit requests awaiting approval.</p>

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: '#b71c1c' }}>{error.message}</div>}
      {!loading && items.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Queue is empty.</div>
      )}

      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {items.map((it) => (
          <div key={it.id} style={{ padding: 20, border: '1px solid #e3e3e3', borderRadius: 14, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/funding/${it.id}`} style={{ color: 'inherit', fontWeight: 600 }}>{it.title}</Link>
                  <StatusBadge status={it.status} />
                </div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
                  {it.borrower?.email} · {fmt(it.amountRequested)} · {it.category?.replace('_', ' ')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-primary" onClick={() => approve(it.id)}>Approve</button>
                <button
                  className="btn"
                  style={{ border: '1px solid #b71c1c', color: '#b71c1c', background: '#fff' }}
                  onClick={() => { setRejectFor(it.id); setReason(''); }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rejectFor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%' }}>
            <h3 style={{ marginTop: 0 }}>Reject request</h3>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (visible to the borrower)"
              style={{ width: '100%', padding: 12, border: '1px solid #e3e3e3', borderRadius: 10, fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn" onClick={() => setRejectFor(null)}>Cancel</button>
              <button className="btn" style={{ background: '#b71c1c', color: '#fff' }} onClick={reject}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
