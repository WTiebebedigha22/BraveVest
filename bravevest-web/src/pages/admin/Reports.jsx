import { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import AdminStat from '@/components/admin/AdminStat';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import { formatNaira } from '@/utils/format';
import './Reports.css';

const PALETTE = ['#3FB8C4', '#B3D941', '#C9A6F2', '#F2C94C', '#EB5757', '#6FCF97'];

export default function AdminReports() {
  const [range, setRange] = useState('6M');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    Promise.all([
      adminApi.dashboard().catch(() => null),
      adminApi.investments({ limit: 500 }).catch(() => ({ data: [] })),
      adminApi.transactions({ limit: 500 }).catch(() => ({ data: [] })),
      adminApi.investors({ limit: 500 }).catch(() => ({ data: [] })),
    ])
      .then(([s, i, t, u]) => {
        setStats(s);
        setInvestments(i?.data || []);
        setTransactions(t?.data || []);
        setInvestors(u?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived data ── */

  const monthsBack = range === '3M' ? 3 : range === '12M' ? 12 : 6;

  // Investment volume over time
  const volumeSeries = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleString('en-NG', { month: 'short' }),
        invested: 0,
        transactions: 0,
      });
    }
    for (const inv of investments) {
      const d = new Date(inv.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.find((x) => x.key === key);
      if (b && ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(inv.status)) {
        b.invested += Number(inv.amount);
      }
    }
    for (const tx of transactions) {
      const d = new Date(tx.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const b = buckets.find((x) => x.key === key);
      if (b && tx.status === 'SUCCESS') b.transactions += 1;
    }
    return buckets;
  }, [investments, transactions, monthsBack]);

  // Status breakdown for investments
  const investmentStatusSeries = useMemo(() => {
    const map = {};
    for (const inv of investments) {
      map[inv.status] = (map[inv.status] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [investments]);

  // Transaction status breakdown
  const transactionStatusSeries = useMemo(() => {
    const map = {};
    for (const tx of transactions) {
      map[tx.status] = (map[tx.status] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Top projects by raised amount
  const topProjects = useMemo(() => {
    const map = {};
    for (const inv of investments) {
      if (!['CONFIRMED', 'ACTIVE', 'MATURED'].includes(inv.status)) continue;
      const key = inv.project?.title || 'Unknown';
      map[key] = (map[key] || 0) + Number(inv.amount);
    }
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [investments]);

  // Top investors
  const topInvestors = useMemo(() => {
    const map = {};
    for (const inv of investments) {
      if (!['CONFIRMED', 'ACTIVE', 'MATURED'].includes(inv.status)) continue;
      const key = inv.user?.email || 'Unknown';
      map[key] = (map[key] || 0) + Number(inv.amount);
    }
    return Object.entries(map)
      .map(([email, total]) => ({ email, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [investments]);

  // Success rate
  const txSuccessRate = useMemo(() => {
    if (!transactions.length) return 0;
    const success = transactions.filter((t) => t.status === 'SUCCESS').length;
    return Math.round((success / transactions.length) * 100);
  }, [transactions]);

  // Average investment
  const avgInvestment = useMemo(() => {
    const active = investments.filter((i) => ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(i.status));
    if (!active.length) return 0;
    return active.reduce((s, i) => s + Number(i.amount), 0) / active.length;
  }, [investments]);

  const kycApproved = investors.filter((u) => u.kyc?.status === 'APPROVED').length;
  const kycApprovalRate = investors.length ? Math.round((kycApproved / investors.length) * 100) : 0;

  /* ── CSV export ── */
  function exportCSV() {
    const rows = [
      ['Reference', 'Investor', 'Project', 'Amount (NGN)', 'Status', 'Type', 'Date'],
      ...transactions.map((t) => [
        t.reference,
        t.user?.email || '',
        t.investment?.project?.title || '',
        Number(t.amount).toFixed(2),
        t.status,
        t.type,
        new Date(t.createdAt).toISOString().slice(0, 10),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bravevest-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Reports"
        subtitle="Platform analytics and exports"
        right={
          <>
            <div className="reports-range">
              {['3M', '6M', '12M'].map((r) => (
                <button
                  key={r}
                  className={`reports-range__btn ${range === r ? 'is-active' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={exportCSV} disabled={!transactions.length}>
              Export CSV
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="reports-grid-4 mb-4">
        <AdminStat
          label="Total invested"
          value={<Currency value={stats?.totalInvested || 0} compact />}
          hint={`${investments.length} investments`}
          accent="green"
        />
        <AdminStat
          label="Average investment"
          value={<Currency value={avgInvestment} compact />}
          hint="Per active investment"
        />
        <AdminStat
          label="Success rate"
          value={txSuccessRate + '%'}
          hint={`${transactions.length} transactions`}
        />
        <AdminStat
          label="KYC approval rate"
          value={kycApprovalRate + '%'}
          hint={`${kycApproved} of ${investors.length} approved`}
          accent="gold"
        />
      </div>

      {/* Volume chart */}
      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header
          title="Investment volume"
          subtitle={`Last ${monthsBack} months`}
        />
        <AdminCard.Body>
          <div className="reports-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeSeries} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
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
                  width={80}
                />
                <Tooltip
                  cursor={{ stroke: '#0F0F10', strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                  formatter={(v, name) => [formatNaira(v), name]}
                />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#B3D941"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#B3D941' }}
                  activeDot={{ r: 6 }}
                  name="Invested"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard.Body>
      </AdminCard>

      {/* Charts grid */}
      <div className="reports-grid-3 mb-4">
        {/* Investment status donut */}
        <AdminCard padded={false}>
          <AdminCard.Header title="Investments by status" />
          <AdminCard.Body>
            {investmentStatusSeries.length === 0 ? (
              <AdminEmpty title="No investments yet" />
            ) : (
              <div className="reports-chart-small">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investmentStatusSeries}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {investmentStatusSeries.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(v) => <span style={{ fontSize: 11.5 }}>{v.replace(/_/g, ' ')}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminCard.Body>
        </AdminCard>

        {/* Transaction status donut */}
        <AdminCard padded={false}>
          <AdminCard.Header title="Transactions by status" />
          <AdminCard.Body>
            {transactionStatusSeries.length === 0 ? (
              <AdminEmpty title="No transactions yet" />
            ) : (
              <div className="reports-chart-small">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionStatusSeries}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {transactionStatusSeries.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(v) => <span style={{ fontSize: 11.5 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminCard.Body>
        </AdminCard>

        {/* Monthly transaction count */}
        <AdminCard padded={false}>
          <AdminCard.Header title="Monthly transactions" />
          <AdminCard.Body>
            <div className="reports-chart-small">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeSeries} barCategoryGap={18}>
                  <CartesianGrid vertical={false} stroke="#E5E5E5" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B6B6B' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(15,15,16,.04)' }}
                    contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                  />
                  <Bar dataKey="transactions" fill="#3FB8C4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AdminCard.Body>
        </AdminCard>
      </div>

      {/* Leaderboards */}
      <div className="reports-grid-2">
        <AdminCard padded={false}>
          <AdminCard.Header title="Top projects" subtitle="By confirmed investment" />
          <AdminCard.Body>
            {topProjects.length === 0 ? (
              <AdminEmpty title="No data yet" />
            ) : (
              <div className="reports-list">
                {topProjects.map((p, i) => (
                  <div key={p.name} className="reports-list__row">
                    <span className="reports-list__rank">{i + 1}</span>
                    <span className="reports-list__name">{p.name}</span>
                    <span className="reports-list__value"><Currency value={p.total} compact /></span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Top investors" subtitle="By total amount invested" />
          <AdminCard.Body>
            {topInvestors.length === 0 ? (
              <AdminEmpty title="No data yet" />
            ) : (
              <div className="reports-list">
                {topInvestors.map((u, i) => (
                  <div key={u.email} className="reports-list__row">
                    <span className="reports-list__rank">{i + 1}</span>
                    <span className="reports-list__name">{u.email}</span>
                    <span className="reports-list__value"><Currency value={u.total} compact /></span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard.Body>
        </AdminCard>
      </div>
    </>
  );
}
