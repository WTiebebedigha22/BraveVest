import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKyc } from '@/hooks/useKyc';

export default function KycReview() {
  const nav = useNavigate();
  const { profile, loading } = useKyc();

  useEffect(() => {
    if (loading) return;
    if (profile?.status === 'APPROVED') nav('/dashboard');
    else if (profile?.status === 'NOT_STARTED' || profile?.status === 'PENDING') nav('/kyc');
  }, [profile, loading, nav]);

  if (loading || !profile) return <div style={{ padding: 80, textAlign: 'center' }}>Loading…</div>;

  const status = profile.status;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
      {status === 'UNDER_REVIEW' && (
        <>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: '#fff8e1', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>⏳</div>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Under review</h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
            We've received your KYC submission. Our team reviews applications within 1–2 business days.
            You'll get an email as soon as it's approved.
          </p>
          <p style={{ color: '#888', fontSize: 13, marginTop: 24 }}>
            Submitted {profile.submittedAt ? new Date(profile.submittedAt).toLocaleString() : '—'}
          </p>
        </>
      )}

      {status === 'REJECTED' && (
        <>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: '#ffebee', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✕</div>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>KYC not approved</h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
            Your KYC submission was rejected. Review the reason below, update your information, and resubmit.
          </p>
          {profile.rejectionNote && (
            <div style={{ marginTop: 16, padding: 16, background: '#ffebee', borderRadius: 10, color: '#b71c1c', fontSize: 13, textAlign: 'left' }}>
              <strong>Reason:</strong> {profile.rejectionNote}
            </div>
          )}
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => nav('/kyc')}>
            Restart verification
          </button>
        </>
      )}

      {status === 'EXPIRED' && (
        <>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: '#f5f5f5', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>⏱</div>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Verification expired</h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
            Your previous KYC verification has expired. Please complete verification again to continue.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => nav('/kyc')}>
            Re-verify
          </button>
        </>
      )}
    </div>
  );
}
