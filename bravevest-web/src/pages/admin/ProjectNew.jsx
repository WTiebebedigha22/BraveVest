import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function ProjectNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', sector: '', target: '', minInvestment: '', annualRate: '', tenor: '', description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Project name is required.');
    if (!form.target || Number(form.target) <= 0) return setError('Target amount is required.');
    if (!form.annualRate || Number(form.annualRate) <= 0) return setError('Annual rate is required.');

    setSaving(true);
    try {
      const data = await apiFetch('/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          sector: form.sector.trim(),
          target: Number(form.target),
          minInvestment: Number(form.minInvestment) || 0,
          annualRate: Number(form.annualRate),
          tenor: Number(form.tenor) || 12,
          description: form.description.trim(),
        }),
      });.catch(() => ({}));
        throw new Error(d?.message || 'Could not create project.');
      }
      navigate('/admin/projects', { replace: true });
    } catch (e) {
      setError(e?.message || 'Could not create project.');
    } finally {
      setSaving(false);
    }
  }

  const input = { padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', width: '100%' };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 };

  return (
    <PortalLayout theme="dark">
      <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto', color: COLORS.text }}>
      <Link to="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to projects
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>New Project</h1>

      <form onSubmit={submit} style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        {error && (
          <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <label style={label}>Project name<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={input} /></label>
        <label style={label}>Sector<input type="text" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="e.g. Real Estate" style={input} /></label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <label style={label}>Target (₦)<input type="number" inputMode="numeric" min="0" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required style={input} /></label>
          <label style={label}>Min investment (₦)<input type="number" inputMode="numeric" min="0" value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} style={input} /></label>
          <label style={label}>Annual rate (%)<input type="number" inputMode="decimal" min="0" step="0.1" value={form.annualRate} onChange={(e) => setForm({ ...form, annualRate: e.target.value })} required style={input} /></label>
          <label style={label}>Tenor (months)<input type="number" inputMode="numeric" min="1" value={form.tenor} onChange={(e) => setForm({ ...form, tenor: e.target.value })} style={input} /></label>
        </div>

        <label style={label}>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>

        <button type="submit" disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {saving ? 'Creating…' : 'Create project'}
        </button>
      </form>
    </div>
    </PortalLayout>
  );
}
