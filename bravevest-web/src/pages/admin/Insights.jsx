import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function Insights() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/insights/admin/list', { );
        if (!cancelled) setItems(Array.isArray(data) ? data : data.insights ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load insights.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => (i.title || '').toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q));
  }, [items, search]);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading insights…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto', color: COLORS.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Insights</h1>
        <Link to="/admin/insights/new"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: COLORS.accent, color: '#FFF', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          <Plus size={16} /> New article
        </Link>
      </div>

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search insights" aria-label="Search insights"
          style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          {search ? 'No insights match your search.' : 'No insights yet. Create your first article.'}
        </div>
      ) : (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Title', 'Category', 'Status', ''].map((h) => (
                  <th key={h} style={{ textAlign: h === '' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{i.title}</td>
                  <td style={{ padding: '14px 16px', color: COLORS.muted }}>{i.category || '—'}</td>
                  <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: COLORS.muted }}>{i.status || 'draft'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Link to={`/insights/${i.id}/edit`} style={{ color: COLORS.accent, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>Edit →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
