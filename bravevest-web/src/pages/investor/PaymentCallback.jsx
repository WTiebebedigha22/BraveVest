import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)', accent: 'var(--bv-accent)', positive: '#0ECB81', negative: '#F6465D',
};

export default function PaymentCallback() {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const reference = params.get('reference') || params.get('trxref');
        if (!reference) throw new Error('No payment reference found.');
        const data = await apiFetch(`/payments/verify/${encodeURIComponent(reference)}`);
        if (!data?.success) {
          throw new Error(data?.message || 'Could not verify payment.');
        }
        if (!cancelled) setStatus('success');
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Payment verification failed.');
          setStatus('failed');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PortalLayout theme="dark">
      <div style={{ padding: '48px 20px', maxWidth: 480, margin: '0 auto', color: COLORS.text, textAlign: 'center' }}>
      {status === 'verifying' && (
        <>
          <Loader2 size={40} color={COLORS.accent} style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Verifying payment…</h1>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Please do not close this page.</p>
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle size={48} color={COLORS.positive} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Payment successful</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Your wallet has been funded.</p>
          <Link to="/wallet" style={{ display: 'inline-block', padding: '12px 20px', background: COLORS.accent, color: 'var(--bv-bg-elevated)', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
            Back to wallet
          </Link>
        </>
      )}
      {status === 'failed' && (
        <>
          <AlertCircle size={48} color={COLORS.negative} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Payment failed</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>{error}</p>
          <Link to="/deposit" style={{ display: 'inline-block', padding: '12px 20px', background: COLORS.accent, color: 'var(--bv-bg-elevated)', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
            Try again
          </Link>
        </>
      )}
    </div>
    </PortalLayout>
  );
}
