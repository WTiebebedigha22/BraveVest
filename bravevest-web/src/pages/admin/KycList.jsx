import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';

export default function AdminKycList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.listKyc({ status: 'UNDER_REVIEW' }).then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <>
      <PageHeader title="KYC Review" subtitle={`${items.length} pending review`} />
      <div className="inv-table">
        <div className="inv-table__head"><span>User</span><span>Email</span><span>Submitted</span><span>Status</span></div>
        {items.map((k) => (
          <Link key={k.id} to={`/admin/kyc/${k.id}`} className="inv-table__row">
            <span>{k.user?.firstName} {k.user?.lastName}</span>
            <span className="text-muted">{k.user?.email}</span>
            <span>{k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '—'}</span>
            <span className="inv-table__status is-pending">{k.status}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
