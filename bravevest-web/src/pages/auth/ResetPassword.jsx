import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { authApi } from '@/api/auth';
import './Auth.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authApi.resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth">
      <div className="auth__mesh" aria-hidden />
      <div className="auth__card">
        <Link to="/" className="auth__brand"><span className="auth__mark" /> BraveVest</Link>
        <h1 className="auth__title">Set a new password.</h1>
        <p className="auth__sub">Choose something strong — min 8 chars, one uppercase, one number.</p>
        <form onSubmit={submit}>
          <Input
            label="New password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            hint="Must include uppercase, lowercase, and a number"
          />
          {error && <div className="auth__error">{error}</div>}
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Saving…' : 'Reset password'}
          </Button>
        </form>
        <div className="auth__foot"><Link to="/login">← Back to sign in</Link></div>
      </div>
    </div>
  );
}
