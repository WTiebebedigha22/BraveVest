import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login({ email, password });
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__mesh" aria-hidden />
      <div className="auth__card">
        <Link to="/" className="auth__brand">
          <span className="auth__mark" /> BraveVest
        </Link>
        <h1 className="auth__title">Welcome back.</h1>
        <p className="auth__sub">Sign in to manage your investments.</p>

        <form onSubmit={submit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {error && <div className="auth__error">{error}</div>}

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="auth__foot">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>·</span>
          <span>New here? <Link to="/register">Create account</Link></span>
        </div>

        <div className="auth__demo">
          <div className="auth__demo-title">Try demo accounts</div>
          <div className="auth__demo-row" onClick={() => { setEmail('investor@bravevest.com'); setPassword('Password123'); }}>
            <strong>investor@bravevest.com</strong> · Password123
          </div>
          <div className="auth__demo-row" onClick={() => { setEmail('admin@bravevest.com'); setPassword('Password123'); }}>
            <strong>admin@bravevest.com</strong> · Password123
          </div>
        </div>
      </div>
    </div>
  );
}
