import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/api/client';
import PortalLayout from '@/components/layout/PortalLayout';

const LIST_PATH = '/insights/admin/list';
const ITEM_PATH = (id) => `/insights/${id}`;

// Theme-aware tokens — resolved by your theme-tokens.css on both light and dark
const C = {
  surface:      'var(--bv-bg-elevated)',
  surfaceAlt:   'var(--bv-bg)',
  text:         'var(--bv-text)',
  muted:        'var(--bv-text-muted)',
  border:       'var(--bv-border)',
  accent:       'var(--bv-accent)',
  accentText:   'var(--bv-bg-elevated)',
  positive:     'var(--bv-positive, #0ECB81)',
  negative:     'var(--bv-negative, #F6465D)',
  positiveBg:   'rgba(14,203,129,0.10)',
  positiveBrd:  'rgba(14,203,129,0.30)',
  negativeBg:   'rgba(246,70,93,0.10)',
  negativeBrd:  'rgba(246,70,93,0.30)',
};

export default function Insights() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(LIST_PATH);
        const data = res.data?.data ?? res.data ?? [];
        if (!cancelled) setItems(Array.isArray(data) ? data : data.insights ?? []);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.error || e?.message || 'Could not load insights.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  async function togglePublish(item) {
    setTogglingId(item.id);
    try {
      const res = await api.patch(ITEM_PATH(item.id), { isPublished: !item.isPublished });
      const updated = res.data?.data ?? res.data;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...updated } : i)));
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not update publish state.');
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) {
    return (
      <PortalLayout>
        <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: C.muted }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading insights…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div role="alert" style={{ padding: 24, color: C.negative, display: 'flex', gap: 8 }}>
          <AlertCircle size={20} /> {error}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto', color: C.text }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: C.text }}>Insights</h1>
          <Link
            to="/admin/insights/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              background: C.accent,
              color: C.accentText,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <Plus size={16} /> New article
          </Link>
        </div>

        <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
          <Search
            size={16}
            color={C.muted}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search insights"
            aria-label="Search insights"
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              background: C.surface,
              color: C.text,
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: C.muted,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 14,
            }}
          >
            {search ? 'No insights match your search.' : 'No insights yet. Create your first article.'}
          </div>
        ) : (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.surfaceAlt }}>
                  {['Title', 'Category', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === '' ? 'right' : 'left',
                        padding: '12px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.muted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const published = !!i.isPublished;
                  return (
                    <tr key={i.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500, color: C.text }}>{i.title}</td>
                      <td style={{ padding: '14px 16px', color: C.muted }}>{i.category || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          onClick={() => togglePublish(i)}
                          disabled={togglingId === i.id}
                          title={published ? 'Unpublish' : 'Publish'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 999,
                            border: `1px solid ${published ? C.positiveBrd : C.border}`,
                            background: published ? C.positiveBg : 'transparent',
                            color: published ? C.positive : C.muted,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: togglingId === i.id ? 'wait' : 'pointer',
                          }}
                        >
                          {published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link
                          to={`/admin/insights/${i.id}/edit`}
                          style={{ color: C.accent, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}