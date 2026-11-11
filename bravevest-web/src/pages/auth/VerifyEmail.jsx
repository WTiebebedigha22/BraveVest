import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Globe, ArrowLeft, MailCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { ThemeLogo } from '@/components/shared/ThemeLogo';


export default function VerifyEmail() {
  const [params] = useSearchParams();
  const emailParam = params.get('email') || '';
  const tokenParam = params.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [notice, setNotice] = useState('');

  // Countdown timer for resending email
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function handleResend() {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setNotice('');

    try {
      // API call placeholder for when verification is active
      await new Promise((resolve) => setTimeout(resolve, 800));
      setResendCooldown(60);
      setNotice('A new verification link has been dispatched to your email.');
    } catch {
      setNotice('Failed to send verification link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bv-bg)', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .auth-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          background: linear-gradient(135deg, rgba(11, 15, 25, 0.85) 0%, rgba(11, 15, 25, 0.7) 100%), url('watermarked_img_10228335117829985453.jpg') center/cover no-repeat;
          position: relative;
          overflow: hidden;
        }

        .auth-right-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bv-bg);
          padding: 40px 24px;
        }

        @media (max-width: 900px) {
          .auth-left-promo {
            display: none;
          }
          .auth-right-container {
            flex: 1;
            width: 100%;
          }
        }
      `}</style>

      {/* ── Left Promo Section with Security Visual & High-Contrast Text ── */}
      <div className="auth-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(246, 165, 0, 0.25)', color: '#FFB81C', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '20px', backdropFilter: 'blur(6px)', border: '1px solid rgba(246, 165, 0, 0.3)' }}>
            ENTERPRISE-GRADE SECURITY
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: 'var(--bv-bg-elevated)', lineHeight: 1.2, letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            Verify your email<br />to secure your account.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--bv-text)', marginTop: '16px', maxWidth: '400px', lineHeight: 1.6, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Confirm your identity to unlock investments, portfolio tracking, and instant transfers.
          </p>
        </div>

        {/* Bottom Stats Strip */}
        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '28px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--bv-bg-elevated)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>₦184B+</div>
            <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--bv-bg-elevated)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>52,000+</div>
            <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Active Investors</div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Section ── */}
      <div className="auth-right-container">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Header & Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <ThemeLogo height={36} alt="BraveVest Logo" />
            </Link>
            <button
              type="button"
              aria-label="Change language"
              style={{ background: 'none', border: 'none', color: 'var(--bv-text)', cursor: 'pointer', padding: '8px' }}
            >
              <Globe size={20} />
            </button>
          </div>

          {/* Verification Card */}
          <div style={{ background: 'var(--bv-bg-elevated)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid var(--bv-border)', textAlign: 'center' }}>
            
            {/* Status Icon */}
            <div style={{ width: '64px', height: '64px', background: 'rgba(246,165,0,0.1)', color: 'var(--bv-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <MailCheck size={32} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>
              Email verification
            </h2>
            
            <p style={{ fontSize: '14px', color: 'var(--bv-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {emailParam ? (
                <>We sent a verification link to <strong style={{ color: 'var(--bv-text)' }}>{emailParam}</strong>.</>
              ) : (
                <>Email verification is currently optional during this preview release.</>
              )}
            </p>

            {/* MVP Status Banner */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: 'var(--bv-surface)', border: '1px solid var(--bv-border)5', borderRadius: '8px', textAlign: 'left', marginBottom: '24px' }}>
              <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.4 }}>
                <strong>MVP Status:</strong> Strict email verification enforcement is disabled in this environment. You can proceed directly to your account.
              </div>
            </div>

            {/* Primary Action Button */}
            <Link
              to="/dashboard"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                background: 'var(--bv-accent)',
                color: 'var(--bv-bg-elevated)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            >
              Continue to Dashboard
            </Link>

            {/* Resend Link Action */}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bv-bg-elevated)',
                color: 'var(--bv-text)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: resendCooldown > 0 || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                fontFamily: 'inherit',
                opacity: resendCooldown > 0 || loading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend verification email'}
            </button>

            {/* Feedback Message */}
            {notice && (
              <div style={{ fontSize: '13px', color: '#0ECB81', marginBottom: '16px' }}>
                {notice}
              </div>
            )}

            {/* Return Navigation */}
            <div style={{ borderTop: '1px solid var(--bv-border)', paddingTop: '20px' }}>
              <Link to="/login" style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>

          {/* Legal / Support Link */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--bv-text-muted)', marginTop: '24px', lineHeight: 1.6 }}>
            Having trouble? Contact <a href="mailto:support@bravevest.com" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Support</a>
          </p>

        </div>
      </div>

    </div>
  );
}