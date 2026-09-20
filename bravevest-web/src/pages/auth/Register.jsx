import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/kyc');
    } catch (err) {
      const details = err?.response?.data?.details;
      const firstField = details && Object.keys(details)[0];
      setError(err?.response?.data?.message + (firstField ? ` — ${details[firstField][0]}` : ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__mesh" aria-hidden />
      <div className="auth__card auth__card--wide">
        <Link to="/" className="auth__brand">
          <span className="auth__mark" /> BraveVest
        </Link>
        <h1 className="auth__title">Create your account.</h1>
        <p className="auth__sub">Start investing in under 5 minutes.</p>

        <form onSubmit={submit}>
          <div className="auth__row">
            <Input label="First name" value={form.firstName} onChange={update('firstName')} required />
            <Input label="Last name" value={form.lastName} onChange={update('lastName')} required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Input
            label="Phone (optional)"
            value={form.phone}
            onChange={update('phone')}
            hint="Nigerian format e.g. 08012345678"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            hint="Min 8 chars, with uppercase, lowercase, and a number"
          />
          {error && <div className="auth__error">{error}</div>}

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <div className="auth__foot">
          <span>Already have an account? <Link to="/login">Sign in</Link></span>
        </div>
      </div>
    </div>
  );
}
