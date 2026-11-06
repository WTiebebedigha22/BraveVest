import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart as RePieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Search, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CHART_COLORS = ['#F6A500', '#0ECB81', '#3B82F6', '#8B5CF6', '#F6465D', '#14B8A6'];
const PAGE_SIZE = 8;

export default function Portfolio() {
  const { format } = useCurrency();
  const [investments, setInvestments] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/investments/portfolio');
        if (!cancelled) {
          setInvestments(Array.isArray(data?.investments) ? data.investments : []);
          setAllocation(Array.isArray(data?.allocation) ? data.allocation : []);
          setPerformance(Array.isArray(data?.performance) ? data.performance : []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load portfolio.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return investments;
    const q = search.toLowerCase();
    return investments.filter(
      (i) => (i.projectName || i.name || '').toLowerCase().includes(q) || (i.sector || '').toLowerCase().includes(q)
    );
  }, [investments, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
      <PortalLayout theme="dark">
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading portfolio…
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

  const tooltipStyle = {
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: 13,
  };

  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 className="bv-fade-up" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            Portfolio
          </h1>

          {/* Charts */}
          <div className="bv-grid-2 bv-fade-up" style={{ marginBottom: 32 }}>
            <div className="bv-card-lift" style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Allocation</h2>
              {allocation.length === 0 ? (
                <EmptyBox text="No allocation data yet." />
              ) : (
                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <RePieChart>
                      <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                        {allocation.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => format(v)} contentStyle={tooltipStyle} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bv-card-lift" style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Performance</h2>
              {performance.length === 0 ? (
                <EmptyBox text="No performance data yet." />
              ) : (
                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <BarChart data={performance}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Tooltip formatter={(v) => format(v)} contentStyle={tooltipStyle} />
                      <Bar dataKey="value" fill="#F6A500" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Holdings */}
          <div className="bv-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Holdings</h2>
              <div style={{ position: 'relative', minWidth: 260 }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search holdings"
                  aria-label="Search holdings"
                  style={{
                    width: '100%', padding: '11px 14px 11px 38px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none',
                  }}
                />
              </div>
            </div>

            {pageItems.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text-muted)', fontSize: 14 }}>
                {search ? 'No holdings match your search.' : 'No holdings yet.'}
              </div>
            ) : (
              <>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr>
                        {['Project', 'Sector', 'Amount', 'Yield', 'Actions'].map((h) => (
                          <th key={h} style={{
                            textAlign: h === 'Amount' || h === 'Yield' ? 'right' : 'left',
                            padding: '14px 20px',
                            fontWeight: 600, fontSize: 11, color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            borderBottom: '1px solid var(--border)',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((h) => (
                        <tr key={h.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '16px 20px', fontWeight: 500 }}>
                            <Link to={`/investments/${h.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                              {h.projectName || h.name}
                            </Link>
                          </td>
                          <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{h.sector || '—'}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700 }}>{format(h.amount)}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', color: 'var(--positive)', fontWeight: 700 }}>
                            {h.yield ? `${h.yield}%` : '—'}
                          </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 8 }}>
                            <Link to={'/investments/' + h.id + '/log'} style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Log</Link>
                            <Link to={'/investments/' + h.id} style={{ padding: '6px 12px', background: 'var(--accent)', borderRadius: 6, color: '#0A0A0A', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>View</Link>
                          </div>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
                    <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} aria-label="Previous page"
                      style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: safePage <= 1 ? 'not-allowed' : 'pointer', opacity: safePage <= 1 ? 0.4 : 1, color: 'var(--text)' }}>
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Page {safePage} of {totalPages}</span>
                    <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} aria-label="Next page"
                      style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: safePage >= totalPages ? 'not-allowed' : 'pointer', opacity: safePage >= totalPages ? 0.4 : 1, color: 'var(--text)' }}>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}

function EmptyBox({ text }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14 }}>
      {text}
    </div>
  );
}
