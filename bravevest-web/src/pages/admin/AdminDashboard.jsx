import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownLeft,
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
  Clock3,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
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

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentKyc, setRecentKyc] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    const [statsResult, kycResult, txResult] = await Promise.allSettled([
      adminApi.dashboard(),
      adminApi.listKyc({ status: 'UNDER_REVIEW', limit: 5 }),
      adminApi.transactions({ limit: 6 }),
    ]);

    if (statsResult.status === 'fulfilled') setStats(statsResult.value);
    else setError('We could not load platform metrics. Please try again.');
    if (kycResult.status === 'fulfilled') setRecentKyc(kycResult.value?.data || []);
    if (txResult.status === 'fulfilled') setRecentTx(txResult.value?.data || []);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kycColumns = [
    {
      key: 'investor',
      label: 'Investor',
      render: (item) => (
        <div>
          <strong>{[item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ') || 'Investor'}</strong>
          <div className="admin-cell-subtitle">{item.user?.email || '—'}</div>
        </div>
      ),
    },
    { key: 'submittedAt', label: 'Submitted', render: (item) => formatDate(item.submittedAt) },
    { key: 'status', label: 'Status', render: (item) => <AdminTable.Status status={item.status} /> },
  ];

  const transactionColumns = [
    {
      key: 'reference',
      label: 'Reference',
      render: (item) => (
        <div>
          <span className="admin-mono">{item.reference}</span>
          <div className="admin-cell-subtitle">{item.user?.firstName} {item.user?.lastName}</div>
        </div>
      ),
    },
    { key: 'type', label: 'Type', render: (item) => <span className="admin-capitalize">{String(item.type || '—').replaceAll('_', ' ').toLowerCase()}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: (item) => <Currency value={item.amount} /> },
    { key: 'status', label: 'Status', render: (item) => <AdminTable.Status status={item.status} /> },
  ];

  const series = stats?.series || [];
  const queueItems = [
    { label: 'KYC reviews', value: stats?.pendingKyc ?? 0, icon: ShieldCheck, to: '/admin/kyc', tone: 'gold' },
    { label: 'Pending payments', value: stats?.pendingPayments ?? 0, icon: Clock3, to: '/admin/transactions', tone: 'blue' },
    { label: 'Open opportunities', value: stats?.openProjects ?? 0, icon: BriefcaseBusiness, to: '/admin/projects', tone: 'green' },
  ];

  if (loading) return <div className="admin-dashboard-loading"><Loader /></div>;

  return (
    <div className="admin-dashboard">
      <AdminPageHeader
        eyebrow="Platform operations"
        title="Overview"
        subtitle="A clear view of investor activity, capital deployed, and the work that needs attention."
        right={(
          <div className="admin-dashboard-actions">
            {lastUpdated && <span className="admin-updated">Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            <Button variant="secondary" size="sm" onClick={() => loadDashboard(true)} disabled={refreshing}>
              <RefreshCw size={14} className={refreshing ? 'admin-spin' : ''} />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </Button>
            <Button as={Link} to="/admin/projects/new" variant="primary" size="sm">Create opportunity</Button>
          </div>
        )}
      />

      {error && (
        <div className="admin-dashboard-alert" role="alert">
          <CircleAlert size={17} />
          <span>{error}</span>
          <button type="button" onClick={() => loadDashboard(true)}>Retry</button>
        </div>
      )}

      <section className="admin-grid-4 admin-dashboard-metrics" aria-label="Platform key metrics">
        <AdminStat label="Capital deployed" value={<Currency value={stats?.totalInvested || 0} compact />} hint="Confirmed and active investments" accent="green" />
        <AdminStat label="Investors" value={(stats?.totalInvestors || 0).toLocaleString()} hint="Registered investor accounts" />
        <AdminStat label="Active investments" value={(stats?.activeInvestments || 0).toLocaleString()} hint={`${(stats?.openProjects || 0).toLocaleString()} open opportunities`} />
        <AdminStat label="Needs attention" value={(stats?.pendingKyc || 0) + (stats?.pendingPayments || 0)} hint={`${stats?.pendingKyc || 0} KYC · ${stats?.pendingPayments || 0} payments`} accent="gold" />
      </section>

      <section className="admin-dashboard-main-grid">
        <AdminCard padded={false} className="admin-volume-card">
          <AdminCard.Header title="Capital deployed" subtitle="Monthly confirmed investment volume · last 6 months" />
          <AdminCard.Body>
            {series.length ? (
              <div className="admin-volume-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminVolumeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b3d941" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#b3d941" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#edf0e9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#73776f' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#73776f' }} tickFormatter={(value) => formatNaira(value, { compact: true })} width={72} />
                    <Tooltip
                      cursor={{ stroke: '#c4cfad', strokeDasharray: '4 4' }}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e6e9e1', fontSize: 12 }}
                      formatter={(value) => [formatNaira(value), 'Capital deployed']}
                    />
                    <Area type="monotone" dataKey="invested" stroke="#769c17" strokeWidth={2.5} fill="url(#adminVolumeFill)" activeDot={{ r: 5, fill: '#769c17' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="admin-chart-empty">Monthly investment activity will appear here as confirmed investments are recorded.</div>
            )}
          </AdminCard.Body>
        </AdminCard>

        <AdminCard className="admin-queue-card">
          <AdminCard.Header title="Operations queue" subtitle="Items requiring team attention" />
          <div className="admin-queue-list">
            {queueItems.map(({ label, value, icon: Icon, to, tone }) => (
              <Link to={to} className="admin-queue-item" key={label}>
                <span className={`admin-queue-icon admin-queue-icon--${tone}`}><Icon size={17} /></span>
                <span className="admin-queue-label">{label}</span>
                <strong className="admin-queue-count">{value}</strong>
                <ArrowRight size={15} className="admin-queue-arrow" />
              </Link>
            ))}
          </div>
          <div className="admin-queue-footer">
            <FileCheck2 size={15} />
            Review outstanding items regularly to keep onboarding moving.
          </div>
        </AdminCard>
      </section>

      <section className="admin-grid-2 admin-dashboard-tables">
        <AdminCard padded={false}>
          <AdminCard.Header
            title="KYC review queue"
            subtitle={`${stats?.pendingKyc || 0} awaiting review`}
            right={<Link to="/admin/kyc" className="admin-viewall">Open queue <ArrowRight size={13} /></Link>}
          />
          <AdminCard.Body>
            {recentKyc.length ? <AdminTable columns={kycColumns} rows={recentKyc} /> : <AdminEmpty title="KYC queue is clear" description="New submissions awaiting review will appear here." />}
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header
            title="Latest transactions"
            subtitle="Recent platform payment activity"
            right={<Link to="/admin/transactions" className="admin-viewall">All transactions <ArrowRight size={13} /></Link>}
          />
          <AdminCard.Body>
            {recentTx.length ? <AdminTable columns={transactionColumns} rows={recentTx} /> : <AdminEmpty title="No transactions yet" description="Investor payments will be shown here." />}
          </AdminCard.Body>
        </AdminCard>
      </section>

      <div className="admin-dashboard-footnote">
        <ArrowDownLeft size={14} />
        Figures reflect platform records; capital deployed includes confirmed and active investments only.
        <Link to="/admin/reports">View reports</Link>
        <span className="admin-footnote-spacer" />
        <Users size={14} />
        Investor data is visible to authorized administrators only.
      </div>
    </div>
  );
}
