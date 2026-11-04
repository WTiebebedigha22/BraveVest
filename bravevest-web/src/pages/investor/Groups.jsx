import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { groupsApi } from '@/api/groups';
import { useCurrency } from '@/context/CurrencyContext';

export default function Groups() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '' });
  const [inviteCode, setInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    groupsApi.list().then(r => setItems(Array.isArray(r) ? r : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function create() {
    if (!form.name || !form.targetAmount) return;
    setSubmitting(true);
    try {
      await groupsApi.create({ name: form.name, targetAmount: Number(form.targetAmount), type: 'CUSTOM' });
      setShowCreate(false);
      setForm({ name: '', targetAmount: '' });
      load();
    } catch (e) { alert(e?.response?.data?.message || 'Failed to create group'); }
    finally { setSubmitting(false); }
  }

  async function join() {
    if (!inviteCode.trim()) return;
    setSubmitting(true);
    try {
      await groupsApi.join(inviteCode.trim());
      setShowJoin(false);
      setInviteCode('');
      load();
    } catch (e) { alert(e?.response?.data?.message || 'Failed to join group'); }
    finally { setSubmitting(false); }
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Savings Groups</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Pool funds with your community</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowJoin(true)} className="btn btn--outline">Join with code</button>
            <button onClick={() => setShowCreate(true)} className="btn btn--primary"><Plus size={14} /> Create</button>
          </div>
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Users size={32} color="var(--bybit-text-dim)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No groups yet. Start one or join with an invite code.</p>
          </div>
        ) : (
          <div className="grid-2">
            {items.map(g => (
              <Link key={g.id} to={'/groups/' + g.id} className="card" style={{ textDecoration: 'none' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>{g.name}</h3>
                <p style={{ color: 'var(--bybit-text-muted)', fontSize: '12px', marginBottom: '12px' }}>
                  {g.type} · {g.members?.length || 0} members
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--bybit-text-muted)' }}>Target</span>
                  <span style={{ fontWeight: '600' }}>{format(g.targetAmount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showCreate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Create Group</h2>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Group Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Family Savings" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Target Amount</label>
                <input type="text" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value.replace(/[^0-9]/g, '') })} placeholder="1000000" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowCreate(false)} className="btn btn--outline" style={{ flex: 1 }}>Cancel</button>
                <button onClick={create} disabled={submitting} className="btn btn--primary" style={{ flex: 1 }}>Create</button>
              </div>
            </div>
          </div>
        )}

        {showJoin && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Join Group</h2>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Invite Code</label>
                <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Enter code" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowJoin(false)} className="btn btn--outline" style={{ flex: 1 }}>Cancel</button>
                <button onClick={join} disabled={submitting} className="btn btn--primary" style={{ flex: 1 }}>Join</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
