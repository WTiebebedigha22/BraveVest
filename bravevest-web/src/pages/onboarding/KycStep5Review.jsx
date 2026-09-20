import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@/components/kyc/Stepper';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import { kycApi } from '@/api/kyc';
import './Kyc.css';

export default function KycStep5Review() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    kycApi.me().then((d) => setProfile(d.profile)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function submit() {
    setSubmitting(true); setError('');
    try { await kycApi.submit(); nav('/dashboard'); }
    catch (err) { setError(err?.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="kyc text-center py-5"><Loader /></div>;

  return (
    <div className="kyc">
      <Stepper current={5} />
      <h1 className="kyc__title">Review & submit</h1>
      <p className="kyc__sub">Confirm everything looks right. You won't be able to edit until review completes.</p>

      <div className="kyc__form">
        <div className="kyc__review-row"><span>Date of birth</span><strong>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—'}</strong></div>
        <div className="kyc__review-row"><span>ID</span><strong>{profile?.idType} · {profile?.idNumber}</strong></div>
        <div className="kyc__review-row"><span>Address</span><strong>{profile?.addressLine1}, {profile?.city}</strong></div>
        <div className="kyc__review-row"><span>Bank</span><strong>{profile?.bankName} · {profile?.accountNumber}</strong></div>
        {error && <div className="auth__error mt-2">{error}</div>}
        <div className="kyc__actions">
          <Button variant="primary" size="lg" onClick={submit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit for review'}
          </Button>
        </div>
      </div>

      <style>{`
        .kyc__review-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
        .kyc__review-row:last-of-type { border-bottom: none; }
        .kyc__review-row span { color: var(--gray-600); }
      `}</style>
    </div>
  );
}
