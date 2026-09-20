import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';

export default function AdminInvestors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.investors().then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Investors" subtitle={`${items.length} registered investors`} />
      <div className="inv-table">
        <div className="inv-table__head"><span>Name</span><span>Email</span><span>KYC</span><span>Investments</span></div>
        {items.map((u) => (
          <Link key={u.id} to={`/admin/investors/${u.id}`} className="inv-table__row">
            <span>{u.firstName} {u.lastName}</span>
            <span className="text-muted">{u.email}</span>
            <span className={`inv-table__status ${u.kyc?.status === 'APPROVED' ? 'is-confirmed' : ''}`}>{u.kyc?.status || '—'}</span>
            <span>{u._count?.investments || 0}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
