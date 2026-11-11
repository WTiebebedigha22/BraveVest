import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { authApi } from '@/api/auth';
import { ThemeLogo } from '@/components/shared/ThemeLogo';


export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Validation Rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isValid = hasMinLength && hasUppercase && hasNumber;

  async function submit(e) {
    e.preventDefault();
    if (!token) {
      return setError('Invalid or missing password reset token.');
    }
    if (!isValid) {
      return setError('Please meet all password requirements.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword(token, password);
      navigate('/login', { replace: true, state: { resetSuccess: true } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
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
          padding: 14px 16px 14px 40px;
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

        .rule-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--bv-text-muted);
        }

        .rule-item.valid {
          color: #0ECB81;
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
            Create your new<br />account password.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--bv-text)', marginTop: '16px', maxWidth: '400px', lineHeight: 1.6, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Ensure your account remains secure with a strong and unique password.
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
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px', color: 'var(--bv-text)' }}>Set a new password</h2>
              <p style={{ fontSize: '14px', color: 'var(--bv-text-muted)', margin: 0, lineHeight: 1.5 }}>
                Enter your new password below to update your security credentials.
              </p>
            </div>

            <form onSubmit={submit}>
              {/* New Password Input */}
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  required
                  className="auth-input"
                  style={{ paddingRight: '44px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--bv-text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--bv-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', padding: '12px', background: 'var(--bv-bg-elevated)', borderRadius: '8px', border: '1px solid var(--bv-border)' }}>
                <div className={`rule-item ${hasMinLength ? 'valid' : ''}`}>
                  {hasMinLength ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least 8 characters
                </div>
                <div className={`rule-item ${hasUppercase ? 'valid' : ''}`}>
                  {hasUppercase ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least one uppercase letter
                </div>
                <div className={`rule-item ${hasNumber ? 'valid' : ''}`}>
                  {hasNumber ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least one number
                </div>
              </div>

              {/* Confirm Password Input */}
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                  className="auth-input"
                  style={{ paddingRight: '44px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--bv-text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--bv-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error Alert */}
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
                {loading ? 'Updating…' : 'Reset Password'}
              </button>
            </form>

            {/* Back to Login Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid var(--bv-border)', paddingTop: '20px' }}>
              <Link to="/login" style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Log In
              </Link>
            </div>
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