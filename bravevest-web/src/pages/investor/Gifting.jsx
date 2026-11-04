import { useState } from 'react';
import { Gift, Mail } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';

export default function Gifting() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [form, setForm] = useState({ recipientEmail: '', amount: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.recipientEmail || !form.amount) return;
    setSubmitting(true);
    try {
      // TODO: wire to /api/gifts/send when backend is ready
      await new Promise(r => setTimeout(r, 800));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div style={{ padding: '32px 0' }}>
        <div className="container container--narrow">
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <Gift size={48} color="var(--bybit-orange)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ margin: '0 0 12px', fontSize: '22px' }}>Gift Sent</h2>
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '24px', fontSize: '14px' }}>
              {format(Number(form.amount))} has been gifted to {form.recipientEmail}. They will receive an invitation to claim it.
            </p>
            <button onClick={() => { setSent(false); setForm({ recipientEmail: '', amount: '', message: '' }); }} className="btn btn--outline">
              Send Another Gift
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container container--narrow">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Gifting</h1>
          <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Gift investments to friends and family</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
            <Gift size={32} color="var(--bybit-orange)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', marginBottom: '6px' }}>Give the gift of growth</h2>
              <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Gift an investment amount to a friend. They can redeem it and start building their own portfolio.
              </p>
            </div>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Recipient Email</label>
              <input type="email" value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })} placeholder="friend@example.com" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Gift Amount</label>
              <input type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^0-9]/g, '') })} placeholder="50000" required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label">Personal Message (optional)</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="Happy birthday! Start investing." />
            </div>

            <button type="submit" disabled={submitting || !form.recipientEmail || !form.amount} className="btn btn--primary" style={{ width: '100%' }}>
              <Mail size={14} /> {submitting ? 'Sending…' : 'Send Gift'}
            </button>
          </form>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--bybit-text-muted)', marginTop: '16px', textAlign: 'center' }}>
          Funds are held in escrow until the recipient redeems the gift. You can cancel before redemption.
        </p>
      </div>
    </div>
  );
}
