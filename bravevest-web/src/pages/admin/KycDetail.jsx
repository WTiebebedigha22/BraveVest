import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import { adminApi } from '@/api/admin';
import './KycDetail.css';

export default function AdminKycDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getKyc(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function approve() {
    setSubmitting(true); setError('');
    try { await adminApi.approveKyc(id); nav('/admin/kyc'); }
    catch (err) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  }

  async function reject() {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    setSubmitting(true); setError('');
    try { await adminApi.rejectKyc(id, reason); nav('/admin/kyc'); }
    catch (err) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="text-center py-5"><Loader /></div>;
  if (!data) return <AdminEmpty title="KYC not found" body="This submission may have been deleted." />;

  const p = data.profile;
  const user = p.user;

  const docCols = [
    { key: 'name', label: 'File', render: (d) => d.fileName },
    { key: 'type', label: 'Type', render: (d) => <span className="text-muted">{d.type.replace(/_/g, ' ')}</span> },
    {
      key: 'uploaded', label: 'Uploaded',
      render: (d) => new Date(d.createdAt).toLocaleDateString(),
    },
    {
      key: 'view', label: '', align: 'right',
      render: (d) => (
        <a href={d.fileUrl} target="_blank" rel="noreferrer" className="kycdoc-view">View →</a>
      ),
    },
  ];

  return (
    <>
      <Link to="/admin/kyc" className="admin-back">← All KYC submissions</Link>

      <AdminPageHeader
        eyebrow="KYC Review"
        title={`${user.firstName} ${user.lastName}`}
        subtitle={user.email}
        right={<AdminTable.Status status={p.status} />}
      />

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-grid-2 mb-4">
        <AdminCard padded={false}>
          <AdminCard.Header title="Personal" subtitle="Step 1 details" />
          <AdminCard.Body>
            <Row k="Date of birth" v={p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '—'} />
            <Row k="Gender" v={p.gender || '—'} />
            <Row k="Nationality" v={p.nationality || '—'} />
            <Row k="Occupation" v={p.occupation || '—'} />
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Identity" subtitle="Step 2 details" />
          <AdminCard.Body>
            <Row k="ID type" v={p.idType || '—'} />
            <Row k="ID number" v={p.idNumber || '—'} />
            <Row k="Issued" v={p.idIssuedDate ? new Date(p.idIssuedDate).toLocaleDateString() : '—'} />
            <Row k="Expires" v={p.idExpiryDate ? new Date(p.idExpiryDate).toLocaleDateString() : '—'} />
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Address" subtitle="Step 3 details" />
          <AdminCard.Body>
            <Row k="Line 1" v={p.addressLine1 || '—'} />
            <Row k="Line 2" v={p.addressLine2 || '—'} />
            <Row k="City" v={p.city || '—'} />
            <Row k="State" v={p.state || '—'} />
            <Row k="Country" v={p.country || '—'} />
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Bank" subtitle="Step 4 details" />
          <AdminCard.Body>
            <Row k="Bank name" v={p.bankName || '—'} />
            <Row k="Bank code" v={p.bankCode || '—'} />
            <Row k="Account number" v={p.accountNumber || '—'} />
            <Row k="Account name" v={p.accountName || '—'} />
          </AdminCard.Body>
        </AdminCard>
      </div>

      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header title="Documents" subtitle={`${data.documents.length} uploaded`} />
        <AdminCard.Body>
          <AdminTable
            columns={docCols}
            rows={data.documents}
            empty="No documents uploaded."
          />
        </AdminCard.Body>
      </AdminCard>

      {p.rejectionNote && (
        <AdminCard padded={false} className="mb-4">
          <AdminCard.Header title="Rejection note" />
          <AdminCard.Body>
            <div className="kycdoc-note">{p.rejectionNote}</div>
          </AdminCard.Body>
        </AdminCard>
      )}

      {p.status === 'UNDER_REVIEW' && (
        <div className="kycdoc-actions">
          <Button variant="secondary" size="lg" onClick={reject} disabled={submitting}>
            Reject
          </Button>
          <Button variant="primary" size="lg" onClick={approve} disabled={submitting}>
            {submitting ? 'Approving…' : 'Approve'}
          </Button>
        </div>
      )}
    </>
  );
}

function Row({ k, v }) {
  return (
    <div className="admin-kv__row">
      <span className="admin-kv__k">{k}</span>
      <span className="admin-kv__v">{v}</span>
    </div>
  );
}
