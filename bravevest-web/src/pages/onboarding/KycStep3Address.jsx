import Stepper from '@/components/kyc/Stepper';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { kycApi } from '@/api/kyc';
import './Kyc.css';

export default function KycStep3Address() {
  const nav = useNavigate();
  const [form, setForm] = useState({ addressLine1: '', city: '', state: '', country: 'NG' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('');
    try { await kycApi.saveStep(3, form); nav('/kyc/bank'); }
    catch (err) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  }
  return (
    <div className="kyc">
      <Stepper current={3} />
      <h1 className="kyc__title">Residential address</h1>
      <p className="kyc__sub">Where can we reach you?</p>
      <form onSubmit={submit} className="kyc__form">
        <Input label="Address line 1" value={form.addressLine1} onChange={update('addressLine1')} required />
        <Input label="City" value={form.city} onChange={update('city')} required />
        <Input label="State" value={form.state} onChange={update('state')} required />
        <Input label="Country" value={form.country} onChange={update('country')} required />
        {error && <div className="auth__error">{error}</div>}
        <div className="kyc__actions"><Button type="submit" variant="primary" size="lg" disabled={loading}>{loading ? 'Saving…' : 'Continue'}</Button></div>
      </form>
    </div>
  );
}
