import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowLeft, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { authApi } from '@/api/auth';
import { ThemeLogo } from '@/components/shared/ThemeLogo';


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

        .auth-input {
          width: 100%;
          padding: 14px 16px;
          background: var(--bv-bg-elevated);
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 15px;
          color: var(--bv-text);
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .auth-input:focus {
          background: var(--bv-bg-elevated);
          border-color: var(--bv-accent);
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
            Secure & seamless<br />account recovery.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--bv-text)', marginTop: '16px', maxWidth: '400px', lineHeight: 1.6, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Gain instant access back to your portfolio, returns, and investments.
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

          {/* Form Card */}
          <div style={{ background: 'var(--bv-bg-elevated)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid var(--bv-border)' }}>
            
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(14,203,129,0.1)', color: '#0ECB81', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={28} />
                </div>
                
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>Check your email</h2>
                <p style={{ fontSize: '14px', color: 'var(--bv-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  If an account exists for <strong style={{ color: 'var(--bv-text)' }}>{email}</strong>, we sent a password reset link. It expires in 15 minutes.
                </p>

                <button
                  type="button"
                  onClick={() => submit()}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bv-bg-elevated)',
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

                <div style={{ borderTop: '1px solid var(--bv-border)', paddingTop: '20px' }}>
                  <Link to="/login" style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to Log In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>Reset password</h2>
                  <p style={{ fontSize: '14px', color: 'var(--bv-text-muted)', margin: 0, lineHeight: 1.5 }}>
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
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--bv-text-muted)' }} />
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
                      background: 'var(--bv-accent)',
                      color: 'var(--bv-bg-elevated)',
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
                <div style={{ textAlign: 'center', borderTop: '1px solid var(--bv-border)', paddingTop: '20px' }}>
                  <Link to="/login" style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to Log In
                  </Link>
                </div>
              </>
            )}

          </div>

          {/* Legal Footnote */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--bv-text-muted)', marginTop: '24px', lineHeight: 1.6 }}>
            Need help? Contact <a href="mailto:support@bravevest.com" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Support</a>
          </p>

        </div>
      </div>

    </div>
  );
}