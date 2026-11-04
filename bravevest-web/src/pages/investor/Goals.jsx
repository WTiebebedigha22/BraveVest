import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import { goalsApi } from '@/api/goals';
import { useCurrency } from '@/context/CurrencyContext';

export default function Goals() {
  const nav = useNavigate();
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', targetDate: '' });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    goalsApi.list().then(r => setItems(Array.isArray(r) ? r : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function create() {
    if (!form.name || !form.targetAmount) return;
    setSubmitting(true);
    try {
      await goalsApi.create({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        targetDate: form.targetDate || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        type: 'CUSTOM',
      });
      setShowCreate(false);
      setForm({ name: '', targetAmount: '', targetDate: '' });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to create goal');
    } finally { setSubmitting(false); }
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Goals</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Track your financial milestones</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn btn--primary">
            <Plus size={14} /> New Goal
          </button>
        </div>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Target size={32} color="var(--bybit-text-dim)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No goals yet. Set your first savings goal.</p>
            <button onClick={() => setShowCreate(true)} className="btn btn--primary">Create Goal</button>
          </div>
        ) : (
          <div className="grid-2">
            {items.map(g => {
              const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
              return (
                <Link key={g.id} to={'/goals/' + g.id} className="card" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{g.name}</h3>
                    <span className="pill pill--orange">{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bybit-surface-2)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: pct + '%', height: '100%', background: 'var(--bybit-orange)' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--bybit-text-muted)' }}>
                    <span>{format(g.currentAmount || 0)}</span>
                    <span>of {format(g.targetAmount || 0)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {showCreate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>New Goal</h2>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Goal Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Emergency Fund" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Target Amount</label>
                <input type="text" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value.replace(/[^0-9]/g, '') })} placeholder="500000" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Target Date</label>
                <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowCreate(false)} className="btn btn--outline" style={{ flex: 1 }}>Cancel</button>
                <button onClick={create} disabled={submitting} className="btn btn--primary" style={{ flex: 1 }}>{submitting ? 'Creating…' : 'Create'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
