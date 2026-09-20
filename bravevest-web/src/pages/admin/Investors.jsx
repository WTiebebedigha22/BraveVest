import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';
import './Investors.css';

export default function AdminInvestors() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('ALL');

  useEffect(() => {
    adminApi.investors({ limit: 100 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (kycFilter !== 'ALL') {
      out = out.filter((u) => (u.kyc?.status || 'NOT_STARTED') === kycFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((u) =>
        (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').includes(q)
      );
    }
    return out;
  }, [items, search, kycFilter]);

  const columns = [
    {
      key: 'name', label: 'Name',
      render: (u) => (
        <div className="inv-row">
          <div className="inv-row__avatar">{(u.firstName || 'U')[0]}{(u.lastName || '')[0] || ''}</div>
          <div>
            <div className="inv-row__name">{u.firstName} {u.lastName}</div>
            <div className="inv-row__meta">{u.phone || 'No phone'}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (u) => <span className="text-muted">{u.email}</span> },
    {
      key: 'kyc', label: 'KYC',
      render: (u) => <AdminTable.Status status={u.kyc?.status || 'NOT_STARTED'} />,
    },
    {
      key: 'status', label: 'Account',
      render: (u) => <AdminTable.Status status={u.status} />,
    },
    {
      key: 'investments', label: 'Investments', align: 'right',
      render: (u) => <strong>{u._count?.investments || 0}</strong>,
    },
    {
      key: 'joined', label: 'Joined', align: 'right',
      render: (u) => <span className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Investors"
        subtitle={`${items.length} registered investors`}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={kycFilter === 'ALL'} onClick={() => setKycFilter('ALL')}>All</AdminToolbar.Pill>
            <AdminToolbar.Pill active={kycFilter === 'APPROVED'} onClick={() => setKycFilter('APPROVED')}>Approved</AdminToolbar.Pill>
            <AdminToolbar.Pill active={kycFilter === 'UNDER_REVIEW'} onClick={() => setKycFilter('UNDER_REVIEW')}>Pending</AdminToolbar.Pill>
            <AdminToolbar.Pill active={kycFilter === 'REJECTED'} onClick={() => setKycFilter('REJECTED')}>Rejected</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, phone…"
        />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty
          title={search ? 'No matches' : 'No investors yet'}
          body={search ? 'Try a different search term or filter.' : 'Investors will appear here once they register.'}
        />
      ) : (
        <AdminTable columns={columns} rows={filtered} onRowClick={(u) => nav('/admin/investors/' + u.id)} />
      )}
    </>
  );
}
