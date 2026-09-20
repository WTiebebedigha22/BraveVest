import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { investmentsApi } from '@/api/investments';
import { formatNaira } from '@/utils/format';
import Loader from '@/components/shared/Loader';
import './PortfolioChart.css';

export default function PortfolioChart() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.series()
      .then((r) => setSeries(r.data || []))
      .catch(() => setSeries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pchart pchart--empty"><Loader /></div>;
  if (!series.length) return <div className="pchart pchart--empty">No investment history yet.</div>;

  const total = series[series.length - 1]?.cumulative || 0;

  return (
    <div className="pchart">
      <div className="pchart__head">
        <div>
          <div className="pchart__label">Portfolio Growth</div>
          <div className="pchart__big">{formatNaira(total)}</div>
        </div>
        <div className="pchart__range">Last 6 months</div>
      </div>
      <div className="pchart__chart">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={series} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} barCategoryGap={14}>
            <CartesianGrid vertical={false} stroke="#E5E5E5" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(15,15,16,.04)' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
              formatter={(v) => [formatNaira(v), 'Invested']}
            />
            <Bar dataKey="invested" fill="#C9A6F2" radius={[0, 0, 0, 0]} />
            <Bar dataKey="cumulative" fill="#B3D941" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="pchart__legend">
        <span><i className="pchart__dot pchart__dot--lav" /> Monthly</span>
        <span><i className="pchart__dot pchart__dot--lime" /> Cumulative</span>
      </div>
    </div>
  );
}
