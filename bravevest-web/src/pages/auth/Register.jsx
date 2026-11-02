import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '@/api/client';

const registerStyles = `
  .bv-auth-page {
    background-color: #f8f9fa;
    color: #111111;
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 40px 20px;
  }

  .bv-auth-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  }

  @media (max-width: 520px) {
    .bv-auth-card {
      padding: 24px 20px;
      border: none;
      box-shadow: none;
      background: transparent;
    }
  }

  .bv-form-label {
    display: block;
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .bv-input-group {
    display: flex;
    align-items: center;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 20px;
  }

  .bv-input-group:focus-within {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    background: #ffffff;
  }

  .bv-input-icon {
    padding: 0 14px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bv-auth-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 14px 14px 14px 0;
    font-size: 15px;
    color: #111111;
    outline: none;
    width: 100%;
  }

  .bv-auth-input::placeholder {
    color: #9ca3af;
  }

  .bv-btn-primary {
    background-color: #f59e0b;
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    padding: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background-color 0.15s ease;
  }

  .bv-btn-primary:hover:not(:disabled) {
    background-color: #d97706;
  }

  .bv-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function Register() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/register', formData);
      nav('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bv-auth-page">
      <style dangerouslySetInnerHTML={{ __html: registerStyles }} />

      <div className="bv-auth-card">
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111111', marginBottom: '8px' }}>
            Create an Account
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Join BraveVest to access verified investment opportunities.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label className="bv-form-label">First Name</label>
              <div className="bv-input-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Uko"
                  required
                  className="bv-auth-input"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="bv-form-label">Last Name</label>
              <div className="bv-input-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ekpe"
                  required
                  className="bv-auth-input"
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="bv-form-label">Email Address</label>
            <div className="bv-input-group">
              <div className="bv-input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="uko.ekpe@example.com"
                required
                className="bv-auth-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="bv-form-label">Password</label>
            <div className="bv-input-group">
              <div className="bv-input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="bv-auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bv-btn-primary"
          >
            {loading ? 'Creating Account...' : <>Sign Up Now <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#d97706', fontWeight: '600', textDecoration: 'none' }}>
            Log In
          </Link>
        </div>

        <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af' }}>
          <ShieldCheck size={14} color="#d97706" /> Secured with bank-grade encryption
        </div>

      </div>
    </div>
  );
}
