import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, AlertCircle, Loader2, TrendingUp, Wallet, Shield } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/notifications');
        if (!cancelled) setItems(Array.isArray(data) ? data : (data && data.notifications) || []);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load notifications.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  async function markRead(id) {
    try {
      await apiFetch('/notifications/' + id + '/read', { method: 'POST' });
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (e) {}
  }
  async function markAll() {
    try {
      await apiFetch('/notifications/read-all', { method: 'POST' });
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {}
  }
  const unread = items.filter((n) => !n.read).length;
  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 4px' }}>Notifications</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{unread > 0 ? unread + ' unread' : 'All caught up'}</p>
            </div>
            {unread > 0 && <button onClick={markAll} className='bv-pill bv-pill--ghost'><CheckCheck size={14} /> Mark all read</button>}
          </div>
          {loading ? (
            <div style={{ padding: 48, display: 'flex', gap: 12, color: 'var(--text-muted)' }}><Loader2 size={20} /> Loading…</div>
          ) : error ? (
            <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', borderRadius: 12, color: '#F6465D', display: 'flex', gap: 12 }}><AlertCircle size={20} /> {error}</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <Bell size={40} color='var(--text-muted)' style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No notifications yet</h3>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((n) => {
                const kind = n.kind || (n.type && n.type.toLowerCase()) || 'default';
                const Icon = kind === 'investment' ? TrendingUp : kind === 'wallet' ? Wallet : kind === 'kyc' ? Shield : Bell;
                const tone = kind === 'investment' ? '#0ECB81' : kind === 'wallet' ? '#F6A500' : kind === 'kyc' ? '#F59E0B' : '#A1A1AA';
                return (
                  <li key={n.id} className='bv-card-lift' style={{ display: 'flex', gap: 16, padding: 20, background: n.read ? 'var(--surface)' : 'rgba(246,165,0,0.05)', border: '1px solid ' + (n.read ? 'var(--border)' : 'rgba(246,165,0,0.25)'), borderRadius: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: tone + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tone, flexShrink: 0 }}><Icon size={18} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, marginBottom: 4 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{n.body || n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.date || (n.createdAt && new Date(n.createdAt).toLocaleString())}</div>
                    </div>
                    {!n.read && <button onClick={() => markRead(n.id)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Check size={16} /></button>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
