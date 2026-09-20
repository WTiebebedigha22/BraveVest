import { useEffect, useState, useMemo } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.transactions({ limit: 200 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'ALL') out = out.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((t) =>
        t.reference?.toLowerCase().includes(q) ||
        t.user?.email?.toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const columns = [
    { key: 'reference', label: 'Reference', render: (t) => <span className="admin-mono">{t.reference}</span> },
    { key: 'investor', label: 'Investor', render: (t) => <strong>{t.user?.email || '—'}</strong> },
    { key: 'type', label: 'Type', render: (t) => <span className="text-muted">{t.type}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: (t) => <Currency value={t.amount} /> },
    { key: 'status', label: 'Status', render: (t) => <AdminTable.Status status={t.status} /> },
    { key: 'date', label: 'Date', align: 'right', render: (t) => new Date(t.createdAt).toLocaleDateString() },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Transactions"
        subtitle={`${items.length} total recorded`}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'SUCCESS'} onClick={() => setFilter('SUCCESS')}>Success</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'PENDING'} onClick={() => setFilter('PENDING')}>Pending</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'FAILED'} onClick={() => setFilter('FAILED')}>Failed</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search value={search} onChange={setSearch} placeholder="Search reference or email…" />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty title="No transactions match" body="Try a different filter or search term." />
      ) : (
        <AdminTable columns={columns} rows={filtered} />
      )}
    </>
  );
}
