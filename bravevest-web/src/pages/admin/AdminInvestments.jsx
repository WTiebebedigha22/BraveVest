import { useEffect, useMemo, useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function AdminInvestments() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/investments', { );
        if (!cancelled) setItems(Array.isArray(data) ? data : data.investments ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investments.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => (i.investorName || '').toLowerCase().includes(q) || (i.projectName || i.name || '').toLowerCase().includes(q));
  }, [items, search]);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading investments…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Investments</h1>

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by investor or project" aria-label="Search investments"
          style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          {search ? 'No investments match your search.' : 'No investments yet.'}
        </div>
      ) : (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Investor', 'Project', 'Amount', 'Date', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{inv.investorName}</td>
                  <td style={{ padding: '14px 16px', color: COLORS.muted }}>{inv.projectName || inv.name}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>{format(inv.amount)}</td>
                  <td style={{ padding: '14px 16px', color: COLORS.muted, fontSize: 13 }}>{inv.date}</td>
                  <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: COLORS.muted }}>{inv.status || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
