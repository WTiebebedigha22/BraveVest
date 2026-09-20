import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import './Projects.css';

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.adminProjects({ limit: 100 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'ALL') out = out.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const columns = [
    {
      key: 'title', label: 'Project',
      render: (p) => (
        <div>
          <div className="proj-title">{p.title}</div>
          <div className="proj-meta">{p.category.replace(/_/g, ' ')} · {p.location || 'No location'}</div>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (p) => <AdminTable.Status status={p.status} />,
    },
    {
      key: 'target', label: 'Target', align: 'right',
      render: (p) => <Currency value={p.targetAmount} compact />,
    },
    {
      key: 'raised', label: 'Raised', align: 'right',
      render: (p) => (
        <div className="proj-raised">
          <Currency value={p.raisedAmount} compact />
          <div className="proj-progress"><div className="proj-progress__bar" style={{ width: p.percentFunded + '%' }} /></div>
        </div>
      ),
    },
    {
      key: 'funded', label: 'Funded', align: 'right',
      render: (p) => <span className="text-muted">{p.percentFunded}%</span>,
    },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Projects"
        subtitle={`${items.length} total across the marketplace`}
        right={<Button as={Link} to="/admin/projects/new" variant="primary" size="sm">+ New project</Button>}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'OPEN'} onClick={() => setFilter('OPEN')}>Open</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'FUNDED'} onClick={() => setFilter('FUNDED')}>Funded</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'CLOSED'} onClick={() => setFilter('CLOSED')}>Closed</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search value={search} onChange={setSearch} placeholder="Search projects…" />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty
          title="No projects yet"
          body="Create your first marketplace project to get started."
          action={<Button as={Link} to="/admin/projects/new" variant="primary" size="md">Create project</Button>}
        />
      ) : (
        <AdminTable
          columns={columns}
          rows={filtered}
          onRowClick={(p) => window.location.href = '/#/admin/projects/' + p.id + '/edit'}
        />
      )}
    </>
  );
}
