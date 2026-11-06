import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function InvestmentDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/investments/${id}`, { );
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investment.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading investment…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  const inv = data?.investment ?? data;
  const schedule = data?.schedule ?? [];

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <Link to="/investments" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to investments
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>{inv?.projectName || inv?.name || 'Investment'}</h1>

      <section aria-label="Investment summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Amount invested', value: format(inv?.amount || 0) },
          { label: 'Annual yield', value: inv?.returnRate ? `${inv.returnRate}%` : '—', positive: true },
          { label: 'Tenor', value: inv?.tenor ? `${inv.tenor} months` : '—' },
          { label: 'Status', value: inv?.status || '—', capitalize: true },
        ].map((s) => (
          <div key={s.label} style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.positive ? COLORS.positive : COLORS.text, textTransform: s.capitalize ? 'capitalize' : 'none' }}>{s.value}</div>
          </div>
        ))}
      </section>

      <section aria-label="Payout schedule">
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Payout schedule</h2>
        {schedule.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
            No schedule available.
          </div>
        ) : (
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Due date', 'Amount', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '14px 16px' }}>{row.date}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>{format(row.amount)}</td>
                    <td style={{ padding: '14px 16px', color: row.paid ? COLORS.positive : COLORS.muted, textTransform: 'capitalize' }}>{row.paid ? 'paid' : 'pending'}</td>
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
