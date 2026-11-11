import { useEffect, useMemo, useState } from 'react';
import { Search, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: 'var(--bv-text)', muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)', accent: 'var(--bv-accent)',
  positive: '#0ECB81', negative: '#F6465D',
};
const PAGE_SIZE = 25;

export default function Transactions() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/transactions');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.transactions ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load transactions.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (type !== 'all') list = list.filter((t) => (t.type || '').toLowerCase() === type);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        (t.reference || '').toLowerCase().includes(q) ||
        (t.investorName || t.userName || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, type, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading transactions…
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </PortalLayout>
  );
  }
  if (error) {
    return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Transactions</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="search" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by reference, investor, or description"
            aria-label="Search transactions"
            style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }}
          />
        </div>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} aria-label="Filter by type"
          style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, background: COLORS.surface, cursor: 'pointer' }}>
          <option value="all">All types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="investment">Investments</option>
          <option value="payout">Payouts</option>
        </select>
      </div>

      {pageItems.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          {search || type !== 'all' ? 'No transactions match your filters.' : 'No transactions yet.'}
        </div>
      ) : (
        <>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bv-bg)' }}>
                  {['Date', 'Reference', 'Investor', 'Type', 'Amount'].map((h) => (
                    <th key={h} style={{
                      textAlign: h === 'Amount' ? 'right' : 'left',
                      padding: '12px 16px', fontSize: 12, fontWeight: 600,
                      color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t) => {
                  const isCredit = t.direction === 'credit' || (t.type || '').toLowerCase() === 'deposit' || (t.type || '').toLowerCase() === 'payout';
                  return (
                    <tr key={t.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '14px 16px', color: COLORS.muted, fontSize: 13 }}>{t.date}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: COLORS.muted }}>{t.reference || '—'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{t.investorName || t.userName || '—'}</td>
                      <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: COLORS.muted }}>{t.type || '—'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: isCredit ? COLORS.positive : COLORS.text }}>
                        {isCredit ? '+' : ''}{format(t.amount)}
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
  );
}
