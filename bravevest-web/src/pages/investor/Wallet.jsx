import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/investor/StatCard';
import Loader from '@/components/shared/Loader';
import AdminEmpty from '@/components/admin/AdminEmpty';
import { walletApi } from '@/api/wallet';
import { useCurrency } from '@/context/CurrencyContext';
import KycBanner from '@/components/kyc/KycBanner';
import './Wallet.css';

const TYPE_LABEL = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  commitment: 'Investment',
  repayment: 'Repayment',
  payout: 'Payout',
  fee: 'Fee',
  refund: 'Refund',
  manual: 'Manual credit',
};

export default function Wallet() {
  const { format } = useCurrency();
  const [wallet, setWallet] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      walletApi.get().catch(() => null),
      walletApi.ledger(50).catch(() => []),
    ])
      .then(([w, l]) => {
        setWallet(w);
        setLedger(l);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Derive totals from the ledger
  const totalDeposited = ledger
    .filter((e) => e.type === 'deposit' && e.direction === 'credit')
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalInvested = ledger
    .filter((e) => e.type === 'commitment' && e.direction === 'debit')
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <>
      <KycBanner />
      <AdminPageHeader
        eyebrow="Investor"
        title="Wallet"
        subtitle="Every deposit, withdrawal, and investment in one place."
      />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : error ? (
        <AdminEmpty title="Couldn't load wallet" body={error.message} />
      ) : (
        <>
          <div className="grid grid-3 mb-4">
            <StatCard
              label="Available balance"
              value={wallet?.balance ?? 0}
              currency
              accent="green"
            />
            <StatCard label="Total deposited" value={totalDeposited} currency />
            <StatCard label="Total invested" value={totalInvested} currency />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <Link to="/deposit" className="btn btn--primary">Deposit</Link>
            <Link to="/withdraw" className="btn btn--ghost">Withdraw</Link>
          </div>

          {wallet?.held ? (
            <p style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 16 }}>
              {format(wallet.held)} currently on hold (committed to pending transfers).
            </p>
          ) : null}

          {ledger.length === 0 ? (
            <AdminEmpty
              title="No transactions yet"
              body="Your deposits and investments will appear here."
            />
          ) : (
            <div className="wallet-table-wrap">
              <div className="wallet-table">
                <div className="wallet-table__head">
                  <span>Reference</span>
                  <span>Type</span>
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Balance</span>
                  <span>Date</span>
                </div>
                {ledger.map((e) => (
                  <div key={e.id} className="wallet-table__row">
                    <span className="wallet-table__ref">{e.reference}</span>
                    <span>{TYPE_LABEL[e.type] || e.type}</span>
                    <span style={{ color: '#666', fontSize: 13 }}>{e.description || '—'}</span>
                    <span
                      style={{
                        color: e.direction === 'credit' ? '#1b5e20' : '#b71c1c',
                        fontWeight: 600,
                      }}
                    >
                      {e.direction === 'credit' ? '+' : '−'}
                      {format(e.amount)}
                    </span>
                    <span style={{ color: '#666', fontSize: 13 }}>
                      {e.balanceAfter != null ? format(e.balanceAfter) : '—'}
                    </span>
                    <span className="wallet-table__date">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
