import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 -> Step 2
  function handleInitialSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!form.email || !form.password) return setErr('Email and password are required.');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters.');
    setStep(2);
  }

  // Step 2 -> API Call -> Step 3
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!form.firstName || !form.lastName) return setErr('Please enter your full name.');
    
    setLoading(true);
    try {
      await register(form);
      setStep(3); // Show "Verify Later" success screen
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F7F7', fontFamily: 'var(--font-sans)' }}>
      
      {/* ── Left Promo (Same as Login) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', background: 'linear-gradient(135deg, #F0F0F0 0%, #E8E8E8 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>
            Start investing<br />in Africa's future.
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '12px', maxWidth: '340px', lineHeight: 1.6 }}>
            Join 52,000+ investors earning fixed returns from 12% to 18%.
          </p>
        </div>

        {/* Abstract Card Stack */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ position: 'absolute', width: '280px', height: '180px', background: '#E0E0E0', borderRadius: '12px', transform: 'rotate(-15deg) translateY(-60px) translateX(-20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #D0D0D0' }} />
          <div style={{ position: 'absolute', width: '280px', height: '180px', background: '#F5F5F5', borderRadius: '12px', transform: 'rotate(-5deg) translateY(-20px) translateX(10px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', border: '1px solid #D0D0D0' }} />
          <div style={{ position: 'absolute', width: '280px', height: '180px', background: 'linear-gradient(135deg, #F6A500 0%, #E09000 100%)', borderRadius: '12px', transform: 'rotate(5deg) translateY(20px) translateX(-10px)', boxShadow: '0 15px 30px rgba(246, 165, 0, 0.3)' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', margin: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#F6A500', fontSize: '18px' }}>B</span>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#fff', fontSize: '11px', letterSpacing: '2px', fontWeight: '600', opacity: 0.85 }}>
              BRAVEVEST
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '48px', position: 'relative', zIndex: 10 }}>
          <div><div style={{ fontSize: '32px', fontWeight: '700', color: '#111' }}>₦184B+</div><div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Assets Under Management</div></div>
          <div><div style={{ fontSize: '32px', fontWeight: '700', color: '#111' }}>14.2%</div><div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Average Yield</div></div>
        </div>
      </div>

      {/* ── Right Auth Flow ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F7F7F7', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <img
                src="/icons/logo-dark.png"
                alt="BraveVest"
                style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain'  }}
              />
            </Link>
            <button type="button" style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', padding: '8px' }}><Globe size={20} /></button>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: '#111' }}>
                {step === 1 && 'Create your account'}
                {step === 2 && 'Tell us about yourself'}
                {step === 3 && 'Account created'}
              </h2>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                {step === 1 && 'Start investing in minutes'}
                {step === 2 && 'This helps us personalize your experience'}
                {step === 3 && 'Verify your identity when you are ready.'}
              </p>
            </div>

            {/* Step 1: Email & Password */}
            {step === 1 && (
              <form onSubmit={handleInitialSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password (min 8 chars)" style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                {err && <div style={{ padding: '10px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>{err}</div>}
                <button type="submit" style={{ width: '100%', padding: '14px', background: '#F6A500', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
              </form>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }} />
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" style={{ width: '100%', padding: '14px 16px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '8px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                {err && <div style={{ padding: '10px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>{err}</div>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#F6A500', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer', marginTop: '12px', fontFamily: 'inherit' }}>Back</button>
              </form>
            )}

            {/* Step 3: Verify Later (Bybit Flow) */}
            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(14,203,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle2 size={32} color="#0ECB81" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111' }}>You're in!</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
                  Your account is ready. To unlock full investing limits and withdrawals, you'll need to verify your identity.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/dashboard" style={{ width: '100%', padding: '14px', background: '#F6A500', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>
                    Verify Identity Now
                  </Link>
                  <Link to="/dashboard" style={{ width: '100%', padding: '14px', background: '#F5F5F5', color: '#111', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>
                    Skip for now
                  </Link>
                </div>
              </div>
            )}

            {/* Footer (Only show on Step 1 and 2) */}
            {step !== 3 && (
              <div style={{ textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '24px', marginTop: '24px' }}>
                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                  Already have an account? <Link to="/login" style={{ color: '#F6A500', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                </p>
              </div>
            )}

          </div>
          
          {/* Legal Footer */}
          {step !== 3 && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '24px', lineHeight: 1.6 }}>
              By continuing, you agree to BraveVest's <a href="/terms" style={{ color: '#111', textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}