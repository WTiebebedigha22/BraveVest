import { useState } from 'react';
import { Copy, CheckCircle, AlertCircle, Loader2, Building2, CreditCard } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.dp { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:var(--text-main); --by-mute:var(--bv-text-muted); --by-yellow:var(--bv-accent); --by-amber:#C27C00; --by-green:var(--bv-success); --by-red:#D6334B;
  color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.dp * { box-sizing:border-box; }
.dp--page { background:var(--by-bg); min-height:60vh; padding:48px 20px 96px; }
.dp-inner { max-width:560px; }
.dp--page .dp-inner { margin:0 auto; }
.dp-title { font-size:24px; font-weight:800; letter-spacing:-0.03em; margin:0 0 20px; }
.dp--page .dp-title { font-size:clamp(28px,4vw,38px); }

.dp-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; margin-bottom:16px; }
.dp-h { font-size:15px; font-weight:700; margin:0 0 12px; }
.dp-lbl { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:12px; }
.dp-amt { display:flex; align-items:center; gap:8px; height:56px; padding:0 16px; background: var(--bv-bg-elevated); border:1px solid var(--by-line); border-radius:10px; transition:border-color .15s; }
.dp-amt:focus-within { border-color:var(--by-yellow); }
.dp-amt span { font-size:22px; font-weight:700; color:var(--by-mute); }
.dp-amt input { flex:1; min-width:0; border:0; background:transparent; outline:none; font-family:inherit; font-size:26px; font-weight:800; letter-spacing:-0.02em; color:var(--by-text); font-variant-numeric:tabular-nums; -moz-appearance:textfield; }
.dp-amt input::-webkit-outer-spin-button, .dp-amt input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
.dp-amt input::placeholder { color:#B4B4BE; }
.dp-chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px; }
.dp-chip { height:32px; padding:0 12px; border-radius:6px; border:1px solid var(--by-line); background: var(--bv-bg-elevated); font-family:inherit; font-size:13px; font-weight:600; color:var(--by-text); cursor:pointer; }
.dp-chip:hover { border-color:var(--by-yellow); background:rgba(247,166,0,.12); }

.dp-methods { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
.dp-method { display:flex; flex-direction:column; gap:4px; text-align:left; padding:16px 14px; background: var(--bv-bg-elevated); border:1px solid var(--by-line); border-radius:12px; cursor:pointer; font-family:inherit; transition:border-color .15s, background .15s; }
.dp-method:hover { border-color:var(--by-yellow); }
.dp-method[aria-checked='true'] { border-color:var(--by-yellow); background:rgba(247,166,0,.1); box-shadow:inset 0 0 0 1px var(--by-yellow); }
.dp-method b { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:var(--by-text); }
.dp-method b svg { color:var(--by-mute); }
.dp-method[aria-checked='true'] b svg { color:var(--by-amber); }
.dp-method span { font-size:12px; color:var(--by-mute); }

.dp-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; height:50px; border:0; border-radius:8px; background:var(--by-yellow); color: var(--bv-text); font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s; }
.dp-btn:hover:not(:disabled) { background:#FFB82E; }
.dp-btn:disabled { opacity:.6; cursor:not-allowed; }
.dp-btn:focus-visible, .dp-method:focus-visible, .dp-copy:focus-visible, .dp-chip:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.dp-spin { animation:dp-spin 1s linear infinite; }
@keyframes dp-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .dp-spin { animation:none; } }

.dp-msg { display:flex; gap:8px; align-items:flex-start; padding:12px; border-radius:8px; font-size:13px; line-height:1.5; margin-bottom:20px; }
.dp-msg svg { flex:none; margin-top:1px; }
.dp-msg--err { background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); color:var(--by-red); }
.dp-msg--ok { background:rgba(14,159,91,.08); border:1px solid rgba(14,159,91,.2); color:var(--by-green); }

