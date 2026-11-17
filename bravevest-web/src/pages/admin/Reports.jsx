import { useEffect, useState } from 'react';
import { Download, AlertCircle, Loader2, FileText, RotateCcw } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
import AdminShell from '@/components/admin/AdminShell';

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

  async function loadSummary() {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/reports/summary');
      setStats(res?.data ?? res);
    } catch (e) {
      setError(e?.message || 'Could not load report summary.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function downloadReport(id) {
    setDownloading(id);
    setError('');
    try {
      // Use standard fetch to stream/download CSV blobs correctly with auth
      const token = localStorage.getItem('bv_token') || sessionStorage.getItem('bv_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/admin/reports/${id}.csv`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Failed to generate CSV export.');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || 'Download failed.');
    } finally {
      setDownloading('');
    }
  }

  return (
    <PortalLayout>
      <AdminShell
        title="Reports & Analytics"
        description="View platform metrics and download financial or user data as CSV"
        actions={
          <button
            onClick={loadSummary}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bv-surface)', color: 'var(--bv-text)',
              border: '1px solid var(--bv-border)', fontWeight: 600, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RotateCcw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      >
        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', fontSize: 13, marginBottom: 20 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{error}</span>
          </div>
        )}

        {loading && !stats ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading reports summary…
          </div>
        ) : (
          <>
            {stats && (
              <section aria-label="Summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Total Invested', value: format(stats.totalInvested || 0) },
                  { label: 'Active Investors', value: Number(stats.activeInvestors || 0).toLocaleString() },
                  { label: 'Open Projects', value: Number(stats.openProjects || 0).toLocaleString() },
                  { label: 'Pending KYC', value: Number(stats.pendingKyc || 0).toLocaleString() },
                ].map((s) => (
                  <div key={s.label} style={{ padding: 18, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--bv-text)' }}>{s.value}</div>
                  </div>
                ))}
              </section>
            )}

            <section aria-label="Download reports">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--bv-text)', margin: '0 0 14px' }}>Download CSV Reports</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REPORTS.map((r) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'color-mix(in srgb, var(--bv-accent) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bv-accent)', flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--bv-text)' }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => downloadReport(r.id)} 
                      disabled={downloading === r.id}
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 6, 
                        padding: '10px 16px', background: 'var(--bv-surface)', 
                        border: '1px solid var(--bv-border)', borderRadius: 8, 
                        cursor: downloading === r.id ? 'not-allowed' : 'pointer', 
                        fontSize: 13, fontWeight: 600, color: 'var(--bv-text)',
                        flexShrink: 0,
                      }}
                    >
                      {downloading === r.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Exporting…
                        </>
                      ) : (
                        <>
                          <Download size={14} /> Export CSV
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </AdminShell>
    </PortalLayout>
  );
}