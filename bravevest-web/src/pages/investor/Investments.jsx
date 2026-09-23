import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Button from '@/components/shared/Button';
import { investmentsApi } from '@/api/investments';
import './Investments.css';

export default function Investments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.list({ limit: 50 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminPageHeader
        eyebrow="Investor"
        title="My Investments"
        subtitle="Every project you've backed — pending and confirmed."
        right={<Button as={Link} to="/marketplace" variant="primary" size="sm">New investment</Button>}
      />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : items.length === 0 ? (
        <AdminEmpty
          title="No investments yet"
          body="Browse the marketplace to find your first opportunity."
          action={<Button as={Link} to="/marketplace" variant="primary" size="md">Browse marketplace</Button>}
        />
      ) : (
        <div className="inv-table-wrap">
          <div className="inv-table">
            <div className="inv-table__head">
              <span>Project</span><span>Amount</span><span>Expected</span><span>Status</span>
            </div>
            {items.map((i) => (
              <Link key={i.id} to={'/investments/' + i.id} className="inv-table__row">
                <span className="inv-table__title">{i.project?.title || '—'}</span>
                <span><Currency value={i.amount} /></span>
                <span><Currency value={i.expectedReturn} /></span>
                <span className={'inv-table__status is-' + i.status.toLowerCase()}>{i.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
