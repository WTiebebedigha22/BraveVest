import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CATEGORIES = [
  { value: 'ENERGY', label: 'Energy' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'SME', label: 'SME' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
];

export default function SubmitOpportunity() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '', summary: '', description: '', category: 'SME',
    targetAmount: '', minInvestment: '', expectedReturnPct: '', tenorMonths: '',
    riskLevel: '', location: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.title.trim() || !form.summary.trim() || !form.description.trim()) {
      return setErr('Title, summary, and description are required.');
    }
    if (!form.targetAmount || !form.minInvestment || !form.expectedReturnPct || !form.tenorMonths) {
      return setErr('Amount fields are required.');
    }
    setSubmitting(true);
    try {
      await apiFetch('/projects/submit', { method: 'POST', body: form });
      setOk('Opportunity submitted. An admin will review it within 24 hours.');
      setTimeout(() => nav('/opportunities/mine'), 1500);
    } catch (e) {
      setErr(e?.message || 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  }

  const input = { padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'inherit' };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 16 };

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link to='/dashboard' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Submit an opportunity
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 32px', fontSize: 15 }}>
            Have a project that needs funding? Submit it for review. An admin will approve or reject within 24 hours. Approved projects appear in the public marketplace.
          </p>

          <form onSubmit={submit} className='bv-card-lift' style={{ padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            {err && <div style={{ padding: '10px 12px', background: 'rgba(246,70,93,0.1)', borderRadius: 8, color: '#F6465D', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8 }}><AlertCircle size={16} /> {err}</div>}
            {ok && <div style={{ padding: '10px 12px', background: 'rgba(14,203,129,0.1)', borderRadius: 8, color: '#0ECB81', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8 }}><CheckCircle size={16} /> {ok}</div>}

            <label style={label}>Project title<input type='text' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder='e.g., Lagos Solar Fund III' style={input} /></label>
            <label style={label}>One-line summary<input type='text' value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required placeholder='A 30MW solar portfolio across Lagos' style={input} /></label>
            <label style={label}>Full description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={6} placeholder='Collateral, offtaker, sponsor track record, use of funds, timeline...' style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <label style={label}>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>
              <label style={label}>Risk level<select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })} style={input}><option value=''>Select</option><option value='A'>A (Low)</option><option value='AA'>AA (Very Low)</option><option value='BBB'>BBB (Medium)</option><option value='BB'>BB (High)</option><option value='B'>B (Very High)</option></select></label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <label style={label}>Target (₦)<input type='number' value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required placeholder='250000000' style={input} /></label>
              <label style={label}>Min investment (₦)<input type='number' value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} required placeholder='50000' style={input} /></label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <label style={label}>Annual yield (%)<input type='number' step='0.1' value={form.expectedReturnPct} onChange={(e) => setForm({ ...form, expectedReturnPct: e.target.value })} required placeholder='14.5' style={input} /></label>
              <label style={label}>Tenor (months)<input type='number' value={form.tenorMonths} onChange={(e) => setForm({ ...form, tenorMonths: e.target.value })} required placeholder='18' style={input} /></label>
            </div>

            <label style={label}>Location (optional)<input type='text' value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='Lagos, Nigeria' style={input} /></label>

            <div style={{ padding: 12, background: 'rgba(246,165,0,0.08)', border: '1px solid rgba(246,165,0,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              By submitting, you confirm the details are accurate. Admin review within 24 hours. You can track status in <strong>My Submissions</strong>.
            </div>

            <button type='submit' disabled={submitting} className='bv-pill bv-pill--primary' style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              {submitting ? 'Submitting…' : 'Submit for review'}
            </button>
            <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
          </form>
        </div>
      </section>
    </PortalLayout>
  );
}
