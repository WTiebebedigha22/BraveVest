import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)', accent: 'var(--bv-accent)', positive: '#0ECB81', negative: '#F6465D',
};

export default function ContactInbox() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/contact');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.messages ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load messages.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading inbox…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Contact Inbox</h1>

      {items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          No messages yet.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((m) => (
            <li key={m.id} style={{ padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Mail size={16} color={COLORS.accent} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 12, color: COLORS.muted }}>· {m.email}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: COLORS.muted }}>{m.date}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{m.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
