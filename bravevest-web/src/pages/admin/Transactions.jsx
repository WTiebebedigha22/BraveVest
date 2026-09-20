import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.transactions().then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <>
      <PageHeader title="Transactions" subtitle={`${items.length} records`} />
      <div className="inv-table">
        <div className="inv-table__head"><span>Reference</span><span>User</span><span>Amount</span><span>Status</span></div>
        {items.map((t) => (
          <div key={t.id} className="inv-table__row">
            <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.reference}</span>
            <span>{t.user?.email}</span>
            <span><Currency value={t.amount} /></span>
            <span className="inv-table__status">{t.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
