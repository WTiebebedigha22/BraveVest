import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import AdminStat from '@/components/admin/AdminStat';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import { adminApi } from '@/api/admin';
import './InvestorDetail.css';

export default function AdminInvestorDetail() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.investor(id).then(setU).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><Loader /></div>;
  if (!u) return <AdminEmpty title="Investor not found" body="The account may have been deleted." />;

  const kyc = u.kyc;

  const invCols = [
    { key: 'project', label: 'Project', render: (i) => i.project?.title || '—' },
    { key: 'amount', label: 'Amount', align: 'right', render: (i) => <Currency value={i.amount} /> },
    { key: 'status', label: 'Status', render: (i) => <AdminTable.Status status={i.status} /> },
    { key: 'date', label: 'Date', align: 'right', render: (i) => new Date(i.createdAt).toLocaleDateString() },
  ];

  const txCols = [
    { key: 'reference', label: 'Reference', render: (t) => <span className="admin-mono">{t.reference}</span> },
    { key: 'type', label: 'Type', render: (t) => <span className="text-muted">{t.type}</span> },
    { key: 'amount', label: 'Amount', align: 'right', render: (t) => <Currency value={t.amount} /> },
    { key: 'status', label: 'Status', render: (t) => <AdminTable.Status status={t.status} /> },
  ];

  return (
    <>
      <Link to="/admin/investors" className="admin-back">← All investors</Link>

      <AdminPageHeader
        eyebrow="Investor"
        title={`${u.firstName} ${u.lastName}`}
        subtitle={u.email}
        right={<AdminTable.Status status={kyc?.status || 'NOT_STARTED'} />}
      />

      <div className="admin-grid-3 mb-4">
        <AdminStat
          label="Total invested"
          value={<Currency value={u.totalInvested || 0} compact />}
          hint={`${u.investments.length} investments`}
        />
        <AdminStat
          label="Transactions"
          value={u.transactions.length}
          hint="All-time"
        />
        <AdminStat
          label="Account age"
          value={Math.max(1, Math.round((Date.now() - new Date(u.createdAt)) / 86400000)) + 'd'}
          hint={`Joined ${new Date(u.createdAt).toLocaleDateString()}`}
        />
      </div>

      <div className="admin-grid-2 mb-4">
        <AdminCard padded={false}>
          <AdminCard.Header title="KYC details" subtitle="Identity verification" />
          <AdminCard.Body>
            <div className="admin-kv">
              <Row k="Status" v={<AdminTable.Status status={kyc?.status || 'NOT_STARTED'} />} />
              <Row k="Date of birth" v={kyc?.dateOfBirth ? new Date(kyc.dateOfBirth).toLocaleDateString() : '—'} />
              <Row k="ID type" v={kyc?.idType || '—'} />
              <Row k="ID number" v={kyc?.idNumber || '—'} />
              <Row k="Address" v={kyc?.addressLine1 ? `${kyc.addressLine1}, ${kyc.city}` : '—'} />
              <Row k="Bank" v={kyc?.bankName ? `${kyc.bankName} · ${kyc.accountNumber}` : '—'} />
              <Row k="Account name" v={kyc?.accountName || '—'} />
            </div>
          </AdminCard.Body>
        </AdminCard>

        <AdminCard padded={false}>
          <AdminCard.Header title="Contact" subtitle="Profile information" />
          <AdminCard.Body>
            <div className="admin-kv">
              <Row k="Email" v={u.email} />
              <Row k="Phone" v={u.phone || '—'} />
              <Row k="Role" v={<AdminTable.Status status={u.role} />} />
              <Row k="Account" v={<AdminTable.Status status={u.status} />} />
              <Row k="Email verified" v={u.emailVerified ? new Date(u.emailVerified).toLocaleDateString() : 'Not verified'} />
              <Row k="Joined" v={new Date(u.createdAt).toLocaleDateString()} />
            </div>
          </AdminCard.Body>
        </AdminCard>
      </div>

      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header title="Investments" subtitle={`${u.investments.length} total`} />
        <AdminCard.Body>
          <AdminTable
            columns={invCols}
            rows={u.investments}
            empty="This investor hasn't made any investments yet."
          />
        </AdminCard.Body>
      </AdminCard>

      <AdminCard padded={false}>
        <AdminCard.Header title="Transactions" subtitle={`${u.transactions.length} total`} />
        <AdminCard.Body>
          <AdminTable
            columns={txCols}
            rows={u.transactions}
            empty="No transactions recorded."
          />
        </AdminCard.Body>
      </AdminCard>
    </>
  );
}

function Row({ k, v }) {
  return (
    <div className="admin-kv__row">
      <span className="admin-kv__k">{k}</span>
      <span className="admin-kv__v">{v}</span>
    </div>
  );
}
