import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { authApi } from '@/api/auth';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth">
      <div className="auth__mesh" aria-hidden />
      <div className="auth__card">
        <Link to="/" className="auth__brand"><span className="auth__mark" /> BraveVest</Link>
        {sent ? (
          <>
            <h1 className="auth__title">Check your email.</h1>
            <p className="auth__sub">If an account exists for {email}, we sent a reset link. It expires in 15 minutes.</p>
            <Link to="/login" className="auth__foot" style={{ display: 'block', textAlign: 'center' }}>← Back to sign in</Link>
          </>
        ) : (
          <>
            <h1 className="auth__title">Reset password.</h1>
            <p className="auth__sub">Enter your email and we'll send a link to reset your password.</p>
            <form onSubmit={submit}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {error && <div className="auth__error">{error}</div>}
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
            <div className="auth__foot"><Link to="/login">← Back to sign in</Link></div>
          </>
        )}
      </div>
    </div>
  );
}
