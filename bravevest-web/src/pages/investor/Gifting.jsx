import { useState } from 'react';
import { Gift, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function Gifting() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [form, setForm] = useState({ recipient: '', amount: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.recipient.trim()) return setErr('Enter the recipient\'s email or phone.');
    const amt = Number(form.amount);
    if (!amt || amt < 1000) return setErr('Minimum gift is ₦1,000.');

    setSubmitting(true);
    try {
      const data = await apiFetch('/users/me/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: form.recipient.trim(), amount: amt, message: form.message.trim() }),
      });.catch(() => ({}));
        throw new Error(data?.message || 'Could not send gift.');
      }
      setOk(`Gift of ${format(amt)} sent to ${form.recipient}.`);
      setForm({ recipient: '', amount: '', message: '' });
    } catch (e) {
      setErr(e?.message || 'Could not send gift.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PortalLayout theme="dark">
      <div style={{ padding: '24px 20px', maxWidth: 560, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Gifting</h1>
      <p style={{ margin: '0 0 20px', color: COLORS.muted, fontSize: 14 }}>
        Gift an investment to someone you care about. They receive the full return when it matures.
      </p>

      <form onSubmit={submit} style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        {err && (
          <div role="alert" style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={16} /> {err}
          </div>
        )}
        {ok && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: 'rgba(14,203,129,0.08)', border: '1px solid rgba(14,203,129,0.2)', borderRadius: 8, color: COLORS.positive, fontSize: 13, marginBottom: 16 }}>
            <CheckCircle size={16} /> {ok}
          </div>
        )}

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          Recipient email or phone
          <input type="text" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            required placeholder="friend@example.com or +2348012345678"
            style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }} />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          Gift amount (₦)
          <input type="number" inputMode="numeric" min="1000" step="500" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required placeholder="10000"
            style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }} />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
          Personal message (optional)
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3} placeholder="Add a note to your gift…"
            style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
        </label>

        <button type="submit" disabled={submitting}
          style={{ width: '100%', padding: '14px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Gift size={16} />}
          {submitting ? 'Sending…' : 'Send gift'}
        </button>
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </form>
    </div>
    </PortalLayout>
  );
}
