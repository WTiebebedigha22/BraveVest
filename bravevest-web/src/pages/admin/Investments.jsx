import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, RotateCcw } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import PortalLayout from '@/components/layout/PortalLayout';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminInvestments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  async function loadInvestments() {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.investments({ limit: 200 });
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load investments');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvestments();
  }, []);

  // Compute status counts for pills
  const counts = useMemo(() => {
    return items.reduce((acc, curr) => {
      const s = curr.status || 'UNKNOWN';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'ALL') out = out.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((i) =>
        i.user?.email?.toLowerCase().includes(q) ||
        i.user?.firstName?.toLowerCase().includes(q) ||
        i.user?.lastName?.toLowerCase().includes(q) ||
        i.project?.title?.toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  const columns = [
    {
      key: 'investor',
      label: 'Investor',
      render: (i) => {
        const name = [i.user?.firstName, i.user?.lastName].filter(Boolean).join(' ') || 'Investor';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--bv-accent)', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11, flexShrink: 0,
            }}>
              {name[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--bv-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i.user?.email || '—'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'project',
      label: 'Project',
      render: (i) => (
        <span style={{ fontWeight: 500, color: 'var(--bv-text)' }}>
          {i.project?.title || '—'}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Invested',
      align: 'right',
      render: (i) => <strong style={{ color: 'var(--bv-text)' }}><Currency value={i.amount} /></strong>
    },
    {
      key: 'expected',
      label: 'Expected Return',
      align: 'right',
      render: (i) => <span style={{ color: 'var(--bv-success)' }}><Currency value={i.expectedReturn} /></span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (i) => <AdminTable.Status status={i.status} />
    },
    {
      key: 'date',
      label: 'Date',
      align: 'right',
      render: (i) => (
        <span style={{ fontSize: 12, color: 'var(--bv-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (i) => (
        <Link
          to={`/admin/investments/${i.id}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: 'var(--bv-surface)', color: 'var(--bv-text)',
            textDecoration: 'none', fontSize: 12, fontWeight: 600,
          }}
        >
          View <ChevronRight size={12} />
        </Link>
      )
    }
  ];

  return (
    <PortalLayout>
      <AdminShell
        title="Investments"
        description={`${items.length} total across all investor portfolios`}
        actions={
          <button
            onClick={loadInvestments}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bv-surface)', color: 'var(--bv-text)',
              border: '1px solid var(--bv-border)', fontWeight: 600, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RotateCcw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      >
        <AdminToolbar
          right={
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
                All ({items.length})
              </AdminToolbar.Pill>
              <AdminToolbar.Pill active={filter === 'ACTIVE'} onClick={() => setFilter('ACTIVE')}>
                Active ({counts.ACTIVE || 0})
              </AdminToolbar.Pill>
              <AdminToolbar.Pill active={filter === 'CONFIRMED'} onClick={() => setFilter('CONFIRMED')}>
                Confirmed ({counts.CONFIRMED || 0})
              </AdminToolbar.Pill>
              <AdminToolbar.Pill active={filter === 'PENDING'} onClick={() => setFilter('PENDING')}>
                Pending ({counts.PENDING || 0})
              </AdminToolbar.Pill>
              <AdminToolbar.Pill active={filter === 'MATURED'} onClick={() => setFilter('MATURED')}>
                Matured ({counts.MATURED || 0})
              </AdminToolbar.Pill>
            </div>
          }
        >
          <AdminToolbar.Search 
            value={search} 
            onChange={setSearch} 
            placeholder="Search investor name, email or project…" 
          />
        </AdminToolbar>

        {loading ? (
          <div className="text-center py-5" style={{ padding: '60px 0' }}><Loader /></div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', textAlign: 'center' }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmpty 
            title="No investments found" 
            body={search || filter !== 'ALL' ? "No records match your current search or filter criteria." : "No investments have been logged on the platform yet."} 
          />
        ) : (
          <AdminTable columns={columns} rows={filtered} />
        )}
      </AdminShell>
    </PortalLayout>
  );
}