import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { storiesApi } from '@/api/stories';
import PortalLayout from '@/components/layout/PortalLayout';

const C = {
  surface: 'var(--bv-bg-elevated)',
  surfaceAlt: 'var(--bv-bg)',
  text: 'var(--bv-text)',
  muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)',
  accent: 'var(--bv-accent)',
  accentTxt: 'var(--bv-bg-elevated)',
  positive: 'var(--bv-positive, #0ECB81)',
  negative: 'var(--bv-negative, #F6465D)',
};

export default function AdminStories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await storiesApi.adminList();
      const data = res.data ?? res.items ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not load stories.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(item) {
    setTogglingId(item.id);
    try {
      await storiesApi.update(item.id, { isPublished: !item.isPublished });
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isPublished: !i.isPublished } : i));
    } catch (e) {
      setError(e?.response?.data?.error || 'Toggle failed.');
    } finally {
      setTogglingId(null);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete story from "${item.name}"?`)) return;
    setDeletingId(item.id);
    try {
      await storiesApi.remove(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(e?.response?.data?.error || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <PortalLayout><div style={{ padding: 48, display: 'flex', gap: 12, color: C.muted }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading stories…</div></PortalLayout>;
  }

  return (
    <PortalLayout>
      <div style={{ padding: '24px 20px', maxWidth: 1000, margin: '0 auto', color: C.text }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Investor Stories</h1>
          <Link to="/admin/stories/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: C.accent, color: C.accentTxt, borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            <Plus size={16} /> New story
          </Link>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: C.negative, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
            No stories yet. Create your first one.
          </div>
        ) : (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.surfaceAlt }}>
                  {['Name', 'Role', 'Status', 'Order', ''].map((h) => (
                    <th key={h} style={{ textAlign: h === '' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((s) => {
                  const published = !!s.isPublished;
                  return (
                    <tr key={s.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500, color: C.text }}>{s.name}{s.isFeatured && <span style={{ marginLeft: 6, fontSize: 10, padding: '2px 6px', background: 'rgba(240,185,11,0.15)', color: C.accent, borderRadius: 4, fontWeight: 700 }}>FEATURED</span>}</td>
                      <td style={{ padding: '14px 16px', color: C.muted }}>{s.role}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button type="button" onClick={() => toggle(s)} disabled={togglingId === s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, border: `1px solid ${published ? 'rgba(14,203,129,0.3)' : C.border}`, background: published ? 'rgba(14,203,129,0.08)' : 'transparent', color: published ? C.positive : C.muted, fontSize: 12, fontWeight: 600, cursor: togglingId === s.id ? 'wait' : 'pointer' }}>
                          {published ? <Eye size={12} /> : <EyeOff size={12} />} {published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.muted }}>{s.order}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link to={`/admin/stories/${s.id}/edit`} style={{ color: C.accent, fontWeight: 600, textDecoration: 'none', fontSize: 13, marginRight: 12 }}>
                          <Edit3 size={14} style={{ verticalAlign: 'middle' }} /> Edit
                        </Link>
                        <button type="button" onClick={() => remove(s)} disabled={deletingId === s.id} style={{ background: 'none', border: 'none', color: C.negative, fontWeight: 600, fontSize: 13, cursor: deletingId === s.id ? 'wait' : 'pointer' }}>
                          <Trash2 size={14} style={{ verticalAlign: 'middle' }} /> Delete
                        </button>
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
