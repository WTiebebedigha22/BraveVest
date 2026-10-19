import React, { useState } from 'react';
import { commitmentsApi } from '../../api/commitments';
import { useKyc } from '@/hooks/useKyc';

function fmt(n, currency = 'NGN') {
  const { profile: kycProfile } = useKyc();
  const kycOk = kycProfile?.status === 'APPROVED';

  return {format(Number(n || 0).toLocaleString())};
}

export default function CommitModal({ request, open, onClose, onCommitted }) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!open || !request) return null;

  const remaining = Number(request.amountRequested) - Number(request.amountFunded);
  const min = request.minCommitment ? Number(request.minCommitment) : 1;
  const max = Math.min(
    Number(request.maxCommitment || Infinity),
    remaining,
  );

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await commitmentsApi.create({ requestId: request.id, amount: Number(amount) });
      onCommitted && onCommitted();
      onClose();
    } catch (err) {
      const d = err?.response?.data;
      setError(d?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 480, width: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Commit to {request.title}</h3>
        <p style={{ color: '#666', fontSize: 14 }}>
          {fmt(remaining, request.currency)} remains · min {fmt(min, request.currency)} · max {fmt(max, request.currency)}
        </p>

        {error && <div style={{ padding: 10, background: '#ffebee', color: '#b71c1c', borderRadius: 8, margin: '12px 0' }}>{error}</div>}

        <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <label>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Amount ({request.currency})</div>
            <input
              required
              type="number"
              min={min}
              max={max}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e3e3e3', borderRadius: 10, fontSize: 15 }}
            />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Committing…' : 'Confirm commitment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
