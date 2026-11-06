import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CATEGORIES = [
  { value: 'ENERGY', label: 'Energy' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'SME', label: 'SME' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
];

const STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'OPEN', label: 'Open' },
  { value: 'FUNDED', label: 'Funded' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const project = await apiFetch(`/admin/projects/${id}`);
        if (!cancelled) {
          setForm({
            title: project.title || project.name || '',
            summary: project.summary || '',
            description: project.description || '',
            category: project.category || 'SME',
            targetAmount: String(project.targetAmount ?? project.target ?? ''),
            minInvestment: String(project.minInvestment ?? ''),
            expectedReturnPct: String(project.expectedReturnPct ?? project.annualRate ?? ''),
            tenorMonths: String(project.tenorMonths ?? project.tenor ?? ''),
            riskLevel: project.riskLevel || '',
            location: project.location || '',
            status: project.status || 'DRAFT',
          });
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not load project.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');
    if (!form.title.trim()) return setErr('Title is required.');

    setSaving(true);
    try {
      await apiFetch(`/admin/projects/${id}`, {
        method: 'PATCH',
        body: {
          title: form.title.trim(),
          summary: form.summary.trim(),
          description: form.description.trim(),
          category: form.category,
          targetAmount: Number(form.targetAmount),
          minInvestment: Number(form.minInvestment) || 0,
          expectedReturnPct: Number(form.expectedReturnPct),
          tenorMonths: Number(form.tenorMonths) || 12,
          riskLevel: form.riskLevel || null,
          location: form.location || null,
          status: form.status,
        },
      });
      setOk('Project updated.');
    } catch (e) {
      setErr(e?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PortalLayout theme="dark">
        <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading project…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  const input = {
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontFamily: 'inherit',
  };
  const label = {
    display: 'grid',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    color: 'var(--text)',
  };

  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link
            to="/admin/projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}
          >
            <ArrowLeft size={14} /> Back to projects
          </Link>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, margin: '0 0 20px', color: 'var(--text)' }}>
            Edit project
          </h1>

          <form
            onSubmit={submit}
            style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}
          >
            {err && (
              <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 8, color: 'var(--negative)', fontSize: 13, marginBottom: 16 }}>
                <AlertCircle size={16} /> {err}
              </div>
            )}
            {ok && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(14,203,129,0.1)', border: '1px solid rgba(14,203,129,0.25)', borderRadius: 8, color: 'var(--positive)', fontSize: 13, marginBottom: 16 }}>
                <CheckCircle size={16} /> {ok}
              </div>
            )}

            {form && (
              <>
                <label style={label}>
                  Title
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={input} />
                </label>

                <label style={label}>
                  Summary
                  <input type="text" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} style={input} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <label style={label}>
                    Category
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </label>
                  <label style={label}>
                    Risk level
                    <select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })} style={input}>
                      <option value="">—</option>
                      <option value="A">A (Low)</option>
                      <option value="AA">AA (Very Low)</option>
                      <option value="BBB">BBB (Medium)</option>
                      <option value="BB">BB (High)</option>
                      <option value="B">B (Very High)</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <label style={label}>
                    Target (₦)
                    <input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} style={input} />
                  </label>
                  <label style={label}>
                    Min investment (₦)
                    <input type="number" value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} style={input} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <label style={label}>
                    Annual yield (%)
                    <input type="number" step="0.1" value={form.expectedReturnPct} onChange={(e) => setForm({ ...form, expectedReturnPct: e.target.value })} style={input} />
                  </label>
                  <label style={label}>
                    Tenor (months)
                    <input type="number" value={form.tenorMonths} onChange={(e) => setForm({ ...form, tenorMonths: e.target.value })} style={input} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <label style={label}>
                    Location
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" style={input} />
                  </label>
                  <label style={label}>
                    Status
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={input}>
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                </div>

                <label style={label}>
                  Description
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} style={{ ...input, resize: 'vertical' }} />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="bv-pill bv-pill--primary"
                  style={{ justifyContent: 'center', minWidth: 160 }}
                >
                  {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </PortalLayout>
  );
}