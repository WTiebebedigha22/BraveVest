import React from 'react';

const COLORS = {
  DRAFT:         { bg: '#eee',   fg: '#555' },
  SUBMITTED:     { bg: '#e3f2fd', fg: '#0d47a1' },
  UNDER_REVIEW:  { bg: '#fff8e1', fg: '#8d6e00' },
  APPROVED:      { bg: '#e8f5e9', fg: '#1b5e20' },
  PUBLISHED:     { bg: '#e8f5e9', fg: '#1b5e20' },
  FUNDED:        { bg: '#c8e6c9', fg: '#1b5e20' },
  CANCELLED:     { bg: '#eceff1', fg: '#455a64' },
  REJECTED:      { bg: '#ffebee', fg: '#b71c1c' },
  DEFAULTED:     { bg: '#ffcdd2', fg: '#b71c1c' },
  CLOSED:        { bg: '#eceff1', fg: '#455a64' },
};

export default function StatusBadge({ status }) {
  const c = COLORS[status] || COLORS.DRAFT;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        backgroundColor: c.bg,
        color: c.fg,
        textTransform: 'uppercase',
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
