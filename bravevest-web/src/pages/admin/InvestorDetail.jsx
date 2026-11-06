import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Mail, Phone, Shield, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500',
  positive: '#0ECB81', negative: '#F6465D', warning: '#F59E0B',
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
        const result = await apiFetch(`/admin/investors/${id}`, { );
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investor.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading investor…
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </PortalLayout>
  );
  }
  if (error) {
    return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;
  }

  const investor = data?.investor ?? data;
  const investments = data?.investments ?? [];
  const kyc = (investor?.kycStatus || 'pending').toLowerCase();
  const kycColor = kyc === 'verified' ? COLORS.positive : kyc === 'rejected' ? COLORS.negative : COLORS.warning;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto', color: COLORS.text }}>
      <Link to="/admin/investors" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to investors
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>{investor?.name || 'Investor'}</h1>

      <section aria-label="Investor details" style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(246,165,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.accent, flexShrink: 0 }}>
            <User size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{investor?.name}</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Mail size={12} /> {investor?.email}
              {investor?.phone && <><span style={{ margin: '0 4px' }}>·</span><Phone size={12} /> {investor.phone}</>}
            </div>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${kycColor}22`, color: kycColor, textTransform: 'capitalize' }}>
            KYC {kyc}
          </span>
        </div>
      </section>

      <section aria-label="Stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4 }}>Total invested</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{format(data?.totalInvested || 0)}</div>
        </div>
        <div style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4 }}>Wallet balance</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{format(investor?.walletBalance || 0)}</div>
        </div>
        <div style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4 }}>Joined</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{investor?.createdAt || '—'}</div>
        </div>
      </section>

      <section aria-label="Investments">
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Investments</h2>
        {investments.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
            No investments yet.
          </div>
        ) : (
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Project', 'Amount', 'Invested', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{inv.projectName || inv.name}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>{format(inv.amount)}</td>
                    <td style={{ padding: '14px 16px', color: COLORS.muted, fontSize: 13 }}>{inv.date}</td>
                    <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: COLORS.muted }}>{inv.status || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
