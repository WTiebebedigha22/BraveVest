import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Smartphone, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '@/api/client';

export default function Register() {
  const nav = useNavigate();
  const [authMethod, setAuthMethod] = useState('email');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+234',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function submit(e) {
    e.preventDefault();
    setErr('');

    if (!form.firstName.trim()) return setErr('Please enter your first name.');
    if (!form.lastName.trim()) return setErr('Please enter your last name.');

    let payload;
    if (authMethod === 'email') {
      if (!form.email.trim()) return setErr('Please enter your email.');
      payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      };
    } else {
      if (!form.phone.trim()) return setErr('Please enter your phone number.');
      payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: `${form.countryCode}${form.phone.trim()}`,
        password: form.password,
      };
    }

    if (!form.password || form.password.length < 6) {
      return setErr('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await api.post('/api/auth/register', payload);
      nav('/login', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F7F7', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ── RESPONSIVE STYLES (Matching Login Page) ── */}
      <style>{`
        .register-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 64px;
          background: linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%);
          position: relative;
          overflow: hidden;
        }

        .register-right-auth {
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
          .register-left-promo {
            display: none;
          }
          .register-right-auth {
            flex: 1;
            width: 100%;
          }
        }
      `}</style>

      {/* ── Left Promo Section (Consistent with Login) ── */}
      <div className="register-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>
            Build your wealth<br />with verified opportunities.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Join thousands of active investors backing high-yield private credit, real estate, and growth ventures across Africa.
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
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', margin: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#F6A500', fontSize: '18px' }}>B</span>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#fff', fontSize: '11px', letterSpacing: '2px', fontWeight: '600', opacity: 0.85 }}>
              BRAVEVEST
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#111' }}>₦184B+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#111' }}>52,000+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Active Investors</div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Section ── */}
      <div className="register-right-auth">
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
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#111' }}>Create account</h2>
              <Link to="/login" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Log in
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
              
              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    autoComplete="given-name"
                    className="auth-input"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Identifier Field (Email or Mobile) */}
              <div style={{ marginBottom: '16px' }}>
                {authMethod === 'email' ? (
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
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
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      autoComplete="tel"
                      className="auth-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                )}
              </div>

              {/* Password Input with Visibility Toggle */}
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  autoComplete="new-password"
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
                {loading ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
              <span style={{ padding: '0 12px', fontSize: '12px', color: '#888' }}>or sign up with</span>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
            </div>

            {/* Social Auth Options */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button type="button" disabled={loading} className="social-btn" style={{ opacity: loading ? 0.6 : 1 }}>
                <span style={{ color: '#DB4437', fontWeight: 'bold', fontSize: '15px' }}>G</span>
                Google
              </button>
              <button type="button" disabled={loading} className="social-btn" style={{ opacity: loading ? 0.6 : 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}></span>
                Apple
              </button>
            </div>

            {/* Footer Navigation Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '20px' }}>
              <Link to="/login" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Already have an account? Log in <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Legal / Terms */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            By signing up, you agree to BraveVest's <a href="/terms" style={{ color: '#111', textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>

        </div>
      </div>

    </div>
  );
}
