import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { storiesApi } from '@/api/stories';
import PortalLayout from '@/components/layout/PortalLayout';

const C = {
  surface: 'var(--bv-bg-elevated)',
  text: 'var(--bv-text)',
  muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)',
  accent: 'var(--bv-accent)',
  accentTxt: 'var(--bv-bg-elevated)',
  positive: 'var(--bv-positive, #0ECB81)',
  negative: 'var(--bv-negative, #F6465D)',
};

export default function StoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', role: '', quote: '', highlight: '', avatarText: '', imageUrl: '',
    isPublished: false, isFeatured: false, order: 0,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    storiesApi.adminGet(id)
      .then((data) => {
        if (cancelled) return;
        setForm({
          name: data.name || '',
          role: data.role || '',
          quote: data.quote || '',
          highlight: data.highlight || '',
          avatarText: data.avatarText || '',
          imageUrl: data.imageUrl || '',
          isPublished: !!data.isPublished,
          isFeatured: !!data.isFeatured,
          order: data.order || 0,
        });
      })
      .catch((e) => { if (!cancelled) setErr(e?.response?.data?.error || 'Could not load story.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.name.trim()) return setErr('Name is required.');
    if (!form.role.trim()) return setErr('Role is required.');
    if (!form.quote.trim()) return setErr('Quote is required.');

    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        avatarText: form.avatarText.trim() || null,
        highlight: form.highlight.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
      };
      if (isEdit) await storiesApi.update(id, payload);
      else await storiesApi.create(payload);
      setOk(isEdit ? 'Story updated.' : 'Story created.');
      if (!isEdit) setTimeout(() => navigate('/admin/stories'), 800);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PortalLayout><div style={{ padding: 48, display: 'flex', gap: 12, color: C.muted }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading story…</div></PortalLayout>;
  }

  const input = { padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: 'none', width: '100%', background: C.surface, color: C.text };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.text };

  return (
    <PortalLayout>
      <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto', color: C.text }}>
        <Link to="/admin/stories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to stories
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>{isEdit ? 'Edit story' : 'New story'}</h1>

        <form onSubmit={submit} style={{ padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          {err && <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: C.negative, fontSize: 13, marginBottom: 16 }}><AlertCircle size={16} /> {err}</div>}
          {ok && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(14,203,129,0.08)', border: '1px solid rgba(14,203,129,0.2)', borderRadius: 8, color: C.positive, fontSize: 13, marginBottom: 16 }}><CheckCircle size={16} /> {ok}</div>}

          <label style={label}>Name<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={input} /></label>
          <label style={label}>Role<input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Product designer, Lagos" required style={input} /></label>
          <label style={label}>Quote<textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} required style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>
          <label style={label}>Highlight<input type="text" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} placeholder="e.g. ₦100k → ₦118k in 6 months" style={input} /></label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <label style={label}>Avatar initials<input type="text" value={form.avatarText} onChange={(e) => setForm({ ...form, avatarText: e.target.value })} placeholder="CA" maxLength={3} style={input} /></label>
            <label style={label}>Order<input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} style={input} /></label>
          </div>

          <label style={label}>Image URL (optional)<input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" style={input} /></label>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
          </div>

          <button type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: C.accent, color: C.accentTxt, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create story'}
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}
