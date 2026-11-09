import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, CheckCircle, Loader2, User } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.tf { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B; --by-red:#D6334B;
  color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.tf * { box-sizing:border-box; }
.tf--page { background:var(--by-bg); min-height:60vh; padding:48px 20px 96px; }
.tf-inner { max-width:560px; }
.tf--page .tf-inner { margin:0 auto; }
.tf-title { font-size:24px; font-weight:800; letter-spacing:-0.03em; margin:0 0 6px; }
.tf--page .tf-title { font-size:clamp(28px,4vw,38px); }
.tf-sub { font-size:15px; color:var(--by-mute); margin:0 0 24px; line-height:1.6; }

.tf-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; }
.tf-field { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:20px; }
.tf-field > label, .tf-field > span { display:flex; align-items:center; gap:6px; }
.tf-in { width:100%; height:48px; padding:0 14px; background:#fff; border:1px solid var(--by-line); border-radius:8px; font-family:inherit; font-size:15px; color:var(--by-text); outline:none; transition:border-color .15s; }
.tf-in::placeholder { color:#B4B4BE; }
.tf-in:focus { border-color:var(--by-yellow); }
.tf-amt { display:flex; align-items:center; gap:8px; height:56px; padding:0 16px; background:#fff; border:1px solid var(--by-line); border-radius:10px; transition:border-color .15s; }
.tf-amt:focus-within { border-color:var(--by-yellow); }
.tf-amt span { font-size:22px; font-weight:700; color:var(--by-mute); }
.tf-amt input { flex:1; min-width:0; border:0; background:transparent; outline:none; font-family:inherit; font-size:26px; font-weight:800; letter-spacing:-0.02em; color:var(--by-text); font-variant-numeric:tabular-nums; -moz-appearance:textfield; }
.tf-amt input::-webkit-outer-spin-button, .tf-amt input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }

.tf-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; height:50px; margin-top:4px; border:0; border-radius:8px; background:var(--by-yellow); color:#121214; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s; }
.tf-btn:hover:not(:disabled) { background:#FFB82E; }
.tf-btn:disabled { opacity:.6; cursor:not-allowed; }
.tf-btn:focus-visible, .tf-in:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.tf-spin { animation:tf-spin 1s linear infinite; }
@keyframes tf-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .tf-spin { animation:none; } }

.tf-msg { display:flex; gap:8px; align-items:flex-start; padding:12px; border-radius:8px; font-size:13px; line-height:1.5; margin-bottom:20px; }
.tf-msg svg { flex:none; margin-top:1px; }
.tf-msg--err { background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); color:var(--by-red); }
.tf-msg--ok { background:rgba(14,159,91,.08); border:1px solid rgba(14,159,91,.2); color:var(--by-green); }
@media (max-width:480px) { .tf-card { padding:20px; } }
`;

// embedded: set when rendered inside the Wallet tabs (no PageShell, no page padding)
export default function Transfer({ embedded = false, embedded = false })) {
  const nav = useNavigate();
  const { format } = useCurrency();
  const [form, setForm] = useState({ recipient: '', amount: '', note: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!form.recipient.trim()) return setErr('Recipient required.');
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return setErr('Enter a valid amount.');
    setSubmitting(true);
    try {
      await apiFetch('/wallet/transfer', { method: 'POST', body: { recipient: form.recipient.trim(), amount: amt, note: form.note.trim() || undefined } });
      setOk('Transfer of ' + format(amt) + ' sent.');
      setForm({ recipient: '', amount: '', note: '' });
      setTimeout(() => nav('/wallet'), 1500);
    } catch (e) {
      setErr(e && e.message ? e.message : 'Could not complete transfer.');
    } finally { setSubmitting(false); }
  }

  const Title = embedded ? 'h2' : 'h1';

  const body = (
    <div className={`tf${embedded ? '' : ' tf--page'}`}>
      <style>{CSS}</style>
      <div className='tf-inner'>
        <Title className='tf-title'>Transfer funds</Title>
        <p className='tf-sub'>Send funds to another BraveVest investor.</p>

        <form onSubmit={submit} className='tf-card'>
          {err && <div role='alert' className='tf-msg tf-msg--err'><AlertCircle size={16} /> {err}</div>}
          {ok && <div role='status' className='tf-msg tf-msg--ok'><CheckCircle size={16} /> {ok}</div>}

          <div className='tf-field'>
            <label htmlFor='tf-recipient'><User size={14} /> Recipient</label>
            <input
              id='tf-recipient'
              className='tf-in'
              type='text'
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
              placeholder='investor@example.com'
              required
            />
          </div>

          <div className='tf-field'>
            <label htmlFor='tf-amount'>Amount (₦)</label>
            <div className='tf-amt'>
              <span>₦</span>
              <input
                id='tf-amount'
                type='number'
                inputMode='numeric'
                min='100'
                step='100'
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className='tf-field'>
            <label htmlFor='tf-note'>Note</label>
            <input
              id='tf-note'
              className='tf-in'
              type='text'
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <button type='submit' disabled={submitting} className='tf-btn'>
            {submitting ? <Loader2 size={16} className='tf-spin' /> : <Send size={16} />}
            {submitting ? 'Sending…' : 'Send funds'}
          </button>
        </form>
      </div>
    </div>
  );

  return embedded ? body : <PortalLayout theme="dark">{body}</PortalLayout>;
}