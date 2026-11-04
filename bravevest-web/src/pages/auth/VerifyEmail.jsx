import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Globe, ArrowLeft, MailCheck, RefreshCw, AlertCircle } from 'lucide-react';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F7F7', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .auth-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 64px;
          background: linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%);
          position: relative;
          overflow: hidden;
        }

        .auth-right-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F7F7F7;
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

      {/* ── Left Promo Section ── */}
      <div className="auth-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: 'var(--bv-text)', lineHeight: 1.3 }}>
            Verify your email<br />to secure your account.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Confirm your identity to unlock investments, portfolio tracking, and instant transfers.
          </p>
        </div>

        {/* Abstract Card Stack Visual */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '60%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <div style={{ position: 'absolute', width: '280px', height: '180px', background: '#E0E0E0', borderRadius: '12px', transform: 'rotate(-15deg) translateY(-60px) translateX(-20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #D0D0D0' }} />
          <div style={{ position: 'absolute', width: '280px', height: '180px', background: '#F5F5F5', borderRadius: '12px', transform: 'rotate(-5deg) translateY(-20px) translateX(10px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', border: '1px solid #D0D0D0' }} />
          <div
            style={{
              position: 'absolute',
              width: '280px',
              height: '180px',
              background: 'linear-gradient(135deg, #F6A500 0%, #E09000 100%)',
              borderRadius: '12px',
              transform: 'rotate(5deg) translateY(20px) translateX(-10px)',
              boxShadow: '0 15px 30px rgba(246, 165, 0, 0.3)',
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'var(--bv-surface)', borderRadius: '50%', margin: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#F6A500', fontSize: '18px' }}>B</span>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'var(--bv-surface)', fontSize: '11px', letterSpacing: '2px', fontWeight: '600', opacity: 0.85 }}>
              BRAVEVEST
            </div>
          </div>
        </div>

        {/* Bottom Stats Strip */}
        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--bv-text)' }}>₦184B+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--bv-text)' }}>52,000+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Active Investors</div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Section ── */}
      <div className="auth-right-container">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Header & Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <img
                src="/icons/logo-light.png"
                alt="BraveVest Logo"
                style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
              />
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
          <div style={{ background: 'var(--bv-surface)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA', textAlign: 'center' }}>
            
            {/* Status Icon */}
            <div style={{ width: '64px', height: '64px', background: 'rgba(246,165,0,0.1)', color: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <MailCheck size={32} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>
              Email verification
            </h2>
            
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
              {emailParam ? (
                <>We sent a verification link to <strong style={{ color: 'var(--bv-text)' }}>{emailParam}</strong>.</>
              ) : (
                <>Email verification is currently optional during this preview release.</>
              )}
            </p>

            {/* MVP Status Banner */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: '#FFF9EB', border: '1px solid #FBE8B5', borderRadius: '8px', textAlign: 'left', marginBottom: '24px' }}>
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
                background: '#F6A500',
                color: 'var(--bv-surface)',
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
                background: '#F5F5F5',
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
            <div style={{ borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <Link to="/login" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>

          {/* Legal / Support Link */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            Having trouble? Contact <a href="mailto:support@bravevest.com" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Support</a>
          </p>

        </div>
      </div>

    </div>
  );
}