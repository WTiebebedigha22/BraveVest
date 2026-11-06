import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle, Loader2, TrendingUp, Plus } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const PAGE_SIZE = 10;

export default function Investments() {
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
        const data = await apiFetch('/investments');
        if (!cancelled) setItems(Array.isArray(data) ? data : data?.investments ?? []);
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
    return items.filter((i) => (i.projectName || i.name || '').toLowerCase().includes(q) || (i.status || '').toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
      <PortalLayout theme="dark">
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading investments…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout theme="dark">
        <div style={{ padding: 48 }}>
          <div role="alert" style={{ padding: 16, maxWidth: 480, margin: '0 auto', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} /> {error}
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="bv-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Investments</h1>
            <Link to="/marketplace" className="bv-pill bv-pill--primary">
              <Plus size={16} /> New investment
            </Link>
          </div>

          <div className="bv-fade-up" style={{ position: 'relative', marginBottom: 24, maxWidth: 360 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search investments"
              aria-label="Search investments"
              style={{
                width: '100%', padding: '11px 14px 11px 38px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none',
              }}
            />
          </div>

          {pageItems.length === 0 ? (
            <div className="bv-fade-up" style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <TrendingUp size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                {search ? 'No matches' : 'No investments yet'}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
                {search ? 'Try a different search term.' : 'Browse the marketplace to place your first investment.'}
              </p>
              {!search && (
                <Link to="/marketplace" className="bv-pill bv-pill--primary">
                  Browse opportunities
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="bv-fade-up" style={{ display: 'grid', gap: 12 }}>
                {pageItems.map((inv) => (
                  <Link
                    key={inv.id}
                    to={`/investments/${inv.id}`}
                    className="bv-card-lift"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 24,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      textDecoration: 'none',
                      color: 'var(--text)',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{inv.projectName || inv.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {inv.tenorMonths || inv.tenor} month tenor · Invested {inv.date || inv.createdAt}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{format(inv.amount)}</div>
                      <div style={{ fontSize: 12, color: 'var(--positive)', fontWeight: 700, marginTop: 2 }}>
                        {inv.expectedReturnPct || inv.returnRate || inv.annualRate || 0}% p.a.
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      aria-label={`Page ${n}`}
                      aria-current={n === page ? 'page' : undefined}
                      style={{
                        minWidth: 36,
                        padding: '8px 12px',
                        background: n === page ? 'var(--accent)' : 'var(--surface)',
                        color: n === page ? '#0A0A0A' : 'var(--text)',
                        border: `1px solid ${n === page ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
