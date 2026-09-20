import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/investor/StatCard';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';
import { formatNaira } from '@/utils/format';
import './Dashboard.css';

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminApi.dashboard().then(setS).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Admin Overview" subtitle="Platform health at a glance." />

      <div className="grid grid-4 mb-4">
        <StatCard label="Total Investors" value={s?.totalInvestors || 0} />
        <StatCard label="Active Investments" value={s?.activeInvestments || 0} />
        <StatCard label="Total Invested" value={s?.totalInvested || 0} currency />
        <StatCard label="Pending KYC" value={s?.pendingKyc || 0} />
      </div>

      <div className="dash-card">
        <div className="dash-card__head">
          <h3>Investment volume</h3>
          <span className="dash-card__link">Last 6 months</span>
        </div>
        <div style={{ marginTop: 16, height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s?.series || []} barCategoryGap={18}>
              <CartesianGrid vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} />
              <Tooltip
                cursor={{ fill: 'rgba(15,15,16,.04)' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                formatter={(v) => [formatNaira(v), 'Invested']}
              />
              <Bar dataKey="invested" fill="#B3D941" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
