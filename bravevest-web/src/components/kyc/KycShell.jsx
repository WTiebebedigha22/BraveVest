import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKyc } from '@/hooks/useKyc';
import KycStepper from './KycStepper';

export default function KycShell({ step, title, subtitle, children }) {
  const navigate = useNavigate();
  const { profile, loading } = useKyc();

  useEffect(() => {
    if (loading) return;
    if (profile?.status === 'APPROVED') navigate('/dashboard');
    else if (profile?.status === 'UNDER_REVIEW') navigate('/kyc/review');
  }, [profile, loading, navigate]);

  if (loading) {
    return <div style={{ padding: 80, textAlign: 'center', color: '#666' }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: '#666', marginTop: 6 }}>{subtitle}</p>}
      </div>
      <KycStepper current={step} />
      {children}
    </div>
  );
}
