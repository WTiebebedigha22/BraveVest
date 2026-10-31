import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Smartphone, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [authMethod, setAuthMethod] = useState('email');
  const [form, setForm] = useState({ email: '', password: '', phone: '', countryCode: '+234' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');

    // Build the credential payload based on active tab
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F7F7', fontFamily: 'var(--font-sans)' }}>
      {/* ── Left Promo ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 64px',
          background: 'linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>
            Invest directly<br />in Africa's real economy.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Fixed returns from vetted private credit, real estate, and SME deals.
          </p>
        </div>

        {/* Abstract Card Stack */}
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

      {/* ── Right Auth ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F7F7F7', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <img
                src="/icons/logo-dark.png"
                alt="BraveVest"
                style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain'  }}
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

          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#111' }}>Welcome back</h2>
              <Link to="/register" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                </svg>
                Sign up
              </Link>
            </div>

            {/* Auth method tabs */}
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
              <div style={{ marginBottom: '16px' }}>
                {authMethod === 'email' ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                    autoComplete="email"
                    style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }}
                  />
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={form.countryCode}
                      onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                      style={{ width: '90px', padding: '14px 8px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }}
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
                      style={{ flex: 1, padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {err && (
                <div style={{ padding: '10px 12px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#F6A500', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}
              >
                {loading ? 'Processing…' : 'Log In'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
              <span style={{ padding: '0 12px', fontSize: '12px', color: '#888' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {['Google', 'Apple'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  disabled={loading}
                  style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#111', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
                >
                  {provider === 'Google' && <span style={{ color: '#DB4437', fontWeight: 'bold' }}>G</span>}
                  {provider === 'Apple' && <span style={{ fontWeight: 'bold' }}></span>}
                  {provider}
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '24px' }}>
              <Link to="/register" style={{ fontSize: '13px', color: '#F6A500', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
                Need an account? Sign up <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
            By continuing, you agree to BraveVest's <a href="/terms" style={{ color: '#111', textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}