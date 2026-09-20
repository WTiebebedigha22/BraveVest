import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/investor/StatCard';
import Loader from '@/components/shared/Loader';
import { investmentsApi } from '@/api/investments';

export default function Portfolio() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { investmentsApi.portfolio().then((d) => setS(d.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <>
      <PageHeader title="Portfolio" subtitle="Your total exposure at a glance." />
      <div className="grid grid-3">
        <StatCard label="Total invested" value={s?.totalInvested || 0} currency />
        <StatCard label="Expected returns" value={s?.totalExpected || 0} currency accent="green" />
        <StatCard label="Active investments" value={s?.activeCount || 0} />
      </div>
    </>
  );
}
