import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Modal from '@/components/shared/Modal';
import GoalCard from '@/components/investor/GoalCard';
import { goalsApi } from '@/api/goals';
import { useToast } from '@/hooks/useToast';
import './Goals.css';

const GOAL_TYPES = [
  { value: 'RENT', label: 'Rent' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'RETIREMENT', label: 'Retirement' },
  { value: 'PROPERTY', label: 'Property' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'CUSTOM', label: 'Custom' },
];

export default function Goals() {
  const nav = useNavigate();
  const toast = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'CUSTOM', targetAmount: '', targetDate: '' });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    goalsApi.list()
      .then(setGoals)
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await goalsApi.create({ ...form, targetAmount: Number(form.targetAmount) });
      toast.success('Goal created');
      setCreateOpen(false);
      setForm({ name: '', type: 'CUSTOM', targetAmount: '', targetDate: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  }

  async function remove(id) {
    if (!confirm('Delete this goal?')) return;
    try {
      await goalsApi.remove(id);
      toast.success('Goal removed');
      load();
    } catch {
      toast.error('Failed');
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Investor"
        title="Investment Goals"
        subtitle="Set targets, get project recommendations matched to your timeline"
        right={<Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>+ New goal</Button>}
      />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : goals.length === 0 ? (
        <AdminEmpty
          title="No goals yet"
          body="Create a goal (rent, education, business) and we'll recommend projects matched to your timeline."
          action={<Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>Create your first goal</Button>}
        />
      ) : (
        <div className="goals-grid">
          {goals.map((g) => <GoalCard key={g.id} goal={g} onDelete={remove} />)}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a goal">
        <form onSubmit={create}>
          <Input label="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rent for 2027" required />
          <div className="goals-field">
            <label className="goals-label">Goal type</label>
            <select className="goals-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {GOAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Input label="Target amount (₦)" type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
          <Input label="Target date" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create goal'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
