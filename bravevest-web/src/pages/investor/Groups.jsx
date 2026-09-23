import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Currency from '@/components/shared/Currency';
import Modal from '@/components/shared/Modal';
import { groupsApi } from '@/api/groups';
import { useToast } from '@/hooks/useToast';
import './Groups.css';

export default function Groups() {
  const nav = useNavigate();
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', targetAmount: '', targetDate: '', type: 'CUSTOM' });
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    groupsApi.list()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const g = await groupsApi.create({
        ...form,
        targetAmount: Number(form.targetAmount),
      });
      toast.success('Group created');
      setCreateOpen(false);
      nav('/groups/' + g.id);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  }

  async function join(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const g = await groupsApi.join(joinCode.trim().toUpperCase());
      toast.success('Joined group');
      setJoinOpen(false);
      nav('/groups/' + g.id);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Investor"
        title="Group Savings"
        subtitle="Pool funds with cooperatives, families and diaspora groups"
        right={
          <>
            <Button variant="secondary" size="sm" onClick={() => setJoinOpen(true)}>Join with code</Button>
            <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>+ New group</Button>
          </>
        }
      />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : groups.length === 0 ? (
        <AdminEmpty
          title="No groups yet"
          body="Create a group for your cooperative, family or diaspora circle — or join one with an invite code."
          action={<Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>Create your first group</Button>}
        />
      ) : (
        <div className="groups-grid">
          {groups.map((g) => {
            const total = g.members.reduce((s, m) => s + Number(m.contributedAmount), 0);
            const target = Number(g.targetAmount);
            const pct = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;
            return (
              <Link key={g.id} to={'/groups/' + g.id} className="group-card">
                <div className="group-card__head">
                  <span className="group-card__type">{g.type}</span>
                  <span className={'group-card__status is-' + g.status.toLowerCase()}>{g.status}</span>
                </div>
                <h3 className="group-card__title">{g.name}</h3>
                {g.description && <p className="group-card__desc">{g.description}</p>}
                <div className="group-card__amounts">
                  <Currency value={total} />
                  <span className="group-card__target">of <Currency value={target} /></span>
                </div>
                <div className="group-card__progress"><div className="group-card__progress-bar" style={{ width: pct + '%' }} /></div>
                <div className="group-card__meta">
                  <span>{g._count?.members || g.members.length} members</span>
                  <span>{pct}% funded</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a group">
        <form onSubmit={create}>
          <Input label="Group name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} hint="Optional — what is this group for?" />
          <Input label="Target amount (₦)" type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
          <Input label="Target date" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          <div className="groups-field">
            <label className="groups-label">Group type</label>
            <select className="groups-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="COOPERATIVE">Cooperative</option>
              <option value="FAMILY">Family</option>
              <option value="DIASPORA">Diaspora</option>
              <option value="CHURCH">Church</option>
              <option value="WORKPLACE">Workplace</option>
              <option value="FRIENDS">Friends</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create group'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join a group">
        <form onSubmit={join}>
          <Input label="Invite code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="BV-XXXXXXXX" required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <Button variant="secondary" onClick={() => setJoinOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Joining…' : 'Join group'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
