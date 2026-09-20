import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';

export default function AdminInvestments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.investments().then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <>
      <PageHeader title="All Investments" subtitle={`${items.length} records`} />
      <div className="inv-table">
        <div className="inv-table__head"><span>Investor</span><span>Project</span><span>Amount</span><span>Status</span></div>
        {items.map((i) => (
          <div key={i.id} className="inv-table__row">
            <span>{i.user?.email}</span>
            <span>{i.project?.title}</span>
            <span><Currency value={i.amount} /></span>
            <span className="inv-table__status">{i.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
