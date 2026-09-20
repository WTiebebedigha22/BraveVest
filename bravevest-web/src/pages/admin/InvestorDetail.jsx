import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import './InvestorDetail.css';

export default function InvestorDetail() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.investor(id).then(setU).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!u) return <div>Investor not found. <Link to="/admin/investors">← Back</Link></div>;

  const kyc = u.kyc;

  return (
    <>
      <Link to="/admin/investors" className="id-back">← All investors</Link>
      <PageHeader
        title={`${u.firstName} ${u.lastName}`}
        subtitle={u.email}
        right={<span className={`inv-table__status ${kyc?.status === 'APPROVED' ? 'is-confirmed' : ''}`}>{kyc?.status || 'NO KYC'}</span>}
      />

      <div className="grid grid-3 mb-4">
        <div className="id-stat"><div className="id-stat__label">Total invested</div><div className="id-stat__value"><Currency value={u.totalInvested} /></div></div>
        <div className="id-stat"><div className="id-stat__label">Investments</div><div className="id-stat__value">{u.investments.length}</div></div>
        <div className="id-stat"><div className="id-stat__label">Transactions</div><div className="id-stat__value">{u.transactions.length}</div></div>
      </div>

      <div className="grid grid-2">
        <div className="id-panel">
          <div className="id-panel__head">KYC</div>
          <div className="id-panel__body">
            <Row label="Status" value={kyc?.status || '—'} />
            <Row label="Date of birth" value={kyc?.dateOfBirth ? new Date(kyc.dateOfBirth).toLocaleDateString() : '—'} />
            <Row label="ID" value={kyc?.idType ? `${kyc.idType} · ${kyc.idNumber}` : '—'} />
            <Row label="Address" value={kyc?.addressLine1 ? `${kyc.addressLine1}, ${kyc.city}` : '—'} />
            <Row label="Bank" value={kyc?.bankName ? `${kyc.bankName} · ${kyc.accountNumber}` : '—'} />
          </div>
        </div>

        <div className="id-panel">
          <div className="id-panel__head">Recent investments</div>
          <div className="id-panel__body">
            {u.investments.length === 0 ? <div className="text-muted">No investments.</div> :
              u.investments.slice(0, 5).map((i) => (
                <Row key={i.id} label={i.project?.title} value={<><Currency value={i.amount} /> · {i.status}</>} />
              ))}
          </div>
        </div>
      </div>

      <div className="id-panel mt-3">
        <div className="id-panel__head">Recent transactions</div>
        <div className="id-panel__body">
          {u.transactions.length === 0 ? <div className="text-muted">No transactions.</div> :
            u.transactions.slice(0, 8).map((t) => (
              <Row key={t.id} label={t.reference} value={<><Currency value={t.amount} /> · {t.status}</>} />
            ))}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="id-row">
      <span className="id-row__label">{label}</span>
      <span className="id-row__value">{value}</span>
    </div>
  );
}
