import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

export default function Goals() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', deadline: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/goals');
        if (!cancelled) setItems(Array.isArray(data) ? data : (data && data.goals) || []);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load goals.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function create(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Goal name is required.');
    if (!form.target || Number(form.target) <= 0) return setError('Target amount must be greater than zero.');
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name: form.name.trim(), target: Number(form.target), deadline: form.deadline || null }),
      });
      if (!res.ok) throw new Error('Could not create goal.');
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setForm({ name: '', target: '', deadline: '' });
      setShowForm(false);
    } catch (e) {
      setError(e && e.message ? e.message : 'Could not create goal.');
    } finally {
      setSaving(false);
    }
  }

  const input = {
    padding: '12px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  };
  const label = {
    display: 'grid',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
  };

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Goals
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
                Set savings targets and track your progress.
              </p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className='bv-pill bv-pill--primary'>
              <Plus size={16} /> {showForm ? 'Cancel' : 'New goal'}
            </button>
          </div>

          {error && (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12, marginBottom: 24 }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={create} className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: 'var(--text)' }}>Create a goal</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                <label style={label}>
                  Goal name
                  <input type='text' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder='e.g. Retirement fund' style={input} />
                </label>
                <label style={label}>
                  Target amount (₦)
                  <input type='number' min='1000' step='1000' value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required placeholder='500000' style={input} />
                </label>
                <label style={label}>
                  Deadline
                  <input type='date' value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} style={input} />
                </label>
              </div>
              <button type='submit' disabled={saving} className='bv-pill bv-pill--primary'>
                {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                {saving ? 'Creating…' : 'Create goal'}
              </button>
              <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            </form>
          )}

          {loading ? (
            <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Loading goals…
              <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            </div>
          ) : items.length === 0 ? (
            <div className='bv-card-lift bv-fade-up' style={{ padding: 64, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
              <Target size={48} color='#F6A500' style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>No goals yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                Set a savings target to stay motivated and track progress.
              </p>
              <button onClick={() => setShowForm(true)} className='bv-pill bv-pill--primary'>
                <Plus size={16} /> Create your first goal
              </button>
            </div>
          ) : (
            <div className='bv-fade-up' style={{ display: 'grid', gap: 12 }}>
              {items.map((g) => {
                const progress = g.target > 0 ? Math.min(100, Math.round(((g.saved || 0) / g.target) * 100)) : 0;
                return (
                  <Link key={g.id} to={'/goals/' + g.id} className='bv-card-lift' style={{
                    display: 'block', padding: 24,
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
                    textDecoration: 'none', color: 'var(--text)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{g.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {g.deadline ? 'Target date ' + g.deadline : 'No deadline'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          {format(g.saved)} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>of {format(g.target)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#0ECB81', fontWeight: 600, marginTop: 2 }}>
                          {progress}% complete
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-soft)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: progress + '%', background: '#F6A500', borderRadius: 4 }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
