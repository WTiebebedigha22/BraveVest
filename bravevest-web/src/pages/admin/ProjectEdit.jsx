import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import { adminApi } from '@/api/admin';
import { api } from '@/api/client';
import { Field, FIELDS } from './ProjectNew';
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
        ['targetAmount','minInvestment','expectedReturnPct','tenorMonths'].forEach((k) => { if (clean[k] != null) clean[k] = String(clean[k]); });
        ['startDate','endDate','closesAt'].forEach((k) => { if (clean[k]) clean[k] = clean[k].slice(0, 10); });
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
      ['targetAmount','minInvestment','expectedReturnPct','tenorMonths'].forEach((k) => {
        if (payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
      });
      await adminApi.updateProject(id, payload);
      nav(`/marketplace/${form.slug}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  }

  if (loading || !form) return <Loader />;

  return (
    <>
      <Link to="/admin/projects" className="pf__back">← All projects</Link>
      <PageHeader title={`Edit: ${form.title}`} subtitle="Update project details." />

      <form onSubmit={submit} className="pf">
        <div className="pf__grid">
          {FIELDS.map((f) => <Field key={f.k} field={f} form={form} update={update} />)}
        </div>

        {error && <div className="auth__error">{error}</div>}

        <div className="pf__actions">
          <Button as={Link} to="/admin/projects" variant="secondary" size="lg">Cancel</Button>
          <Button type="submit" variant="primary" size="lg" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </form>
    </>
  );
}
