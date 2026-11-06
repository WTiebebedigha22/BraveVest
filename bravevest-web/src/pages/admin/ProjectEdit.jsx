import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

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
        const data = await apiFetch(`/admin/projects/${id}`, { );
        if (!cancelled) setForm({
          name: p.name || '', sector: p.sector || '',
          target: String(p.target ?? ''), minInvestment: String(p.minInvestment ?? ''),
          annualRate: String(p.annualRate ?? ''), tenor: String(p.tenor ?? ''),
          description: p.description || '', status: p.status || 'draft',
        });
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
    setErr(''); setOk('');
    if (!form.name.trim()) return setErr('Name is required.');
    setSaving(true);
    try {
      const data = await apiFetch(`/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(), sector: form.sector.trim(),
          target: Number(form.target), minInvestment: Number(form.minInvestment) || 0,
          annualRate: Number(form.annualRate), tenor: Number(form.tenor) || 12,
          description: form.description.trim(), status: form.status,
        }),
      });.catch(() => ({}));
        throw new Error(d?.message || 'Save failed.');
      }
      setOk('Project updated.');
    } catch (e) {
      setErr(e?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading project…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );

  const input = { padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', width: '100%' };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto', color: COLORS.text }}>
      <Link to="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to projects
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Edit Project</h1>

      <form onSubmit={submit} style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        {err && <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}><AlertCircle size={16} /> {err}</div>}
        {ok && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(14,203,129,0.08)', border: '1px solid rgba(14,203,129,0.2)', borderRadius: 8, color: COLORS.positive, fontSize: 13, marginBottom: 16 }}><CheckCircle size={16} /> {ok}</div>}

        {form && (
          <>
            <label style={label}>Name<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={input} /></label>
            <label style={label}>Sector<input type="text" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} style={input} /></label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <label style={label}>Target (₦)<input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} style={input} /></label>
              <label style={label}>Min (₦)<input type="number" value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} style={input} /></label>
              <label style={label}>Rate (%)<input type="number" step="0.1" value={form.annualRate} onChange={(e) => setForm({ ...form, annualRate: e.target.value })} style={input} /></label>
              <label style={label}>Tenor (months)<input type="number" value={form.tenor} onChange={(e) => setForm({ ...form, tenor: e.target.value })} style={input} /></label>
            </div>

            <label style={label}>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={input}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="funded">Funded</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label style={label}>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>

            <button type="submit" disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
