import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Smartphone, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const nav = useNavigate();
  const { login, socialLogin } = useAuth();
  const [authMethod, setAuthMethod] = useState('email');
  const [form, setForm] = useState({ email: '', password: '', phone: '', countryCode: '+234' });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');

    let credentials;
    if (authMethod === 'email') {
      if (!form.email.trim()) return setErr('Please enter your email.');
      credentials = { email: form.email.trim(), password: form.password };
    } else {
      if (!form.phone.trim()) return setErr('Please enter your phone number.');
      credentials = { phone: `${form.countryCode}${form.phone.trim()}`, password: form.password };
    }
    if (!form.password) return setErr('Please enter your password.');

    setLoading(true);
    try {
      const user = await login(credentials);
      const roles = user?.roles || (user?.role ? [user.role] : []);
      nav(roles.includes('ADMIN') ? '/admin' : '/dashboard', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialAuth(provider) {
    setErr('');
    setLoading(true);
    try {
      const user = await socialLogin(provider);
      const roles = user?.roles || (user?.role ? [user.role] : []);
      nav(roles.includes('ADMIN') ? '/admin' : '/dashboard', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || `${provider} sign-in failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F7F7', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .login-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          background: linear-gradient(135deg, rgba(11, 15, 25, 0.85) 0%, rgba(11, 15, 25, 0.7) 100%), url('watermarked_img_10228335117829985453.jpg') center/cover no-repeat;
          position: relative;
          overflow: hidden;
        }

        .login-right-auth {
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

        .social-btn {
          flex: 1;
          padding: 11px;
          background: #FFF;
          border: 1px solid #EAEAEA;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #111;
          font-family: inherit;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .social-btn:hover:not(:disabled) {
          background-color: #FAF9F6;
          border-color: #DDD;
        }

        @media (max-width: 900px) {
          .login-left-promo {
            display: none;
          }
          .login-right-auth {
            flex: 1;
            width: 100%;
          }
        }
      `}</style>

      {/* ── Left Promo Section with Enhanced High-Contrast Text ── */}
      <div className="login-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(246, 165, 0, 0.25)', color: '#FFB81C', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '20px', backdropFilter: 'blur(6px)', border: '1px solid rgba(246, 165, 0, 0.3)' }}>
            ENTERPRISE-GRADE SECURITY
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            Invest directly<br />in Africa's real economy.
          </h1>
          <p style={{ fontSize: '16px', color: '#F0F0F0', marginTop: '16px', maxWidth: '400px', lineHeight: 1.6, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Fixed returns engineered from fully vetted private credit, commercial real estate, and high-growth SME transactions.
          </p>
        </div>

        {/* Stats Strip with High Contrast */}
        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: '10', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '28px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>₦184B+</div>
            <div style={{ fontSize: '13px', color: '#E0E0E0', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>52,000+</div>
            <div style={{ fontSize: '13px', color: '#E0E0E0', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Active Investors</div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Section ── */}
      <div className="login-right-auth">
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
              style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', padding: '8px' }}
            >
              <Globe size={20} />
            </button>
          </div>

          {/* Form Card */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#111' }}>Welcome back</h2>
              <Link to="/register" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Sign up
              </Link>
            </div>

            {/* Auth Method Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EAEAEA', marginBottom: '24px' }}>
              {['email', 'mobile'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setAuthMethod(m); setErr(''); }}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    padding: '12px 0',
                    fontSize: '14px',
                    fontWeight: authMethod === m ? '600' : '400',
                    color: authMethod === m ? '#111' : '#888',
                    borderBottom: authMethod === m ? '2px solid #F6A500' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {m === 'email' && <Mail size={14} />}
                  {m === 'mobile' && <Smartphone size={14} />}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={submit}>
              {/* Credentials Field */}
              <div style={{ marginBottom: '16px' }}>
                {authMethod === 'email' ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                    autoComplete="email"
                    className="auth-input"
                  />
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={form.countryCode}
                      onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                      className="auth-input"
                      style={{ width: '90px', padding: '14px 8px' }}
                    >
                      <option value="+234">+234</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Phone number"
                      autoComplete="tel"
                      className="auth-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                )}
              </div>

              {/* Password Input with Visibility Toggle */}
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="auth-input"
                  style={{ paddingRight: '44px' }}
                />
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
                    color: '#888',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#666', textDecoration: 'none', fontWeight: '500' }}>
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert */}
              {err && (
                <div style={{ padding: '10px 12px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>
                  {err}
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
                  color: '#fff',
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
                {loading ? 'Signing in…' : 'Log In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
              <span style={{ padding: '0 12px', fontSize: '12px', color: '#888' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
            </div>

            {/* Social Auth Options */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth('google')}
                className="social-btn"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                <span style={{ color: '#DB4437', fontWeight: 'bold', fontSize: '15px' }}>G</span>
                Google
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth('apple')}
                className="social-btn"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}></span>
                Apple
              </button>
            </div>

            {/* Footer Navigation Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <Link to="/register" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Need an account? Sign up <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Legal / Terms */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            By continuing, you agree to BraveVest's <a href="/terms" style={{ color: '#111', textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>

        </div>
      </div>

    </div>
  );
}