import React from 'react';
import { Link } from 'react-router-dom';

function fmt(n, currency = 'NGN') {
  if (n == null) return '—';
  return format(n);
}

export default function FundingCard({ request }) {
  const progress =
    request.amountRequested && request.amountFunded
      ? Math.min(100, Math.round((Number(request.amountFunded) / Number(request.amountRequested)) * 100))
      : 0;

  return (
    <Link to={`/funding/${request.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        style={{
          background: 'var(--bv-surface)',
          border: '1px solid var(--bv-border)',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{request.title}</h3>
          {request.proposedReturnPct != null && (
            <span style={{ color: 'var(--bv-success)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>
              {Number(request.proposedReturnPct).toFixed(1)}%
            </span>
          )}
        </div>

        {request.summary && (
          <p style={{ margin: 0, color: 'var(--bv-text-muted)', fontSize: 14, lineHeight: 1.5 }}>{request.summary}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--bv-text-muted)' }}>
          <span>{request.category?.replace('_', ' ')}</span>
          <span>{request.durationMonths ? `${request.durationMonths}mo` : ''}</span>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-main)', marginBottom: 6 }}>
            <span>{fmt(request.amountFunded)} raised</span>
            <span>of {fmt(request.amountRequested)}</span>
          </div>
          <div style={{ height: 6, background: 'var(--bv-surface)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--bv-success)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginTop: 6, textAlign: 'right' }}>{progress}% funded</div>
        </div>
      </article>
    </Link>
  );
}
