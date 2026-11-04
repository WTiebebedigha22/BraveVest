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
          background: '#fff',
          border: '1px solid #e3e3e3',
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
            <span style={{ color: '#1b5e20', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>
              {Number(request.proposedReturnPct).toFixed(1)}%
            </span>
          )}
        </div>

        {request.summary && (
          <p style={{ margin: 0, color: '#666', fontSize: 14, lineHeight: 1.5 }}>{request.summary}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
          <span>{request.category?.replace('_', ' ')}</span>
          <span>{request.durationMonths ? `${request.durationMonths}mo` : ''}</span>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 6 }}>
            <span>{fmt(request.amountFunded)} raised</span>
            <span>of {fmt(request.amountRequested)}</span>
          </div>
          <div style={{ height: 6, background: '#eee', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#1b5e20' }} />
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 6, textAlign: 'right' }}>{progress}% funded</div>
        </div>
      </article>
    </Link>
  );
}
