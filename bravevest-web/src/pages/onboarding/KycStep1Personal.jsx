import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@/components/kyc/Stepper';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { kycApi } from '@/api/kyc';
import './Kyc.css';

export default function KycStep1Personal() {
  const nav = useNavigate();
  const [form, setForm] = useState({ dateOfBirth: '', gender: '', nationality: 'NG', occupation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await kycApi.saveStep(1, form);
      nav('/kyc/identity');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  }

  return (
    <div className="kyc">
      <Stepper current={1} />
      <h1 className="kyc__title">Personal details</h1>
      <p className="kyc__sub">Tell us a bit about yourself. This is required by Nigerian financial regulations.</p>

      <form onSubmit={submit} className="kyc__form">
        <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} required />
        <div className="kyc__field">
          <label className="kyc__label">Gender</label>
          <select className="kyc__select" value={form.gender} onChange={update('gender')} required>
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Input label="Nationality" value={form.nationality} onChange={update('nationality')} required />
        <Input label="Occupation" value={form.occupation} onChange={update('occupation')} required />

        {error && <div className="auth__error">{error}</div>}

        <div className="kyc__actions">
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Saving…' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
