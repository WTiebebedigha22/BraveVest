import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';

export default function AdminKycList() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('UNDER_REVIEW');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.listKyc({ limit: 100 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'ALL') out = out.filter((k) => k.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((k) =>
        (k.user?.firstName + ' ' + k.user?.lastName).toLowerCase().includes(q) ||
        k.user?.email?.toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const columns = [
    {
      key: 'user', label: 'Investor',
      render: (k) => (
        <div className="inv-row">
          <div className="inv-row__avatar">{(k.user?.firstName || 'U')[0]}{(k.user?.lastName || '')[0] || ''}</div>
          <div>
            <div className="inv-row__name">{k.user?.firstName} {k.user?.lastName}</div>
            <div className="inv-row__meta">{k.user?.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'id', label: 'ID type', render: (k) => <span className="text-muted">{k.idType || '—'}</span> },
    {
      key: 'submitted', label: 'Submitted',
      render: (k) => k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '—',
    },
    { key: 'status', label: 'Status', render: (k) => <AdminTable.Status status={k.status} /> },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  const counts = {
    UNDER_REVIEW: items.filter((k) => k.status === 'UNDER_REVIEW').length,
    APPROVED: items.filter((k) => k.status === 'APPROVED').length,
    REJECTED: items.filter((k) => k.status === 'REJECTED').length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="KYC Review"
        subtitle={`${counts.UNDER_REVIEW} awaiting review`}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={filter === 'UNDER_REVIEW'} onClick={() => setFilter('UNDER_REVIEW')}>
              Pending {counts.UNDER_REVIEW > 0 && `(${counts.UNDER_REVIEW})`}
            </AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'APPROVED'} onClick={() => setFilter('APPROVED')}>
              Approved
            </AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'REJECTED'} onClick={() => setFilter('REJECTED')}>
              Rejected
            </AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search value={search} onChange={setSearch} placeholder="Search by name or email…" />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty
          title={filter === 'UNDER_REVIEW' ? 'No pending KYC' : 'Nothing to show'}
          body={filter === 'UNDER_REVIEW' ? 'When investors submit KYC, they appear here for review.' : 'Try a different filter or search term.'}
        />
      ) : (
        <AdminTable columns={columns} rows={filtered} onRowClick={(k) => nav('/admin/kyc/' + k.id)} />
      )}
    </>
  );
}
