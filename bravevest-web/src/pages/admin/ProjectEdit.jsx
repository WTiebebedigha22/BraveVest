import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';
import { api } from '@/api/client';
import './ProjectForm.css';

export default function ProjectEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/projects/admin/list').then((r) => {
      const found = (r.data.data || []).find((p) => p.id === id);
      if (found) {
        const clean = { ...found };
        ['targetAmount', 'minInvestment', 'expectedReturnPct', 'tenorMonths'].forEach((k) => {
          if (clean[k] != null) clean[k] = String(clean[k]);
        });
        ['startDate', 'endDate', 'closesAt'].forEach((k) => {
          if (clean[k]) clean[k] = clean[k].slice(0, 10);
        });
        setForm(clean);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form };
      ['targetAmount', 'minInvestment', 'expectedReturnPct', 'tenorMonths'].forEach((k) => {
        if (payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
      });
      await adminApi.updateProject(id, payload);
      nav('/marketplace/' + form.slug);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  }

  if (loading || !form) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <Link to="/admin/projects" className="pf2__back">← All projects</Link>
      <AdminPageHeader eyebrow="Admin" title={form.title} subtitle="Update project details" />

      <form onSubmit={submit} className="pf2">
        {error && <div className="pf2__error">{error}</div>}

        <div className="pf2__section">
          <div className="pf2__section-title">Overview</div>
          <div className="pf2__grid">
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Title</label>
              <input className="pf2__control" value={form.title || ''} onChange={update('title')} required />
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Summary</label>
              <input className="pf2__control" value={form.summary || ''} onChange={update('summary')} required />
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Description</label>
              <textarea className="pf2__control pf2__textarea" value={form.description || ''} onChange={update('description')} rows={6} />
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
              <label className="pf2__label">Status</label>
              <select className="pf2__control" value={form.status} onChange={update('status')}>
                <option value="OPEN">Open</option>
                <option value="FUNDED">Funded</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Risk level</label>
              <select className="pf2__control" value={form.riskLevel || ''} onChange={update('riskLevel')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Location</label>
              <input className="pf2__control" value={form.location || ''} onChange={update('location')} />
            </div>
            <div className="pf2__field pf2__field--full">
              <label className="pf2__label">Cover image URL</label>
              <input className="pf2__control" value={form.coverImage || ''} onChange={update('coverImage')} />
            </div>
          </div>
        </div>

        <div className="pf2__section">
          <div className="pf2__section-title">Financials</div>
          <div className="pf2__grid">
            <div className="pf2__field">
              <label className="pf2__label">Target amount (₦)</label>
              <input className="pf2__control" type="number" value={form.targetAmount || ''} onChange={update('targetAmount')} />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Minimum investment (₦)</label>
              <input className="pf2__control" type="number" value={form.minInvestment || ''} onChange={update('minInvestment')} />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Expected return (% p.a.)</label>
              <input className="pf2__control" type="number" step="0.1" value={form.expectedReturnPct || ''} onChange={update('expectedReturnPct')} />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Tenor (months)</label>
              <input className="pf2__control" type="number" value={form.tenorMonths || ''} onChange={update('tenorMonths')} />
            </div>
            <div className="pf2__field">
              <label className="pf2__label">Payout frequency</label>
              <select className="pf2__control" value={form.payoutFrequency || ''} onChange={update('payoutFrequency')}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="bullet">On maturity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pf2__actions">
          <Button as={Link} to="/admin/projects" variant="secondary" size="lg">Cancel</Button>
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </>
  );
}
