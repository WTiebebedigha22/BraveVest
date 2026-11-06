import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500',
  positive: '#0ECB81', warning: '#F59E0B', negative: '#F6465D',
};
const PAGE_SIZE = 20;

export default function AdminInvestors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/investors');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.investors ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investors.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== 'all') list = list.filter((i) => (i.kycStatus || '').toLowerCase() === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q));
    }
    return list;
  }, [items, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading investors…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>;
  }
  if (error) {
    return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;
  }

  return (
    <PortalLayout theme="dark">
      <div style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Investors</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email" aria-label="Search investors"
            style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }} />
        </div>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} aria-label="Filter by KYC status"
          style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, background: COLORS.surface, cursor: 'pointer' }}>
          <option value="all">All statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {pageItems.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          {search || filter !== 'all' ? 'No investors match your filters.' : 'No investors yet.'}
        </div>
      ) : (
        <>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Name', 'Email', 'KYC', ''].map((h) => (
                    <th key={h} style={{ textAlign: h === '' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((inv) => {
                  const status = (inv.kycStatus || 'pending').toLowerCase();
                  const statusColor = status === 'verified' ? COLORS.positive : status === 'rejected' ? COLORS.negative : COLORS.warning;
                  return (
                    <tr key={inv.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{inv.name}</td>
                      <td style={{ padding: '14px 16px', color: COLORS.muted }}>{inv.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 8px', background: `${statusColor}22`, color: statusColor, borderRadius: 4, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link to={`/admin/investors/${inv.id}`} style={{ color: COLORS.accent, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>View →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} aria-label="Previous page"
                style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage <= 1 ? 'not-allowed' : 'pointer', opacity: safePage <= 1 ? 0.4 : 1 }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Page {safePage} of {totalPages} · {filtered.length} total</span>
              <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} aria-label="Next page"
                style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage >= totalPages ? 'not-allowed' : 'pointer', opacity: safePage >= totalPages ? 0.4 : 1 }}>
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
    </PortalLayout>
  );
}
