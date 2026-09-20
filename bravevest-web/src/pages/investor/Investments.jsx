import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
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
      <PageHeader title="My Investments" subtitle="Every project you've backed — pending and confirmed." />
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="text-muted">No investments yet. <Link to="/marketplace">Browse marketplace →</Link></div>
      ) : (
        <div className="inv-table">
          <div className="inv-table__head">
            <span>Project</span><span>Amount</span><span>Expected</span><span>Status</span>
          </div>
          {items.map((i) => (
            <Link key={i.id} to={`/investments/${i.id}`} className="inv-table__row">
              <span className="inv-table__title">{i.project?.title}</span>
              <span><Currency value={i.amount} /></span>
              <span><Currency value={i.expectedReturn} /></span>
              <span className={`inv-table__status is-${i.status.toLowerCase()}`}>{i.status}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
