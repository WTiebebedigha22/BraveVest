import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStat from '@/components/admin/AdminStat';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import { formatNaira } from '@/utils/format';
import './Dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentKyc, setRecentKyc] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.dashboard().catch(() => null),
      adminApi.listKyc({ status: 'UNDER_REVIEW', limit: 5 }).catch(() => ({ data: [] })),
      adminApi.transactions({ limit: 5 }).catch(() => ({ data: [] })),
    ])
      .then(([s, k, t]) => {
        setStats(s);
        setRecentKyc(k?.data || []);
        setRecentTx(t?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  const kycCols = [
    {
      key: 'user', label: 'Investor',
      render: (k) => <strong>{k.user?.firstName} {k.user?.lastName}</strong>,
    },
    { key: 'email', label: 'Email', render: (k) => <span className="text-muted">{k.user?.email}</span> },
    {
      key: 'submitted', label: 'Submitted',
      render: (k) => k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '—',
    },
    {
      key: 'status', label: 'Status',
      render: (k) => <AdminTable.Status status={k.status} />,
    },
  ];

  const txCols = [
    { key: 'reference', label: 'Reference', render: (t) => <span className="admin-mono">{t.reference}</span> },
    { key: 'email', label: 'Investor', render: (t) => t.user?.email || '—' },
    { key: 'amount', label: 'Amount', align: 'right', render: (t) => <Currency value={t.amount} /> },
    { key: 'status', label: 'Status', render: (t) => <AdminTable.Status status={t.status} /> },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Overview"
        subtitle="Platform activity at a glance"
        right={
          <>
            <Button as={Link} to="/admin/projects/new" variant="secondary" size="sm">New project</Button>
            <Button as={Link} to="/admin/kyc" variant="primary" size="sm">Review KYC</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="admin-grid-4 mb-4">
        <AdminStat
          label="Total Investors"
          value={stats?.totalInvestors || 0}
          hint="Registered accounts"
          icon={<UsersIcon />}
        />
        <AdminStat
          label="Active Investments"
          value={stats?.activeInvestments || 0}
          hint="Confirmed & active"
          icon={<TrendIcon />}
        />
        <AdminStat
          label="Total Invested"
          value={<Currency value={stats?.totalInvested || 0} compact />}
          hint="All-time"
          accent="green"
          icon={<CoinsIcon />}
        />
        <AdminStat
          label="Pending KYC"
          value={stats?.pendingKyc || 0}
          hint="Awaiting review"
          accent="gold"
          icon={<ShieldIcon />}
        />
      </div>

      {/* Chart */}
      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header
          title="Investment volume"
          subtitle="Last 6 months"
        />
        <AdminCard.Body>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.series || []} barCategoryGap={22}>
                <CartesianGrid vertical={false} stroke="#E5E5E5" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B6B6B' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B6B6B' }}
                  tickFormatter={(v) => formatNaira(v, { compact: true })}
                  width={70}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15,15,16,.04)' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                  formatter={(v) => [formatNaira(v), 'Invested']}
                />
                <Bar dataKey="invested" fill="#B3D941" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard.Body>
      </AdminCard>

      {/* Two panels */}
      <div className="admin-grid-2">
        <AdminCard padded={false}>
          <AdminCard.Header
            title="Pending KYC"
            subtitle={`${recentKyc.length} awaiting review`}
            right={<Link to="/admin/kyc" className="admin-viewall">View all →</Link>}
          />
          <AdminCard.Body>
            <AdminTable columns={kycCols} rows={recentKyc} empty="No pending KYC submissions." />
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header
            title="Recent transactions"
            subtitle="Latest activity"
            right={<Link to="/admin/transactions" className="admin-viewall">View all →</Link>}
          />
          <AdminCard.Body>
            <AdminTable columns={txCols} rows={recentTx} empty="No transactions yet." />
          </AdminCard.Body>
        </AdminCard>
      </div>
    </>
  );
}

/* ── Icons ── */
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.5 3.2-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 18l5-6 4 3 7-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CoinsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 7a6 6 0 110 10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