.dp-row { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:14px 0; border-top:1px solid var(--by-line); }
.dp-row small { display:block; font-size:12px; color:var(--by-mute); margin-bottom:2px; }
.dp-row b { font-size:15px; font-weight:700; font-variant-numeric:tabular-nums; word-break:break-word; }
.dp-copy { display:inline-flex; align-items:center; gap:6px; flex:none; height:34px; padding:0 12px; background: var(--bv-bg-elevated); border:1px solid var(--by-line); border-radius:6px; font-family:inherit; font-size:13px; font-weight:600; color:var(--by-text); cursor:pointer; transition:border-color .15s, color .15s; }
.dp-copy:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.dp-copy.done { color:var(--by-green); border-color:var(--by-green); }
.dp-note { margin:12px 0 0; font-size:12px; color:var(--by-mute); line-height:1.6; }
@media (max-width:480px) { .dp-card { padding:20px; } .dp-methods { grid-template-columns:1fr; } }
`;

const METHODS = [
  { id: 'bank', label: 'Bank transfer', desc: 'Free · Instant', icon: Building2 },
  { id: 'card', label: 'Card', desc: '1.5% fee · instant', icon: CreditCard },
];
const QUICK = [5000, 50000, 250000];

// embedded: set when rendered inside the Wallet tabs (no PageShell, no page padding)
export default function Deposit({ embedded = false }) {
  const { format } = useCurrency();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [copied, setCopied] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const account = {
    bankName: 'Providus Bank',
    accountName: 'BRAVEVEST / YOUR NAME',
    accountNumber: '9901234567',
  };

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setErr('Could not copy — please copy manually.');
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');

    const amt = Number(amount);
    if (!amt || amt < 1000) {
      return setErr('Minimum deposit is ₦1,000.');
    }

    if (method === 'card') {
      setSubmitting(true);
      try {
        const data = await apiFetch('/payments/initialize', {
          method: 'POST',
          body: { amount: amt },
        });
        if (data?.authorizationUrl) {
          window.location.href = data.authorizationUrl;
        } else {
          throw new Error('Payment URL missing from response.');
        }
      } catch (e) {
        setErr(e?.message || 'Could not start payment.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setOk(`Send ${format(amt)} to the account below. Deposits reflect in your wallet immediately.`);
    }
  }

  const Title = embedded ? 'h2' : 'h1';

  const body = (
    <div className={`dp${embedded ? '' : ' dp--page'}`}>
      <style>{CSS}</style>
      <div className='dp-inner'>
        <Title className='dp-title'>Deposit</Title>

        <form onSubmit={submit} className='dp-card'>
          {err && <div role='alert' className='dp-msg dp-msg--err'><AlertCircle size={16} /> {err}</div>}
          {ok && <div role='status' className='dp-msg dp-msg--ok'><CheckCircle size={16} /> {ok}</div>}

          <h3 className='dp-h'>Amount</h3>
          <label className='dp-lbl' htmlFor='dp-amount'>
            How much would you like to deposit? (₦)
            <div className='dp-amt'>
              <span>₦</span>
              <input
                id='dp-amount'
                type='number'
                inputMode='numeric'
                min='1000'
                step='500'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='5000'
                required
              />
            </div>
          </label>
          <div className='dp-chips'>
            {QUICK.map((q) => (
              <button key={q} type='button' className='dp-chip' onClick={() => setAmount(String(q))}>
                ₦{q.toLocaleString('en-NG')}
              </button>
            ))}
          </div>

          <h3 className='dp-h'>Payment method</h3>
          <div role='radiogroup' aria-label='Payment method' className='dp-methods'>
            {METHODS.map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                type='button'
                role='radio'
                aria-checked={method === id}
                className='dp-method'
                onClick={() => setMethod(id)}
              >
                <b><Icon size={16} /> {label}</b>
                <span>{desc}</span>
              </button>
            ))}
          </div>

          <button type='submit' disabled={submitting} className='dp-btn'>
            {submitting && <Loader2 size={16} className='dp-spin' />}
            {submitting ? 'Processing…' : method === 'card' ? 'Continue to payment' : 'Show bank details'}
          </button>
        </form>

        {method === 'bank' && ok && (
          <section aria-label='Bank transfer details' className='dp-card'>
            <h3 className='dp-h' style={{ marginBottom: 4 }}>Bank transfer details</h3>
            {[
              { label: 'Bank', value: account.bankName, key: 'bank' },
              { label: 'Account name', value: account.accountName, key: 'name' },
              { label: 'Account number', value: account.accountNumber, key: 'number' },
            ].map(({ label, value, key }) => (
              <div key={key} className='dp-row'>
                <div>
                  <small>{label}</small>
                  <b>{value}</b>
                </div>
                <button
                  type='button'
                  onClick={() => copy(value, key)}
                  aria-label={`Copy ${label.toLowerCase()}`}
                  className={`dp-copy${copied === key ? ' done' : ''}`}
                >
                  {copied === key ? <><CheckCircle size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            ))}
            <p className='dp-note'>
              Use the account number exactly as shown. Deposits from a different account may be delayed.
            </p>
          </section>
        )}
      </div>
    </div>
  );

  return embedded ? body : <PortalLayout theme="dark">{body}</PortalLayout>;
}