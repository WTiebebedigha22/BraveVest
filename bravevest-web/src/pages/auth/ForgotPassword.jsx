import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowLeft, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { authApi } from '@/api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    if (e) e.preventDefault();
    if (!email.trim()) return setError('Please enter your email address.');

    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link. Please try again.');
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

        .auth-input {
          width: 100%;
          padding: 14px 16px;
          background: #F5F5F5;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 15px;
          color: #111;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .auth-input:focus {
          background: #FFFFFF;
          border-color: #F6A500;
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
            Secure & seamless<br />account recovery.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Gain instant access back to your portfolio, returns, and investments.
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

          {/* Form Card */}
          <div style={{ background: 'var(--bv-surface)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA' }}>
            
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(14,203,129,0.1)', color: '#0ECB81', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={28} />
                </div>
                
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>Check your email</h2>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
                  If an account exists for <strong style={{ color: 'var(--bv-text)' }}>{email}</strong>, we sent a password reset link. It expires in 15 minutes.
                </p>

                <button
                  type="button"
                  onClick={() => submit()}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#F5F5F5',
                    color: 'var(--bv-text)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    fontFamily: 'inherit',
                  }}
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  {loading ? 'Resending...' : 'Resend reset link'}
                </button>

                <div style={{ borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
                  <Link to="/login" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to Log In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>Reset password</h2>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5 }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={submit}>
                  <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      autoComplete="email"
                      required
                      className="auth-input"
                      style={{ paddingLeft: '40px' }}
                    />
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div style={{ padding: '10px 12px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#F6A500',
                      color: 'var(--bv-surface)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginBottom: '20px',
                      opacity: loading ? 0.7 : 1,
                      fontFamily: 'inherit',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? 'Sending link…' : 'Send Reset Link'}
                  </button>
                </form>

                {/* Return Navigation */}
                <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
                  <Link to="/login" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to Log In
                  </Link>
                </div>
              </>
            )}

          </div>

          {/* Legal Footnote */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            Need help? Contact <a href="mailto:support@bravevest.com" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Support</a>
          </p>

        </div>
      </div>

    </div>
  );
}