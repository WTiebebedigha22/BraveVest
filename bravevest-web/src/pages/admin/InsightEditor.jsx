import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/api/client';
import PortalLayout from '@/components/layout/PortalLayout';

const BASE_PATH = '/insights';

const C = {
  surface:      'var(--bv-bg-elevated)',
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

export default function InsightEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    summary: '',
    category: '',
    body: '',
    coverImage: '',
    isPublished: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`${BASE_PATH}/${id}`);
        const data = res.data?.data ?? res.data;
        if (!cancelled) {
          setForm({
            title: data.title || '',
            summary: data.summary || '',
            category: data.category || '',
            body: data.body || '',
            coverImage: data.coverImage || '',
            isPublished: !!data.isPublished,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.response?.data?.error || e?.message || 'Could not load article.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');

    if (!form.title.trim()) return setErr('Title is required.');
    if (!form.body.trim()) return setErr('Content is required.');

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        category: form.category.trim() || 'General',
        body: form.body,
        coverImage: form.coverImage.trim() || null,
        isPublished: !!form.isPublished,
      };

      if (isEdit) await api.patch(`${BASE_PATH}/${id}`, payload);
      else await api.post(BASE_PATH, payload);

      setOk(isEdit ? 'Article updated.' : 'Article created.');
      if (!isEdit) setTimeout(() => navigate('/admin/insights'), 800);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PortalLayout>
        <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: C.muted }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading article…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  const input = {
    padding: '10px 12px',
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    background: C.surface,
    color: C.text,
  };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.text };

  return (
    <PortalLayout>
      <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto', color: C.text }}>
        <Link
          to="/admin/insights"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: C.muted,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to insights
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px', color: C.text }}>
          {isEdit ? 'Edit article' : 'New article'}
        </h1>

        <form
          onSubmit={submit}
          style={{ padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}
        >
          {err && (
            <div
              role="alert"
              style={{
                display: 'flex',
                gap: 8,
                padding: '10px 12px',
                background: C.negativeBg,
                border: `1px solid ${C.negativeBrd}`,
                borderRadius: 8,
                color: C.negative,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              <AlertCircle size={16} /> {err}
            </div>
          )}
          {ok && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: '10px 12px',
                background: C.positiveBg,
                border: `1px solid ${C.positiveBrd}`,
                borderRadius: 8,
                color: C.positive,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              <CheckCircle size={16} /> {ok}
            </div>
          )}

          <label style={label}>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={input}
            />
          </label>

          <label style={label}>
            Summary
            <input
              type="text"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="One-line teaser shown on cards"
              style={input}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <label style={label}>
              Category
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Market outlook"
                style={input}
              />
            </label>

            <label style={label}>
              Status
              <select
                value={form.isPublished ? 'published' : 'draft'}
                onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'published' })}
                style={input}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <label style={label}>
            Cover image URL
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://…"
              style={input}
            />
          </label>

          <label style={label}>
            Content
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={12}
              required
              style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              background: C.accent,
              color: C.accentText,
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}