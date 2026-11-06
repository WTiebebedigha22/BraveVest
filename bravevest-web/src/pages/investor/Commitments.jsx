import { useEffect, useMemo, useState } from 'react';
import { Search, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};
const PAGE_SIZE = 10;

export default function Commitments() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/funding/commitments/mine');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.commitments ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load commitments.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((c) => (c.projectName || c.name || '').toLowerCase().includes(q) || (c.status || '').toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading commitments…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Commitments</h1>

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search commitments" aria-label="Search commitments"
          style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }} />
      </div>

      {pageItems.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          {search ? 'No commitments match your search.' : 'No commitments yet.'}
        </div>
      ) : (
        <>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Project', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{c.projectName || c.name}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>{format(c.amount)}</td>
                    <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: COLORS.muted }}>{c.status || '—'}</td>
                    <td style={{ padding: '14px 16px', color: COLORS.muted, fontSize: 13 }}>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} aria-label="Previous page"
                style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage <= 1 ? 'not-allowed' : 'pointer', opacity: safePage <= 1 ? 0.4 : 1 }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Page {safePage} of {totalPages}</span>
              <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} aria-label="Next page"
                style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage >= totalPages ? 'not-allowed' : 'pointer', opacity: safePage >= totalPages ? 0.4 : 1 }}>
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
