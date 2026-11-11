import React from 'react';

const COLORS = {
  DRAFT:         { bg: 'var(--bv-surface)',   fg: 'var(--bv-text-muted)' },
  SUBMITTED:     { bg: 'color-mix(in srgb, var(--bv-info, var(--bv-info)) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-info-text, #60a5fa)' },
  UNDER_REVIEW:  { bg: 'color-mix(in srgb, var(--bv-warning, #f59e0b) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-warning-text, #fbbf24)' },
  APPROVED:      { bg: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-success)' },
  PUBLISHED:     { bg: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-success)' },
  FUNDED:        { bg: '#c8e6c9', fg: 'var(--bv-success)' },
  CANCELLED:     { bg: 'var(--bv-surface)', fg: 'var(--bv-text-muted)' },
  REJECTED:      { bg: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-danger)' },
  DEFAULTED:     { bg: 'color-mix(in srgb, var(--bv-danger) 40%, var(--bv-bg-elevated))', fg: 'var(--bv-danger)' },
  CLOSED:        { bg: 'var(--bv-surface)', fg: 'var(--bv-text-muted)' },
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
