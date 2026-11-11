import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, MapPin, ArrowRight, ArrowLeft,
  CheckCircle, Loader2, AlertCircle, Globe, Smartphone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeLogo } from '@/components/shared/ThemeLogo';


const STEPS = [
  { n: 1, label: 'Personal' },
  { n: 2, label: 'Location' },
  { n: 3, label: 'Security' },
];

export default function Register() {
  const nav = useNavigate();
  const { register, socialLogin } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    city: '',
    password: '',
    confirm: '',
    agree: false,
    captcha: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaA] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [captchaB] = useState(() => Math.floor(Math.random() * 10) + 1);

  function next() {
    setErr('');
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) return setErr('First and last name are required.');
      if (!form.email.trim()) return setErr('Email is required.');
    }
    if (step === 2) {
      if (!form.city.trim()) return setErr('City is required.');
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function back() {
    setErr('');
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return setErr('Password must contain uppercase, lowercase, and a number.');
    }
    if (Number(form.captcha) !== captchaA + captchaB) return setErr('Incorrect math answer.');
    if (!form.agree) return setErr('You must agree to the terms.');

    setLoading(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country,
        city: form.city.trim(),
        password: form.password,
      });
      nav('/kyc', { replace: true });
    } catch (e) {
      setErr(e?.message || 'Could not create account.');
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
      setErr(e?.response?.data?.message || `${provider} sign-up failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bv-bg)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .login-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          background: linear-gradient(135deg, rgba(11, 15, 25, 0.85) 0%, rgba(11, 15, 25, 0.7) 100%), url('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
          position: relative;
          overflow: hidden;
        }

        .login-right-auth {
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

        .auth-label {
          display: grid;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--bv-text);
        }

        .auth-field {
          position: relative;
        }

        .auth-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--bv-text-muted);
          pointer-events: none;
          display: flex;
        }

        .auth-field .auth-input {
          padding-left: 42px;
        }

        .social-btn {
          flex: 1;
          padding: 11px;
          background: var(--bv-bg-elevated);
          border: 1px solid var(--bv-border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--bv-text);
          font-family: inherit;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .social-btn:hover:not(:disabled) {
          background-color: var(--bv-bg-elevated);
          border-color: var(--bv-border);
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

      {/* ── Left Promo Section with Security Visual & High-Contrast Text ── */}
      <div className="login-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(246, 165, 0, 0.25)', color: 'var(--bv-orange)', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '20px', backdropFilter: 'blur(6px)', border: '1px solid rgba(246, 165, 0, 0.3)' }}>
            ENTERPRISE-GRADE SECURITY
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--bv-orange)', lineHeight: 1.2, letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            Invest directly<br />in Africa's real economy.
          </h1>
          <p style={{ fontSize: '16px', color: '#F0F3F6', marginTop: '16px', maxWidth: '400px', lineHeight: 1.6, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Fixed returns engineered from fully vetted private credit, commercial real estate, and high-growth SME transactions.
          </p>
        </div>

        {/* Stats Strip with High Contrast */}
        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: '10', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '28px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--bv-orange)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>₦184B+</div>
            <div style={{ fontSize: '13px', color: '#F0F3F6', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--bv-orange)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>52,000+</div>
            <div style={{ fontSize: '13px', color: '#F0F3F6', marginTop: '4px', fontWeight: '500', letterSpacing: '0.3px' }}>Active Investors</div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Section ── */}
      <div className="login-right-auth">
        <div style={{ width: '100%', maxWidth: '440px' }}>

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
          <div style={{
            background: 'var(--bv-bg-elevated)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            border: '1px solid var(--bv-border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: 'var(--bv-text)' }}>Create your account</h2>
              <Link
                to="/login"
                style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </div>

            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {STEPS.map((s) => {
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} style={{ flex: 1 }}>
                    <div style={{
                      height: 3,
                      background: done || active ? 'var(--bv-accent)' : 'var(--bv-border)',
                      borderRadius: 2,
                      marginBottom: 6,
                    }} />
                    <div style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: done || active ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {s.n}. {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {err && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(246,70,93,0.1)',
                color: '#F6465D',
                fontSize: '13px',
                borderRadius: '6px',
                marginBottom: '16px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{err}</div>
              </div>
            )}

            <form onSubmit={submit} style={{ display: 'grid', gap: '16px' }}>

              {/* ── STEP 1: Personal ── */}
              {step === 1 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className="auth-label">
                      First name
                      <div className="auth-field">
                        <span className="auth-field-icon"><User size={16} /></span>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          required
                          className="auth-input"
                        />
                      </div>
                    </label>
                    <label className="auth-label">
                      Last name
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        required
                        className="auth-input"
                      />
                    </label>
                  </div>

                  <label className="auth-label">
                    Email address
                    <div className="auth-field">
                      <span className="auth-field-icon"><Mail size={16} /></span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        autoComplete="email"
                        className="auth-input"
                      />
                    </div>
                  </label>

                  <label className="auth-label">
                    Phone (optional)
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234 801 234 5678"
                      autoComplete="tel"
                      className="auth-input"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={next}
                    style={{
                      padding: '14px',
                      background: 'var(--bv-accent)',
                      color: 'var(--bv-bg-elevated)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: 'inherit',
                    }}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </>
              )}

              {/* ── STEP 2: Location ── */}
              {step === 2 && (
                <>
                  <label className="auth-label">
                    Country
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="auth-input"
                    >
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </label>

                  <label className="auth-label">
                    City
                    <div className="auth-field">
                      <span className="auth-field-icon"><MapPin size={16} /></span>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        required
                        className="auth-input"
                      />
                    </div>
                  </label>

                  <p style={{ fontSize: '13px', color: 'var(--bv-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Your location helps us provide region-specific features and compliance.
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={back}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: 'var(--bv-bg-elevated)',
                        color: 'var(--bv-text)',
                        border: '1px solid var(--bv-border)',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      style={{
                        flex: 2,
                        padding: '14px',
                        background: 'var(--bv-accent)',
                        color: 'var(--bv-bg-elevated)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'inherit',
                      }}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Security ── */}
              {step === 3 && (
                <>
                  <label className="auth-label">
                    Password
                    <div className="auth-field">
                      <span className="auth-field-icon"><Lock size={16} /></span>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        autoComplete="new-password"
                        className="auth-input"
                      />
                    </div>
                  </label>

                  <label className="auth-label">
                    Confirm password
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      required
                      autoComplete="new-password"
                      className="auth-input"
                    />
                  </label>

                  <div style={{
                    padding: '12px',
                    background: 'var(--bv-bg-elevated)',
                    border: '1px solid var(--bv-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--bv-text-muted)',
                    lineHeight: 1.6,
                  }}>
                    Password must be 8+ characters with uppercase, lowercase, and a number.
                  </div>

                  <label className="auth-label">
                    What is {captchaA} + {captchaB}?
                    <input
                      type="number"
                      value={form.captcha}
                      onChange={(e) => setForm({ ...form, captcha: e.target.value })}
                      required
                      className="auth-input"
                      style={{ paddingLeft: '16px' }}
                    />
                  </label>

                  <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--bv-text-muted)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      I am 18+ and agree to the{' '}
                      <Link to="/terms" style={{ color: 'var(--bv-accent)', textDecoration: 'underline' }}>Terms</Link> and{' '}
                      <Link to="/privacy" style={{ color: 'var(--bv-accent)', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </span>
                  </label>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={back}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: 'var(--bv-bg-elevated)',
                        color: 'var(--bv-text)',
                        border: '1px solid var(--bv-border)',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 2,
                        padding: '14px',
                        background: 'var(--bv-accent)',
                        color: 'var(--bv-bg-elevated)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'inherit',
                      }}
                    >
                      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                      {loading ? 'Creating…' : 'Create account'}
                    </button>
                  </div>
                  <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
                </>
              )}
            </form>

            {/* Divider — only on step 1 (social login) */}
            {step === 1 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--bv-border)' }} />
                  <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--bv-text-muted)' }}>or sign up with</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--bv-border)' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
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
              </>
            )}

            {/* Footer link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid var(--bv-border)', paddingTop: '20px', marginTop: '24px' }}>
              <Link
                to="/login"
                style={{ fontSize: '13px', color: 'var(--bv-accent)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Already have an account? Sign in <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Legal / Terms */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--bv-text-muted)', marginTop: '24px', lineHeight: 1.6 }}>
            By creating an account, you agree to BraveVest's{' '}
            <a href="#/terms" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Terms</a> and{' '}
            <a href="#/privacy" style={{ color: 'var(--bv-text)', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  );
}