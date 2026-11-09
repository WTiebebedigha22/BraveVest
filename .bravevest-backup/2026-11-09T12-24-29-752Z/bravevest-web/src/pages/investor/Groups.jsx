import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function Groups() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', target: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/groups');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.groups ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load groups.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function create(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Group name is required.');
    if (!form.target || Number(form.target) <= 0) return setError('Target amount must be greater than zero.');

    setSaving(true);
    try {
      const data = await apiFetch('/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), target: Number(form.target) }),
      });
      setItems((prev) => [created, ...prev]);
      setForm({ name: '', target: '' });
      setShowForm(false);
    } catch (e) {
      setError(e?.message || 'Could not create group.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading groups…
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </PortalLayout>
  );
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Groups</h1>
        <button type="button" onClick={() => setShowForm((v) => !v)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'New group'}
        </button>
      </div>

      {error && (
        <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={create} style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Create a savings group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
            <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500 }}>
              Group name
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required placeholder="e.g. Family savings"
                style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }} />
            </label>
            <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500 }}>
              Target amount (₦)
              <input type="number" inputMode="numeric" min="1000" step="1000" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}
                required placeholder="1000000"
                style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }} />
            </label>
          </div>
          <button type="submit" disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Creating…' : 'Create group'}
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          <Users size={32} style={{ margin: '0 auto 12px', color: '#CCC' }} />
          <div style={{ fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>No groups yet</div>
          <div style={{ marginBottom: 16 }}>Pool funds with family, friends, or your community.</div>
          <button type="button" onClick={() => setShowForm(true)}
            style={{ padding: '10px 18px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Create your first group
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {items.map((g) => (
            <Link key={g.id} to={`/groups/${g.id}`}
              style={{ display: 'block', padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, textDecoration: 'none', color: COLORS.text }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>{g.memberCount || 0} members</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{format(g.saved || 0)}</span>
                <span style={{ fontSize: 12, color: COLORS.muted }}>of {format(g.target)}</span>
              </div>
              <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${g.target > 0 ? Math.min(100, Math.round(((g.saved || 0) / g.target) * 100)) : 0}%`, background: COLORS.accent }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
