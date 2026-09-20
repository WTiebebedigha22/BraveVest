import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/investor/StatCard';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { paymentsApi } from '@/api/payments';
import './Wallet.css';

const statusLabel = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  REVERSED: 'Reversed',
};

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      paymentsApi.wallet().catch(() => null),
      paymentsApi.transactions({ limit: 50 }).catch(() => ({ data: [] })),
    ])
      .then(([w, t]) => {
        setWallet(w?.data || null);
        setTransactions(t?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Wallet" subtitle="Every deposit and investment in one place." />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : (
        <>
          <div className="grid grid-3 mb-4">
            <StatCard label="Balance" value={wallet?.balance || 0} currency accent="green" />
            <StatCard label="Total Deposited" value={wallet?.totalDeposited || 0} currency />
            <StatCard label="Total Invested" value={wallet?.totalInvested || 0} currency />
          </div>

          <div className="wallet-table">
            <div className="wallet-table__head">
              <span>Reference</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {transactions.length === 0 ? (
              <div className="wallet-table__empty">No transactions yet.</div>
            ) : transactions.map((t) => (
              <div key={t.id} className="wallet-table__row">
                <span className="wallet-table__ref">{t.reference}</span>
                <span>{t.type}</span>
                <span><Currency value={t.amount} /></span>
                <span className={`wallet-table__status is-${t.status.toLowerCase()}`}>{statusLabel[t.status] || t.status}</span>
                <span className="wallet-table__date">{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
