import { Link } from 'react-router-dom';
import { useKyc } from '@/hooks/useKyc';

export default function KycBanner() {
  const { profile, loading } = useKyc();
  if (loading || !profile) return null;
  if (profile.status === 'APPROVED') return null;

  const map = {
    NOT_STARTED: { bg: 'color-mix(in srgb, var(--bv-warning, #f59e0b) 15%, var(--bv-bg-elevated))', border: 'color-mix(in srgb, var(--bv-warning, #f59e0b) 40%, var(--bv-bg-elevated))', color: 'var(--bv-warning-text, #fbbf24)', title: 'Complete KYC to invest', cta: 'Start KYC', to: '/kyc' },
    PENDING: { bg: 'color-mix(in srgb, var(--bv-warning, #f59e0b) 15%, var(--bv-bg-elevated))', border: 'color-mix(in srgb, var(--bv-warning, #f59e0b) 40%, var(--bv-bg-elevated))', color: 'var(--bv-warning-text, #fbbf24)', title: 'Complete KYC to invest', cta: 'Continue KYC', to: '/kyc' },
    UNDER_REVIEW: { bg: 'color-mix(in srgb, var(--bv-info, var(--bv-info)) 15%, var(--bv-bg-elevated))', border: 'color-mix(in srgb, var(--bv-info, var(--bv-info)) 40%, var(--bv-bg-elevated))', color: 'var(--bv-info-text, #60a5fa)', title: 'KYC under review', cta: 'View status', to: '/kyc/review' },
    REJECTED: { bg: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))', border: 'color-mix(in srgb, var(--bv-danger) 40%, var(--bv-bg-elevated))', color: 'var(--bv-danger)', title: 'KYC rejected — action needed', cta: 'Review', to: '/kyc/review' },
    EXPIRED: { bg: 'var(--bv-surface)', border: 'var(--bv-border)', color: 'var(--bv-text)', title: 'KYC expired', cta: 'Re-verify', to: '/kyc/review' },
  };
  const cfg = map[profile.status] ?? map.NOT_STARTED;

  return (
    <div style={{
      padding: '14px 18px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 12,
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      <span style={{ color: cfg.color, fontSize: 14, fontWeight: 600 }}>{cfg.title}</span>
      <Link to={cfg.to} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
        {cfg.cta}
      </Link>
    </div>
  );
}
