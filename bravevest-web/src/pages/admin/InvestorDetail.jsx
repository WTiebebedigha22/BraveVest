import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Mail, Phone, ShieldCheck, ShieldX, Clock,
  AlertCircle, Loader2, ArrowLeft, Calendar, Wallet, TrendingUp,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
import AdminShell from '@/components/admin/AdminShell';

const cardStyle = {
  padding: 20,
  background: 'var(--bv-bg-elevated)',
  border: '1px solid var(--bv-border)',
  borderRadius: 12,
};

export default function InvestorDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/admin/investors/${id}`);
        if (!cancelled) setData(result?.data ?? result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investor.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const investor = data?.investor ?? data;
  const investments = Array.isArray(data?.investments)
    ? data.investments
    : Array.isArray(investor?.investments)
    ? investor.investments
    : [];

  const fullName =
    [investor?.firstName, investor?.lastName].filter(Boolean).join(' ') ||
    investor?.name ||
    'Investor';

  const initials =
    ((investor?.firstName?.[0] || '') + (investor?.lastName?.[0] || '')).toUpperCase() ||
    fullName[0]?.toUpperCase() ||
    'U';

  // Normalize KYC status across both nested `kyc.status` and flat `kycStatus`
  const rawKyc = (investor?.kyc?.status || investor?.kycStatus || 'PENDING').toUpperCase();
  const isApproved = rawKyc === 'APPROVED' || rawKyc === 'VERIFIED';
  const isRejected = rawKyc === 'REJECTED';

  // Compute total invested dynamically if backend doesn't return an aggregate
  const totalInvested =
    data?.totalInvested ??
    investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const walletBalance =
    investor?.wallet?.balance ?? investor?.walletBalance ?? 0;

  return (
    <PortalLayout>
      <AdminShell
        title={loading ? 'Investor Profile' : fullName}
        description={investor?.email || 'Investor account overview and portfolio history'}
        actions={
          <Link
            to="/admin/investors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--bv-surface)',
              border: '1px solid var(--bv-border)',
              color: 'var(--bv-text)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back to investors
          </Link>
        }
      >
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading investor…
          </div>
        ) : error ? (
          <div
            role="alert"
            style={{
              padding: 16,
              background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)',
              borderRadius: 12,
              color: 'var(--bv-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <AlertCircle size={18} /> {error}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Header Card */}
            <section aria-label="Investor details" style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: 'var(--bv-accent)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bv-text)' }}>
                    {fullName}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--bv-text-muted)',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Mail size={13} /> {investor?.email || '—'}
                    </span>
                    {investor?.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Phone size={13} /> {investor.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {/* KYC Badge */}
                  {isApproved ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))',
                        color: 'var(--bv-success)',
                      }}
                    >
                      <ShieldCheck size={14} /> KYC Verified
                    </span>
                  ) : isRejected ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))',
                        color: 'var(--bv-danger)',
                      }}
                    >
                      <ShieldX size={14} /> KYC Rejected
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))',
                        color: 'var(--bv-warning)',
                      }}
                    >
                      <Clock size={14} /> KYC Pending
                    </span>
                  )}

                  {/* Account Status Badge */}
                  {investor?.status && (
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'var(--bv-surface)',
                        color:
                          investor.status === 'ACTIVE'
                            ? 'var(--bv-success)'
                            : investor.status === 'SUSPENDED'
                            ? 'var(--bv-danger)'
                            : 'var(--bv-text-muted)',
                      }}
                    >
                      {investor.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* KPI Summary Cards */}
            <section
              aria-label="Stats"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
              }}
            >
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 6 }}>
                  <TrendingUp size={14} /> Total Invested
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--bv-success)' }}>
                  {format(totalInvested)}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 6 }}>
                  <Wallet size={14} /> Wallet Balance
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--bv-text)' }}>
                  {format(walletBalance)}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 6 }}>
                  <Calendar size={14} /> Member Since
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bv-text)' }}>
                  {investor?.createdAt
                    ? new Date(investor.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </div>
              </div>
            </section>

            {/* Investments Table */}
            <section aria-label="Investments">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--bv-text)', margin: '0 0 12px' }}>
                Investments ({investments.length})
              </h2>

              {investments.length === 0 ? (
                <div
                  style={{
                    ...cardStyle,
                    padding: 40,
                    textAlign: 'center',
                    color: 'var(--bv-text-muted)',
                    fontSize: 14,
                  }}
                >
                  This investor hasn't made any investments yet.
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--bv-bg-elevated)',
                    border: '1px solid var(--bv-border)',
                    borderRadius: 12,
                    overflowX: 'auto',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--bv-border)' }}>
                        {['Project', 'Amount', 'Expected Return', 'Date', 'Status'].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: h === 'Amount' || h === 'Expected Return' ? 'right' : 'left',
                              padding: '12px 16px',
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--bv-text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: 0.4,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv) => (
                        <tr key={inv.id} style={{ borderTop: '1px solid var(--bv-border-soft)' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--bv-text)' }}>
                            {inv.project?.title || inv.projectName || inv.name || '—'}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--bv-text)', whiteSpace: 'nowrap' }}>
                            {format(inv.amount || 0)}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--bv-success)', whiteSpace: 'nowrap' }}>
                            {inv.expectedReturn != null ? format(inv.expectedReturn) : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--bv-text-muted)', whiteSpace: 'nowrap' }}>
                            {inv.createdAt
                              ? new Date(inv.createdAt).toLocaleDateString()
                              : inv.date || '—'}
                          </td>
                          <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                background: 'var(--bv-surface)',
                                color:
                                  inv.status === 'ACTIVE' || inv.status === 'CONFIRMED'
                                    ? 'var(--bv-success)'
                                    : inv.status === 'MATURED'
                                    ? 'var(--bv-info)'
                                    : 'var(--bv-text-muted)',
                              }}
                            >
                              {inv.status || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}