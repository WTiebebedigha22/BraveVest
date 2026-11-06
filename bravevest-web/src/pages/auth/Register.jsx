import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, MapPin, ArrowRight, ArrowLeft,
  CheckCircle, Loader2, AlertCircle, Globe, Smartphone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const STEPS = [
  { n: 1, label: 'Personal' },
  { n: 2, label: 'Location' },
  { n: 3, label: 'Security' },
];

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
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

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#F7F7F7',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── RESPONSIVE STYLES (same as Login) ── */}
      <style>{`
        .login-left-promo {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 64px;
          background: linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%);
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

        .auth-label {
          display: grid;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #111;
        }

        .auth-field {
          position: relative;
        }

        .auth-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
          pointer-events: none;
          display: flex;
        }

        .auth-field .auth-input {
          padding-left: 42px;
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

      {/* ── Left Promo Section (identical to Login) ── */}
      <div className="login-left-promo">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>
            Start investing in<br />Africa's real economy.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Join 52,000+ investors earning fixed returns on vetted private credit, real estate, and SME deals.
          </p>
        </div>

        {/* Abstract Card Stack Visual (same as Login) */}
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

        {/* Stats Strip (same as Login) */}
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
      <div className="login-right-auth">
        <div style={{ width: '100%', maxWidth: '440px' }}>

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
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            border: '1px solid #EAEAEA',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#111' }}>Create your account</h2>
              <Link
                to="/login"
                style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
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
                      background: done || active ? '#F6A500' : '#EAEAEA',
                      borderRadius: 2,
                      marginBottom: 6,
                    }} />
                    <div style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: done || active ? '#F6A500' : '#888',
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
                      background: '#F6A500',
                      color: '#fff',
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

                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                    Your location helps us provide region-specific features and compliance.
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={back}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: '#fff',
                        color: '#111',
                        border: '1px solid #EAEAEA',
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
                        background: '#F6A500',
                        color: '#fff',
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
                    background: '#F5F5F5',
                    border: '1px solid #EAEAEA',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#666',
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

                  <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      I am 18+ and agree to the{' '}
                      <Link to="/terms" style={{ color: '#F6A500', textDecoration: 'underline' }}>Terms</Link> and{' '}
                      <Link to="/privacy" style={{ color: '#F6A500', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </span>
                  </label>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={back}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: '#fff',
                        color: '#111',
                        border: '1px solid #EAEAEA',
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
                        background: '#F6A500',
                        color: '#fff',
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
                  <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
                  <span style={{ padding: '0 12px', fontSize: '12px', color: '#888' }}>or sign up with</span>
                  <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" disabled={loading} className="social-btn" style={{ opacity: loading ? 0.6 : 1 }}>
                    <span style={{ color: '#DB4437', fontWeight: 'bold', fontSize: '15px' }}>G</span>
                    Google
                  </button>
                  <button type="button" disabled={loading} className="social-btn" style={{ opacity: loading ? 0.6 : 1 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}></span>
                    Apple
                  </button>
                </div>
              </>
            )}

            {/* Footer link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '20px', marginTop: '24px' }}>
              <Link
                to="/login"
                style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Already have an account? Sign in <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Legal / Terms */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            By creating an account, you agree to BraveVest's{' '}
            <a href="#/terms" style={{ color: '#111', textDecoration: 'underline' }}>Terms</a> and{' '}
            <a href="#/privacy" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  );
}