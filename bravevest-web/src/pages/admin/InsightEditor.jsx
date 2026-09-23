import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { insightsApi } from '@/api/insights';
import { useToast } from '@/hooks/useToast';
import './InsightEditor.css';

const CATEGORIES = [
  'General',
  'Real Estate',
  'Agriculture',
  'Energy',
  'Credit',
  'Market Notes',
  'Platform',
  'Education',
];

export default function InsightEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    body: '',
    category: 'General',
    coverImage: '',
    isPublished: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    insightsApi.adminGet(id)
      .then((data) => setForm({
        title: data.title || '',
        summary: data.summary || '',
        body: data.body || '',
        category: data.category || 'General',
        coverImage: data.coverImage || '',
        isPublished: !!data.isPublished,
      }))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(publish) {
    setSaving(true);
    try {
      const payload = { ...form };
      if (publish !== undefined) payload.isPublished = publish;

      if (isEdit) {
        await insightsApi.update(id, payload);
        toast.success('Insight saved');
      } else {
        const created = await insightsApi.create(payload);
        toast.success(payload.isPublished ? 'Published' : 'Draft saved');
        nav('/admin/insights/' + created.id + '/edit');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  }

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <Link to="/admin/insights" className="ie-back">← All insights</Link>

      <AdminPageHeader
        eyebrow={isEdit ? 'Edit Insight' : 'New Insight'}
        title={isEdit ? form.title || 'Untitled' : 'Write an Insight'}
        subtitle="Publish market briefs, educational content, or platform updates"
        right={
          <>
            <Button variant="secondary" size="sm" onClick={() => save(false)} disabled={saving}>
              Save draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => save(true)} disabled={saving}>
              {form.isPublished ? 'Republish' : 'Publish'}
            </Button>
          </>
        }
      />

      <div className="ie-grid">
        <div className="ie-main">
          <AdminCard padded={false}>
            <AdminCard.Body>
              <Input
                label="Title"
                value={form.title}
                onChange={update('title')}
                placeholder="e.g. Why Nigerian Real Estate Is Re-Rating in 2026"
                required
              />

              <Input
                label="Summary"
                value={form.summary}
                onChange={update('summary')}
                placeholder="One-sentence hook shown in the feed"
                hint="Keep it under 240 characters"
              />

              <div className="ie-field">
                <label className="ie-label">Body</label>
                <textarea
                  className="ie-textarea"
                  value={form.body}
                  onChange={update('body')}
                  rows={20}
                  placeholder="Write the full article here. Line breaks are preserved. Basic markdown-like formatting works (## headings, - bullets, **bold**)."
                />
                <div className="ie-hint">{form.body.length} characters · {Math.max(1, Math.round(form.body.split(/\s+/).length))} words</div>
              </div>
            </AdminCard.Body>
          </AdminCard>
        </div>

        <aside className="ie-side">
          <AdminCard padded={false} className="mb-3">
            <AdminCard.Header title="Settings" />
            <AdminCard.Body>
              <div className="ie-field">
                <label className="ie-label">Category</label>
                <select className="ie-select" value={form.category} onChange={update('category')}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <Input
                label="Cover image URL"
                value={form.coverImage}
                onChange={update('coverImage')}
                placeholder="https://…"
                hint="Optional · 1200×630 recommended"
              />

              <div className="ie-toggle">
                <label className="ie-toggle__label">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  />
                  <span>Published</span>
                </label>
                <div className="ie-toggle__hint">
                  {form.isPublished
                    ? 'Visible to all users on /#/insights'
                    : 'Saved as a draft — only admins can see it'}
                </div>
              </div>
            </AdminCard.Body>
          </AdminCard>

          {form.coverImage && (
            <AdminCard padded={false} className="mb-3">
              <AdminCard.Header title="Preview" />
              <AdminCard.Body>
                <img src={form.coverImage} alt="" style={{ width: '100%', borderRadius: 12 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </AdminCard.Body>
            </AdminCard>
          )}

          <AdminCard padded={false}>
            <AdminCard.Header title="Tips" />
            <AdminCard.Body>
              <ul className="ie-tips">
                <li>Lead with the news or insight in the first sentence.</li>
                <li>Use short paragraphs — 2–3 sentences each.</li>
                <li>Include numbers, dates, and sources.</li>
                <li>End with a clear takeaway for investors.</li>
                <li>Avoid jargon — write for a first-time investor.</li>
              </ul>
            </AdminCard.Body>
          </AdminCard>
        </aside>
      </div>
    </>
  );
}
