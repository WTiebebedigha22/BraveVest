import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStat from '@/components/admin/AdminStat';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
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
    { key: 'user', label: 'Investor', render: (k) => <strong>{k.user?.firstName} {k.user?.lastName}</strong> },
    { key: 'email', label: 'Email', render: (k) => <span className="text-muted">{k.user?.email}</span> },
    { key: 'submitted', label: 'Submitted', render: (k) => k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: (k) => <AdminTable.Status status={k.status} /> },
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

      <div className="admin-grid-4 mb-4">
        <AdminStat label="Total Investors" value={stats?.totalInvestors || 0} hint="Registered accounts" />
        <AdminStat label="Active Investments" value={stats?.activeInvestments || 0} hint="Confirmed & active" />
        <AdminStat label="Total Invested" value={<Currency value={stats?.totalInvested || 0} compact />} hint="All-time" accent="green" />
        <AdminStat label="Pending KYC" value={stats?.pendingKyc || 0} hint="Awaiting review" accent="gold" />
      </div>

      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header title="Investment volume" subtitle="Last 6 months" />
        <AdminCard.Body>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.series || []} barCategoryGap={22}>
                <CartesianGrid vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B6B6B' }} tickFormatter={(v) => formatNaira(v, { compact: true })} width={70} />
                <Tooltip cursor={{ fill: 'rgba(15,15,16,.04)' }} contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }} formatter={(v) => [formatNaira(v), 'Invested']} />
                <Bar dataKey="invested" fill="#B3D941" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard.Body>
      </AdminCard>

      <div className="admin-grid-2">
        <AdminCard padded={false}>
          <AdminCard.Header title="Pending KYC" subtitle={recentKyc.length + ' awaiting review'} right={<Link to="/admin/kyc" className="admin-viewall">View all →</Link>} />
          <AdminCard.Body>
            {recentKyc.length === 0 ? <AdminEmpty title="No pending KYC" /> : <AdminTable columns={kycCols} rows={recentKyc} />}
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Recent transactions" subtitle="Latest activity" right={<Link to="/admin/transactions" className="admin-viewall">View all →</Link>} />
          <AdminCard.Body>
            {recentTx.length === 0 ? <AdminEmpty title="No transactions yet" /> : <AdminTable columns={txCols} rows={recentTx} />}
          </AdminCard.Body>
        </AdminCard>
      </div>
    </>
  );
}
