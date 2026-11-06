import { useState } from 'react';
import { Gift, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

export default function Gifting() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [form, setForm] = useState({ recipient: '', amount: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');

    if (!form.recipient.trim()) {
      return setErr("Enter the recipient's email or phone.");
    }
    const amt = Number(form.amount);
    if (!amt || amt < 1000) {
      return setErr('Minimum gift is ₦1,000.');
    }

    setSubmitting(true);
    try {
      await apiFetch('/users/me/gift', {
        method: 'POST',
        body: {
          recipient: form.recipient.trim(),
          amount: amt,
          message: form.message.trim(),
        },
      });
      setOk(`Gift of ${format(amt)} sent to ${form.recipient}.`);
      setForm({ recipient: '', amount: '', message: '' });
    } catch (e) {
      setErr(e?.message || 'Could not send gift.');
    } finally {
      setSubmitting(false);
    }
  }

  const input = {
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    background: 'var(--surface)',
    color: 'var(--text)',
    width: '100%',
    fontFamily: 'inherit',
  };
  const label = {
    display: 'grid',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    color: 'var(--text)',
  };

  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Gifting
          </h1>
          <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 14 }}>
            Gift an investment to someone you care about. They receive the full return when it matures.
          </p>

          <form
            onSubmit={submit}
            style={{
              padding: 24,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
            }}
          >
            {err && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(246,70,93,0.1)',
                  border: '1px solid rgba(246,70,93,0.25)',
                  borderRadius: 8,
                  color: 'var(--negative)',
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} /> {err}
              </div>
            )}
            {ok && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(14,203,129,0.1)',
                  border: '1px solid rgba(14,203,129,0.25)',
                  borderRadius: 8,
                  color: 'var(--positive)',
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                <CheckCircle size={16} /> {ok}
              </div>
            )}

            <label style={label}>
              Recipient email or phone
              <input
                type="text"
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                required
                placeholder="friend@example.com or +2348012345678"
                style={input}
              />
            </label>

            <label style={label}>
              Gift amount (₦)
              <input
                type="number"
                inputMode="numeric"
                min="1000"
                step="500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                placeholder="10000"
                style={input}
              />
            </label>

            <label style={{ ...label, marginBottom: 20 }}>
              Personal message (optional)
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                placeholder="Add a note to your gift…"
                style={{ ...input, resize: 'vertical' }}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="bv-pill bv-pill--primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Gift size={16} />
              )}
              {submitting ? 'Sending…' : 'Send gift'}
            </button>
            <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
          </form>
        </div>
      </section>
    </PortalLayout>
  );
}