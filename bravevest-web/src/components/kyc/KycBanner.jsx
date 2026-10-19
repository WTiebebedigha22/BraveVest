import { Link } from 'react-router-dom';
import { useKyc } from '@/hooks/useKyc';

export default function KycBanner() {
  const { profile, loading } = useKyc();
  if (loading || !profile) return null;
  if (profile.status === 'APPROVED') return null;

  const map = {
    NOT_STARTED: { bg: '#fff8e1', border: '#ffe082', color: '#8d6e00', title: 'Complete KYC to invest', cta: 'Start KYC', to: '/kyc' },
    PENDING: { bg: '#fff8e1', border: '#ffe082', color: '#8d6e00', title: 'Complete KYC to invest', cta: 'Continue KYC', to: '/kyc' },
    UNDER_REVIEW: { bg: '#e3f2fd', border: '#90caf9', color: '#0d47a1', title: 'KYC under review', cta: 'View status', to: '/kyc/review' },
    REJECTED: { bg: '#ffebee', border: '#ffcdd2', color: '#b71c1c', title: 'KYC rejected — action needed', cta: 'Review', to: '/kyc/review' },
    EXPIRED: { bg: '#f5f5f5', border: '#e0e0e0', color: '#333', title: 'KYC expired', cta: 'Re-verify', to: '/kyc/review' },
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
