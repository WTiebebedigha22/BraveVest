import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { adminApi } from '@/api/admin';
import './ProjectForm.css';

const FIELDS = [
  { k: 'title',             label: 'Title',              type: 'text',     required: true },
  { k: 'summary',           label: 'Summary',            type: 'text',     required: true, hint: 'Short one-liner (10–240 chars)' },
  { k: 'description',       label: 'Description',        type: 'textarea', required: true },
  { k: 'category',          label: 'Category',           type: 'select',   required: true, options: ['REAL_ESTATE','AGRICULTURE','ENERGY','SME','INFRASTRUCTURE'] },
  { k: 'coverImage',        label: 'Cover image URL',    type: 'text' },
  { k: 'targetAmount',      label: 'Target amount (₦)',  type: 'number',   required: true },
  { k: 'minInvestment',     label: 'Minimum investment (₦)', type: 'number', required: true },
  { k: 'expectedReturnPct', label: 'Expected return (% p.a.)', type: 'number', required: true },
  { k: 'tenorMonths',       label: 'Tenor (months)',     type: 'number',   required: true },
  { k: 'payoutFrequency',   label: 'Payout frequency',   type: 'select',   options: ['monthly','quarterly','annually','bullet'] },
  { k: 'location',          label: 'Location',           type: 'text' },
  { k: 'riskLevel',         label: 'Risk level',         type: 'select',   options: ['low','medium','high'] },
  { k: 'closesAt',          label: 'Closes at',          type: 'date' },
];

export default function ProjectNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({ payoutFrequency: 'quarterly', riskLevel: 'medium', category: 'REAL_ESTATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // coerce numeric strings
      const payload = { ...form };
      ['targetAmount','minInvestment','expectedReturnPct','tenorMonths'].forEach((k) => {
        if (payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
      });
      const created = await adminApi.createProject(payload);
      nav(`/marketplace/${created.slug}`);
    } catch (err) {
      const details = err?.response?.data?.details;
      const first = details && Object.keys(details)[0];
      setError((err?.response?.data?.message || 'Failed') + (first ? ` — ${details[first][0]}` : ''));
    } finally { setLoading(false); }
  }

  return (
    <>
      <Link to="/admin/projects" className="pf__back">← All projects</Link>
      <PageHeader title="New project" subtitle="Create a new marketplace opportunity." />

      <form onSubmit={submit} className="pf">
        <div className="pf__grid">
          {FIELDS.map((f) => <Field key={f.k} field={f} form={form} update={update} />)}
        </div>

        {error && <div className="auth__error">{error}</div>}

        <div className="pf__actions">
          <Button as={Link} to="/admin/projects" variant="secondary" size="lg">Cancel</Button>
          <Button type="submit" variant="primary" size="lg" disabled={loading}>{loading ? 'Creating…' : 'Create project'}</Button>
        </div>
      </form>
    </>
  );
}

export function Field({ field, form, update }) {
  if (field.type === 'select') {
    return (
      <label className="pf__field">
        <span className="pf__label">{field.label}</span>
        <select className="pf__control" value={form[field.k] || ''} onChange={update(field.k)} required={field.required}>
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {field.hint && <span className="pf__hint">{field.hint}</span>}
      </label>
    );
  }
  if (field.type === 'textarea') {
    return (
      <label className="pf__field pf__field--full">
        <span className="pf__label">{field.label}</span>
        <textarea className="pf__control pf__textarea" value={form[field.k] || ''} onChange={update(field.k)} required={field.required} rows={5} />
        {field.hint && <span className="pf__hint">{field.hint}</span>}
      </label>
    );
  }
  return (
    <label className="pf__field">
      <span className="pf__label">{field.label}</span>
      <input
        className="pf__control"
        type={field.type}
        value={form[field.k] || ''}
        onChange={update(field.k)}
        required={field.required}
        step={field.type === 'number' ? 'any' : undefined}
      />
      {field.hint && <span className="pf__hint">{field.hint}</span>}
    </label>
  );
}

export { FIELDS };
