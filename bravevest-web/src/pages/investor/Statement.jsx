import { useEffect, useMemo, useState } from 'react';
import { Search, Download, Loader2, AlertCircle, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

const PAGE_SIZE = 20;
const TYPES = ['all','DEPOSIT','WITHDRAWAL','INVESTMENT','PAYOUT','REFUND','TRANSFER'];
const STATUS_COLORS = {
  COMPLETED: { bg: 'rgba(14,203,129,0.1)', color: '#0ECB81' },
  PENDING: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  FAILED: { bg: 'rgba(246,70,93,0.1)', color: '#F6465D' },
  REJECTED: { bg: 'rgba(246,70,93,0.1)', color: '#F6465D' },
};

export default function Statement({ embedded = false }) {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (type !== 'all') params.set('type', type);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        const data = await apiFetch('/wallet/statement?' + params.toString());
        if (!cancelled) setItems(Array.isArray(data) ? data : (data && data.transactions) || []);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load statement.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [type, from, to]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((t) =>
      (t.reference || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.type || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const inflows = items.filter((t) => ['DEPOSIT','PAYOUT','REFUND'].includes(t.type)).reduce((s,t) => s + Number(t.amount || 0), 0);
  const outflows = items.filter((t) => ['WITHDRAWAL','INVESTMENT','TRANSFER'].includes(t.type)).reduce((s,t) => s + Math.abs(Number(t.amount || 0)), 0);

  function exportCsv() {
    const rows = [['Date','Reference','Type','Amount','Description','Status']];
    filtered.forEach((t) => rows.push([t.date || t.createdAt || '', t.reference || '', t.type || '', t.amount || '', (t.description || '').replace(/,/g, ';'), t.status || '']));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bravevest-statement-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none' };

  const body = (
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Account statement</h1>
            <button onClick={exportCsv} className='bv-pill bv-pill--ghost'><Download size={14} /> Export CSV</button>
          </div>
          <p className='bv-fade-up' style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: 15 }}>Full transaction history.</p>
          <div className='bv-grid-2 bv-fade-up' style={{ marginBottom: 24 }}>
            <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', marginBottom: 8 }}><ArrowDownLeft size={18} color='#0ECB81' /><span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Inflows</span></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0ECB81' }}>{format(inflows)}</div>
            </div>
            <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', marginBottom: 8 }}><ArrowUpRight size={18} color='#F6465D' /><span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Outflows</span></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F6465D' }}>{format(outflows)}</div>
            </div>
          </div>
          <div className='bv-fade-up' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color='var(--text-muted)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input type='search' value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder='Search' style={{ ...inputStyle, paddingLeft: 38 }} />
            </div>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} style={inputStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
            </select>
            <input type='date' value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
            <input type='date' value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
          </div>
          {loading ? (
            <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}><Loader2 size={20} /><span>Loading…</span></div>
          ) : error ? (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D', display: 'flex', gap: 12 }}><AlertCircle size={20} /> {error}</div>
          ) : pageItems.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text-muted)' }}>No transactions.</div>
          ) : (
            <>
              <div className='bv-fade-up' style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 800 }}>
                    <thead>
                      <tr>
                        {['Date','Reference','Type','Description','Amount','Status'].map((h) => (
                          <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '14px 20px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((t) => {
                        const status = (t.status || 'COMPLETED').toUpperCase();
                        const sc = STATUS_COLORS[status] || STATUS_COLORS.COMPLETED;
                        const credit = ['DEPOSIT','PAYOUT','REFUND'].includes(t.type);
                        return (
                          <tr key={t.id} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{t.date || (t.createdAt && new Date(t.createdAt).toLocaleDateString())}</td>
                            <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{t.reference || '—'}</td>
                            <td style={{ padding: '14px 20px', textTransform: 'capitalize' }}>{t.type || '—'}</td>
                            <td style={{ padding: '14px 20px', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '—'}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: credit ? '#0ECB81' : 'var(--text)' }}>{credit ? '+' : '-'}{format(Math.abs(Number(t.amount || 0)))}</td>
                            <td style={{ padding: '14px 20px' }}><span style={{ display: 'inline-block', padding: '4px 10px', background: sc.bg, color: sc.color, borderRadius: 9999, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{status.toLowerCase()}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalPages > 1 && (
                <nav style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}><ChevronLeft size={16} /></button>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>Page {safePage} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}><ChevronRight size={16} /></button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    );

  return embedded ? body : <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Account statement</h1>
            <button onClick={exportCsv} className='bv-pill bv-pill--ghost'><Download size={14} /> Export CSV</button>
          </div>
          <p className='bv-fade-up' style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: 15 }}>Full transaction history.</p>
          <div className='bv-grid-2 bv-fade-up' style={{ marginBottom: 24 }}>
            <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', marginBottom: 8 }}><ArrowDownLeft size={18} color='#0ECB81' /><span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Inflows</span></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0ECB81' }}>{format(inflows)}</div>
            </div>
            <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', marginBottom: 8 }}><ArrowUpRight size={18} color='#F6465D' /><span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Outflows</span></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F6465D' }}>{format(outflows)}</div>
            </div>
          </div>
          <div className='bv-fade-up' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color='var(--text-muted)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input type='search' value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder='Search' style={{ ...inputStyle, paddingLeft: 38 }} />
            </div>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} style={inputStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
            </select>
            <input type='date' value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
            <input type='date' value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
          </div>
          {loading ? (
            <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}><Loader2 size={20} /><span>Loading…</span></div>
          ) : error ? (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D', display: 'flex', gap: 12 }}><AlertCircle size={20} /> {error}</div>
          ) : pageItems.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text-muted)' }}>No transactions.</div>
          ) : (
            <>
              <div className='bv-fade-up' style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 800 }}>
                    <thead>
                      <tr>
                        {['Date','Reference','Type','Description','Amount','Status'].map((h) => (
                          <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '14px 20px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((t) => {
                        const status = (t.status || 'COMPLETED').toUpperCase();
                        const sc = STATUS_COLORS[status] || STATUS_COLORS.COMPLETED;
                        const credit = ['DEPOSIT','PAYOUT','REFUND'].includes(t.type);
                        return (
                          <tr key={t.id} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{t.date || (t.createdAt && new Date(t.createdAt).toLocaleDateString())}</td>
                            <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{t.reference || '—'}</td>
                            <td style={{ padding: '14px 20px', textTransform: 'capitalize' }}>{t.type || '—'}</td>
                            <td style={{ padding: '14px 20px', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '—'}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: credit ? '#0ECB81' : 'var(--text)' }}>{credit ? '+' : '-'}{format(Math.abs(Number(t.amount || 0)))}</td>
                            <td style={{ padding: '14px 20px' }}><span style={{ display: 'inline-block', padding: '4px 10px', background: sc.bg, color: sc.color, borderRadius: 9999, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{status.toLowerCase()}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalPages > 1 && (
                <nav style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}><ChevronLeft size={16} /></button>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>Page {safePage} of {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}><ChevronRight size={16} /></button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </PortalLayout>;
}
