import { useEffect, useState } from 'react';
import { Download, AlertCircle, Loader2, FileText } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

const REPORTS = [
  { id: 'investments', label: 'Investments report', desc: 'All investments with investor, project, amount, status.' },
  { id: 'transactions', label: 'Transactions report', desc: 'Full transaction ledger with reference numbers.' },
  { id: 'kyc', label: 'KYC report', desc: 'All KYC submissions and their status.' },
  { id: 'payouts', label: 'Payouts report', desc: 'All scheduled and completed payouts.' },
];

export default function Reports() {
  const { format } = useCurrency();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/reports/summary');
        if (!cancelled) setStats(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load report summary.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function downloadReport(id) {
    setDownloading(id);
    try {
      const data = await apiFetch(`/admin/reports/${id}.csv`);      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || 'Download failed.');
    } finally {
      setDownloading('');
    }
  }

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading reports…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Reports</h1>

      {error && (
        <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {stats && (
        <section aria-label="Summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total invested', value: format(stats.totalInvested || 0) },
            { label: 'Active investors', value: stats.activeInvestors || 0 },
            { label: 'Open projects', value: stats.openProjects || 0 },
            { label: 'Pending KYC', value: stats.pendingKyc || 0 },
          ].map((s) => (
            <div key={s.label} style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Download reports">
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Download CSV</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REPORTS.map((r) => (
            <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(246,165,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.accent, flexShrink: 0 }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{r.desc}</div>
              </div>
              <button type="button" onClick={() => downloadReport(r.id)} disabled={downloading === r.id}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, cursor: downloading === r.id ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: COLORS.text }}>
                {downloading === r.id ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Downloading…</> : <><Download size={14} /> CSV</>}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
