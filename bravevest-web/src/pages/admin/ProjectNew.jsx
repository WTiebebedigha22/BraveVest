import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Button from '@/components/shared/Button';
import { adminApi } from '@/api/admin';
import './ProjectForm.css';

export default function ProjectNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    category: 'REAL_ESTATE',
    payoutFrequency: 'quarterly',
    riskLevel: 'medium',
    status: 'OPEN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form };
      ['targetAmount', 'minInvestment', 'expectedReturnPct', 'tenorMonths'].forEach((k) => {
        if (payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
      });
      const created = await adminApi.createProject(payload);
      nav('/marketplace/' + created.slug);
    } catch (err) {
      const details = err?.response?.data?.details;
      const first = details && Object.keys(details)[0];
      setError((err?.response?.data?.message || 'Failed') + (first ? ` — ${details[first][0]}` : ''));
    } finally { setLoading(false); }
  }

  return (
    <>
      <Link to="/admin/projects" className="pf2__back">← All projects</Link>
      <AdminPageHeader
        eyebrow="Admin"
        title="New project"
        subtitle="Create a new marketplace opportunity"
      />

      <form onSubmit={submit} className="pf2">
        {error && <div className="pf2__error">{error}</div>}

        <div className="pf2__section">
          <div className="pf2__section-title">Overview</div>
          <div className="pf2__section-sub">What are you listing?</div>
          <div className="pf2__grid">
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Title</label>
              <input className="pf2__control" value={form.title || ''} onChange={update('title')} required />
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Summary</label>
              <input className="pf2__control" value={form.summary || ''} onChange={update('summary')} required />
              <span className="pf2__hint">One-line pitch (10–240 chars)</span>
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Description</label>
              <textarea className="pf2__control pf2__textarea" value={form.description || ''} onChange={update('description')} required rows={6} />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Category</label>
              <select className="pf2__control" value={form.category} onChange={update('category')}>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="AGRICULTURE">Agriculture</option>
                <option value="ENERGY">Energy</option>
                <option value="SME">SME</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
              </select>
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Risk level</label>
              <select className="pf2__control" value={form.riskLevel} onChange={update('riskLevel')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Cover image URL</label>
              <input className="pf2__control" value={form.coverImage || ''} onChange={update('coverImage')} placeholder="https://…" />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Location</label>
              <input className="pf2__control" value={form.location || ''} onChange={update('location')} placeholder="Lagos, Nigeria" />
            </div>
          </div>
        </div>

        <div className="pf2__section">
          <div className="pf2__section-title">Financials</div>
          <div className="pf2__section-sub">Terms and returns</div>
          <div className="pf2__grid">
            <div className="pf2__field">
              <label className="pf2__label">Target amount (₦)</label>
              <input className="pf2__control" type="number" value={form.targetAmount || ''} onChange={update('targetAmount')} required />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Minimum investment (₦)</label>
              <input className="pf2__control" type="number" value={form.minInvestment || ''} onChange={update('minInvestment')} required />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Expected return (% p.a.)</label>
              <input className="pf2__control" type="number" step="0.1" value={form.expectedReturnPct || ''} onChange={update('expectedReturnPct')} required />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Tenor (months)</label>
              <input className="pf2__control" type="number" value={form.tenorMonths || ''} onChange={update('tenorMonths')} required />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Payout frequency</label>
              <select className="pf2__control" value={form.payoutFrequency} onChange={update('payoutFrequency')}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="bullet">On maturity</option>
              </select>
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Closes at</label>
              <input className="pf2__control" type="date" value={form.closesAt || ''} onChange={update('closesAt')} />
            </div>
          </div>
        </div>

        <div className="pf2__actions">
          <Button as={Link} to="/admin/projects" variant="secondary" size="lg">Cancel</Button>
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Creating…' : 'Create project'}
          </Button>
        </div>
      </form>
    </>
  );
}
