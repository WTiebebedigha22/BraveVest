import Stepper from '@/components/kyc/Stepper';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { kycApi } from '@/api/kyc';
import './Kyc.css';

export default function KycStep4Bank() {
  const nav = useNavigate();
  const [form, setForm] = useState({ bankName: '', bankCode: '', accountNumber: '', accountName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('');
    try { await kycApi.saveStep(4, form); nav('/kyc/review'); }
    catch (err) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  }
  return (
    <div className="kyc">
      <Stepper current={4} />
      <h1 className="kyc__title">Bank account</h1>
      <p className="kyc__sub">Where payouts and returns will land.</p>
      <form onSubmit={submit} className="kyc__form">
        <Input label="Bank name" value={form.bankName} onChange={update('bankName')} required />
        <Input label="Bank code" value={form.bankCode} onChange={update('bankCode')} required hint="e.g. 058 for GTBank" />
        <Input label="Account number" value={form.accountNumber} onChange={update('accountNumber')} required hint="10 digits" />
        <Input label="Account name" value={form.accountName} onChange={update('accountName')} required />
        {error && <div className="auth__error">{error}</div>}
        <div className="kyc__actions"><Button type="submit" variant="primary" size="lg" disabled={loading}>{loading ? 'Saving…' : 'Continue'}</Button></div>
      </form>
    </div>
  );
}
