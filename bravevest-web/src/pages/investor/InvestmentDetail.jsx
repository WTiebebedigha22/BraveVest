import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { investmentsApi } from '@/api/investments';
import { paymentsApi } from '@/api/payments';

export default function InvestmentDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.get(id).then((d) => setInv(d.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function payNow() {
    const res = await paymentsApi.initialize(id);
    if (res.data?.authorizationUrl) window.location.href = res.data.authorizationUrl;
  }

  if (loading) return <Loader />;
  if (!inv) return <div>Investment not found. <Link to="/investments">← Back</Link></div>;

  return (
    <>
      <Link to="/investments" style={{ fontSize: 13, color: 'var(--gray-600)' }}>← All investments</Link>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 40, marginTop: 16 }}>{inv.project?.title}</h1>
      <p className="text-muted">Status: {inv.status}</p>
      <div className="grid grid-3 mt-3">
        <div className="dash-card"><div className="dash-card__head"><h3>Invested</h3></div><div className="dash-card__value"><Currency value={inv.amount} /></div></div>
        <div className="dash-card"><div className="dash-card__head"><h3>Expected return</h3></div><div className="dash-card__value"><Currency value={inv.expectedReturn} /></div></div>
        <div className="dash-card"><div className="dash-card__head"><h3>Actual return</h3></div><div className="dash-card__value"><Currency value={inv.actualReturn} /></div></div>
      </div>
      {inv.status === 'PENDING' && (
        <button className="btn btn--primary btn--lg mt-3" onClick={payNow}>Complete payment</button>
      )}
    </>
  );
}
