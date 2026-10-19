import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fundingApi } from '../../api/funding';
import StatusBadge from '../../components/funding/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useKyc } from '@/hooks/useKyc';

function fmt(n, currency = 'NGN') {
  const { profile: kycProfile } = useKyc();
  const kycOk = kycProfile?.status === 'APPROVED';

  if (n == null) return '—';
  return {format(Number(n).toLocaleString())};
}

export default function FundingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fundingApi
      .get(id)
      .then((r) => { if (alive) setReq(r.data ?? r); })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading…</div>;
  if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#b71c1c' }}>{error.message}</div>;
  if (!req) return null;

  const progress = Math.min(100, Math.round((Number(req.amountFunded) / Number(req.amountRequested)) * 100));
  const canCommit = req.status === 'PUBLISHED' && user?.role !== 'BORROWER';

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 880, margin: '0 auto' }}>
      <Link to="/funding" style={{ color: '#1b5e20', fontSize: 14 }}>← Back to opportunities</Link>

      <div style={{ marginTop: 24 }}>
        <StatusBadge status={req.status} />
      </div>

      <h1 style={{ fontSize: 34, margin: '12px 0 8px' }}>{req.title}</h1>
      {req.summary && <p style={{ fontSize: 16, color: '#555', lineHeight: 1.6 }}>{req.summary}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          margin: '24px 0',
          padding: 20,
          background: '#fafafa',
          borderRadius: 16,
          border: '1px solid #eee',
        }}
      >
        <Stat label="Amount requested" value={fmt(req.amountRequested, req.currency)} />
        <Stat label="Return" value={req.proposedReturnPct ? `${Number(req.proposedReturnPct).toFixed(1)}%` : '—'} />
        <Stat label="Term" value={req.durationMonths ? `${req.durationMonths} months` : '—'} />
        <Stat label="Category" value={req.category?.replace('_', ' ')} />
      </div>

      <div style={{ margin: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 6 }}>
          <span>{fmt(req.amountFunded)} funded</span>
          <span>{progress}% of {fmt(req.amountRequested)}</span>
        </div>
        <div style={{ height: 8, background: '#eee', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#1b5e20' }} />
        </div>
      </div>

      {req.description && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20 }}>About this request</h2>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#333' }}>{req.description}</p>
        </section>
      )}

      <div style={{
        marginTop: 24,
        padding: '14px 16px',
        background: '#fafafa',
        border: '1px solid #eee',
        borderRadius: 12,
        fontSize: 13,
        color: '#555',
        lineHeight: 1.6,
      }}>
        <strong>About commitments:</strong> when you commit, you're funding a peer-to-peer loan.
        The borrower receives your capital and repays over the term at the stated return.
        Commitments are recorded on BraveVest and reflected in your portfolio.
      </div>

      {req.minCommitment != null && (
        <div style={{ marginTop: 24, fontSize: 14, color: '#666' }}>
          Minimum commitment: <strong>{fmt(req.minCommitment, req.currency)}</strong>
          {req.maxCommitment ? <> · Maximum: <strong>{fmt(req.maxCommitment, req.currency)}</strong></> : null}
        </div>
      )}

      {canCommit && (
        <div style={{ marginTop: 32 }}>
          <button className="btn btn-primary" disabled style={{ opacity: 0.6 }}>
            Commit (Phase 3)
          </button>
          <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
            Investment commitments arrive in Phase 3.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}
