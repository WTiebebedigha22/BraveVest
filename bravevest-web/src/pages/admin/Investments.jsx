import { useEffect, useState, useMemo } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';

export default function AdminInvestments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.investments({ limit: 200 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'ALL') out = out.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((i) =>
        i.user?.email?.toLowerCase().includes(q) ||
        i.project?.title?.toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const columns = [
    { key: 'investor', label: 'Investor', render: (i) => <strong>{i.user?.email || '—'}</strong> },
    { key: 'project', label: 'Project', render: (i) => <span className="text-muted">{i.project?.title || '—'}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: (i) => <Currency value={i.amount} /> },
    { key: 'expected', label: 'Expected', align: 'right', render: (i) => <span className="text-muted"><Currency value={i.expectedReturn} /></span> },
    { key: 'status', label: 'Status', render: (i) => <AdminTable.Status status={i.status} /> },
    { key: 'date', label: 'Date', align: 'right', render: (i) => new Date(i.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Investments"
        subtitle={`${items.length} total across all investors`}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'ACTIVE'} onClick={() => setFilter('ACTIVE')}>Active</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'CONFIRMED'} onClick={() => setFilter('CONFIRMED')}>Confirmed</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'PENDING'} onClick={() => setFilter('PENDING')}>Pending</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'MATURED'} onClick={() => setFilter('MATURED')}>Matured</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search value={search} onChange={setSearch} placeholder="Search investor or project…" />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty title="No investments match" body="Try a different filter or search term." />
      ) : (
        <AdminTable columns={columns} rows={filtered} />
      )}
    </>
  );
}
