import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Download, TrendingUp, Award, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function YearInReview() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const year = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/investor/year-in-review?year=${year}`);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load year in review.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [year]);

  async function exportCard() {
    setExporting(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const node = document.getElementById('yir-card');
      const canvas = await html2canvas(node, { backgroundColor: '#0d6e4f', scale: 2 });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bravevest-${year}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      setError(e?.message || 'Could not export. Install html2canvas first.');
    } finally {
      setExporting(false);
    }
  }

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading your year in review…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto', color: COLORS.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Year in Review {year}</h1>
        <button type="button" onClick={exportCard} disabled={exporting}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? 0.7 : 1 }}>
          <Download size={16} /> {exporting ? 'Exporting…' : 'Share card'}
        </button>
      </div>

      <div id="yir-card" style={{ padding: 40, background: '#0d6e4f', color: '#FFF', borderRadius: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 12 }}>BraveVest {year}</div>
        <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>{user?.firstName || 'Investor'}</h2>
        <p style={{ fontSize: 15, opacity: 0.9, margin: '0 0 32px' }}>Your year in numbers.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{format(data?.totalInvested || 0)}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Total invested</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{format(data?.totalReturns || 0)}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Returns earned</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{data?.investmentsCount || 0}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Investments</div>
          </div>
        </div>
      </div>

      <section aria-label="Highlights">
        {[
          { icon: TrendingUp, label: 'Best performing deal', value: data?.bestDeal || '—' },
          { icon: Award, label: 'Total returns', value: format(data?.totalReturns || 0) },
          { icon: Wallet, label: 'Wallet activity', value: format(data?.walletVolume || 0) },
        ].map((h) => (
          <div key={h.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h.icon size={18} color={COLORS.accent} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{h.label}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{h.value}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
