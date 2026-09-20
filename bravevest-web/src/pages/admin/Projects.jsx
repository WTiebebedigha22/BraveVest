import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.adminProjects().then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${items.length} total`}
        right={<Button as={Link} to="/admin/projects/new" variant="primary" size="sm">New project</Button>}
      />
      <div className="inv-table">
        <div className="inv-table__head"><span>Title</span><span>Category</span><span>Status</span><span>Raised</span></div>
        {items.map((p) => (
          <Link key={p.id} to={`/admin/projects/${p.id}/edit`} className="inv-table__row">
            <span>{p.title}</span>
            <span>{p.category}</span>
            <span className="inv-table__status">{p.status}</span>
            <span><Currency value={p.raisedAmount} /></span>
          </Link>
        ))}
      </div>
    </>
  );
}
