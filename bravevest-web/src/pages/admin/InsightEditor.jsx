import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)', accent: 'var(--bv-accent)', positive: '#0ECB81', negative: '#F6465D',
};

export default function InsightEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({ title: '', category: '', content: '', status: 'draft' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch(`/insights/${id}`);
        if (!cancelled) setForm({
          title: data.title || '', category: data.category || '',
          content: data.content || '', status: data.status || 'draft',
        });
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not load article.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.title.trim()) return setErr('Title is required.');
    if (!form.content.trim()) return setErr('Content is required.');

    setSaving(true);
    try {
      const url = isEdit ? `/api/insights/${id}` : '/api/admin/insights';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setOk(isEdit ? 'Article updated.' : 'Article created.');
      if (!isEdit) setTimeout(() => navigate('/insights/admin/list'), 800);
    } catch (e) {
      setErr(e?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading article…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );

  const input = { padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', width: '100%' };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto', color: COLORS.text }}>
      <Link to="/insights/admin/list" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to insights
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>{isEdit ? 'Edit article' : 'New article'}</h1>

      <form onSubmit={submit} style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        {err && <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}><AlertCircle size={16} /> {err}</div>}
        {ok && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(14,203,129,0.08)', border: '1px solid rgba(14,203,129,0.2)', borderRadius: 8, color: COLORS.positive, fontSize: 13, marginBottom: 16 }}><CheckCircle size={16} /> {ok}</div>}

        <label style={label}>Title<input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={input} /></label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <label style={label}>Category<input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Market outlook" style={input} /></label>
          <label style={label}>Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <label style={label}>Content<textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} required style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>

        <button type="submit" disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: COLORS.accent, color: 'var(--bv-bg-elevated)', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
        </button>
      </form>
    </div>
  );
}
