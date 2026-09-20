import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/investor/StatCard';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import PortfolioChart from '@/components/investor/PortfolioChart';
import { useAuth } from '@/hooks/useAuth';
import { investmentsApi } from '@/api/investments';
import { paymentsApi } from '@/api/payments';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      investmentsApi.portfolio().catch(() => null),
      paymentsApi.wallet().catch(() => null),
      investmentsApi.list({ limit: 5 }).catch(() => ({ data: [] })),
    ])
      .then(([s, w, i]) => {
        setSummary(s?.data || null);
        setWallet(w?.data || null);
        setInvestments(i?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const kycStatus = user?.kycStatus || 'NOT_STARTED';
  const needsKyc = kycStatus !== 'APPROVED';

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'Investor'}`}
        subtitle="Here's what's happening with your portfolio today."
      />

      {needsKyc && (
        <div className="dash-banner">
          <div>
            <strong>Complete your KYC to start investing.</strong>
            <div className="dash-banner__sub">Current status: {kycStatus.replace('_', ' ')}</div>
          </div>
          <Button as={Link} to="/kyc" variant="primary" size="sm">Continue KYC</Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : (
        <>
          <div className="grid grid-3 mb-4">
            <StatCard label="Total Invested" value={summary?.totalInvested || 0} currency />
            <StatCard label="Expected Returns" value={summary?.totalExpected || 0} currency accent="green" />
            <StatCard label="Active Investments" value={summary?.activeCount || 0} hint={`${summary?.pendingCount || 0} pending`} />
          </div>

          <div className="mb-4"><PortfolioChart /></div>

          <div className="grid grid-2">
            <div className="dash-card">
              <div className="dash-card__head">
                <h3>Wallet balance</h3>
                <Link to="/wallet" className="dash-card__link">Details →</Link>
              </div>
              <div className="dash-card__value"><Currency value={wallet?.balance || 0} /></div>
              <div className="dash-card__sub">Deposited <Currency value={wallet?.totalDeposited || 0} /></div>
            </div>

            <div className="dash-card">
              <div className="dash-card__head">
                <h3>Recent activity</h3>
                <Link to="/investments" className="dash-card__link">See all →</Link>
              </div>
              {investments.length === 0 ? (
                <div className="text-muted">No investments yet. <Link to="/marketplace">Browse marketplace</Link></div>
              ) : (
                <ul className="dash-list">
                  {investments.slice(0, 3).map((inv) => (
                    <li key={inv.id} className="dash-list__item">
                      <div>
                        <div className="dash-list__title">{inv.project?.title}</div>
                        <div className="dash-list__sub">{inv.status}</div>
                      </div>
                      <strong><Currency value={inv.amount} /></strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
