import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import { adminApi } from '@/api/admin';

export default function AdminKycDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { adminApi.getKyc(id).then(setData).catch(() => {}).finally(() => setLoading(false)); }, [id]);

  async function approve() { setSubmitting(true); try { await adminApi.approveKyc(id); nav('/admin/kyc'); } finally { setSubmitting(false); } }
  async function reject() {
    const reason = window.prompt('Rejection reason:'); if (!reason) return;
    setSubmitting(true); try { await adminApi.rejectKyc(id, reason); nav('/admin/kyc'); } finally { setSubmitting(false); }
  }

  if (loading) return <Loader />;
  if (!data) return <div>Not found</div>;
  const p = data.profile;

  return (
    <>
      <PageHeader title={`${data.profile.user.firstName} ${data.profile.user.lastName}`} subtitle={data.profile.user.email} />
      <div className="dash-card">
        <div className="kyc__review-row"><span>Status</span><strong>{p.status}</strong></div>
        <div className="kyc__review-row"><span>Date of birth</span><strong>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '—'}</strong></div>
        <div className="kyc__review-row"><span>ID</span><strong>{p.idType} · {p.idNumber}</strong></div>
        <div className="kyc__review-row"><span>Address</span><strong>{p.addressLine1}, {p.city}, {p.state}</strong></div>
        <div className="kyc__review-row"><span>Bank</span><strong>{p.bankName} · {p.accountNumber}</strong></div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="primary" onClick={approve} disabled={submitting}>Approve</Button>
        <Button variant="secondary" onClick={reject} disabled={submitting}>Reject</Button>
      </div>
    </>
  );
}
