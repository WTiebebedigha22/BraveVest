import { useState } from 'react';
import { api } from '@/api/client';

export default function OtpModal({ onVerified, onClose, purpose = 'login' }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function verify() {
    if (code.length !== 6) return setErr('Enter 6-digit code');
    setLoading(true);
    try {
      await api.post('/api/auth/otp/verify', { code, purpose });
      onVerified();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
      <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '8px' }}>Two-factor verification</h3>
        <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          We've sent a 6-digit code to your email.
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontFamily: 'monospace', marginBottom: '16px' }}
        />
        {err && <div style={{ color: 'var(--bybit-red)', fontSize: '13px', marginBottom: '12px' }}>{err}</div>}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} className="btn btn--outline" style={{ flex: 1 }}>Cancel</button>
          <button onClick={verify} disabled={loading} className="btn btn--primary" style={{ flex: 1 }}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
}
