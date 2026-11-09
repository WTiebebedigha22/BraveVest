import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.wd { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B; --by-red:#D6334B;
  color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.wd * { box-sizing:border-box; }
.wd--page { background:var(--by-bg); min-height:60vh; padding:48px 20px 96px; }
.wd-inner { max-width:560px; }
.wd--page .wd-inner { margin:0 auto; }
.wd-title { font-size:24px; font-weight:800; letter-spacing:-0.03em; margin:0 0 20px; }
.wd--page .wd-title { font-size:clamp(28px,4vw,38px); }

.wd-hero { position:relative; overflow:hidden; background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; margin-bottom:16px; }
.wd-hero::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(320px 180px at 100% 0%, rgba(247,166,0,.22), transparent 70%); }
.wd-hero > * { position:relative; }
.wd-lbl { display:flex; align-items:center; gap:10px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:10px; }
.wd-ic { width:34px; height:34px; border-radius:8px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; }
.wd-big { font-size:clamp(32px,5vw,44px); font-weight:800; letter-spacing:-0.035em; line-height:1.1; font-variant-numeric:tabular-nums; }

.wd-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; }
.wd-field { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:20px; }
.wd-amt { display:flex; align-items:center; gap:8px; height:56px; padding:0 16px; background:#fff; border:1px solid var(--by-line); border-radius:10px; transition:border-color .15s; }
.wd-amt:focus-within { border-color:var(--by-yellow); }
.wd-amt span { font-size:22px; font-weight:700; color:var(--by-mute); }
.wd-amt input { flex:1; min-width:0; border:0; background:transparent; outline:none; font-family:inherit; font-size:26px; font-weight:800; letter-spacing:-0.02em; color:var(--by-text); font-variant-numeric:tabular-nums; -moz-appearance:textfield; }
.wd-amt input::-webkit-outer-spin-button, .wd-amt input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
.wd-amt input::placeholder { color:#B4B4BE; }
.wd-all { justify-self:start; background:none; border:0; padding:0; font-family:inherit; font-size:13px; font-weight:600; color:var(--by-amber); cursor:pointer; }
.wd-all:hover { text-decoration:underline; }
.wd-sel { width:100%; height:48px; padding:0 14px; background:#fff; border:1px solid var(--by-line); border-radius:8px; font-family:inherit; font-size:15px; color:var(--by-text); outline:none; transition:border-color .15s; }
.wd-sel:focus { border-color:var(--by-yellow); }
.wd-none { padding:14px; background:#fff; border:1px dashed var(--by-line); border-radius:8px; color:var(--by-mute); font-size:13px; font-weight:500; line-height:1.6; }
.wd-none a { color:var(--by-amber); font-weight:600; text-decoration:none; }
.wd-none a:hover { text-decoration:underline; }

.wd-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; height:50px; border:0; border-radius:8px; background:var(--by-yellow); color:#121214; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s; }
.wd-btn:hover:not(:disabled) { background:#FFB82E; }
.wd-btn:disabled { opacity:.6; cursor:not-allowed; }
.wd-btn:focus-visible, .wd-all:focus-visible, .wd-sel:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.wd-spin { animation:wd-spin 1s linear infinite; }
@keyframes wd-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .wd-spin { animation:none; } }

.wd-msg { display:flex; gap:8px; align-items:flex-start; padding:12px; border-radius:8px; font-size:13px; line-height:1.5; margin-bottom:20px; }
.wd-msg svg { flex:none; margin-top:1px; }
.wd-msg--err { background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); color:var(--by-red); }
.wd-msg--ok { background:rgba(14,159,91,.08); border:1px solid rgba(14,159,91,.2); color:var(--by-green); }
.wd-state { padding:64px 20px; display:flex; align-items:center; justify-content:center; gap:12px; color:var(--by-mute); }
@media (max-width:480px) { .wd-card, .wd-hero { padding:20px; } }
`;

// embedded: set when rendered inside the Wallet tabs (no PageShell, no page padding)
export default function Withdraw({ embedded = false }) {
  const { format } = useCurrency();
  const [balance, setBalance] = useState(0);
  const [banks, setBanks] = useState([]);
  const [form, setForm] = useState({ amount: '', bankId: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [w, b] = await Promise.all([
          apiFetch('/wallet'),
          apiFetch('/wallet/banks'),
        ]);
        if (!cancelled) {
          setBalance(w?.balance ?? 0);
          const bankList = Array.isArray(b) ? b : b?.banks ?? [];
          setBanks(bankList);
          if (bankList[0]?.id) {
            setForm((f) => ({ ...f, bankId: bankList[0].id }));
          }
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not load wallet.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');

    const amount = Number(form.amount);
    if (!amount || amount <= 0) return setErr('Enter a valid amount.');
    if (amount > balance) return setErr('Amount exceeds available balance.');
    if (!form.bankId) return setErr('Select a bank account.');

    setSubmitting(true);
    try {
      const data = await apiFetch('/wallet/withdraw', {
        method: 'POST',
        body: { amount, bankId: form.bankId },
      });
      // apiFetch already throws on non-2xx — no need to check data.message
      setBalance((b) => Math.max(0, b - amount));
      setForm((f) => ({ ...f, amount: '' }));
      setOk(
        data?.message ||
          `Withdrawal of ${format(amount)} initiated. Funds arrive within 1 business day.`
      );
    } catch (e) {
      setErr(e?.message || 'Withdrawal failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const wrap = (children) => {
    const body = (
      <div className={`wd${embedded ? '' : ' wd--page'}`}>
        <style>{CSS}</style>
        {children}
      </div>
    );
    return embedded ? body : <PortalLayout theme="dark">{body}</PortalLayout>;
  };

  if (loading) {
    return wrap(
      <div className='wd-state' role='status'>
        <Loader2 size={20} className='wd-spin' /> Loading…
      </div>
    );
  }

  const Title = embedded ? 'h2' : 'h1';
  const blocked = submitting || banks.length === 0;

  return wrap(
    <div className='wd-inner'>
      <Title className='wd-title'>Withdraw</Title>

      <section aria-label='Wallet balance' className='wd-hero'>
        <div className='wd-lbl'>
          <span className='wd-ic'><Wallet size={18} /></span> Available balance
        </div>
        <div className='wd-big'>{format(balance)}</div>
      </section>

      <form onSubmit={submit} className='wd-card'>
        {err && <div role='alert' className='wd-msg wd-msg--err'><AlertCircle size={16} /> {err}</div>}
        {ok && <div role='status' className='wd-msg wd-msg--ok'><CheckCircle size={16} /> {ok}</div>}

        <div className='wd-field'>
          <label htmlFor='wd-amount'>Amount (₦)</label>
          <div className='wd-amt'>
            <span>₦</span>
            <input
              id='wd-amount'
              type='number'
              inputMode='numeric'
              min='0'
              step='100'
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder='0.00'
              required
            />
          </div>
          <button
            type='button'
            className='wd-all'
            onClick={() => setForm({ ...form, amount: String(balance) })}
          >
            Withdraw all
          </button>
        </div>

        <div className='wd-field' style={{ marginBottom: 24 }}>
          <label htmlFor='wd-bank'>Destination bank account</label>
          {banks.length === 0 ? (
            <div className='wd-none'>
              No bank account linked. <Link to='/profile'>Add one</Link>
            </div>
          ) : (
            <select
              id='wd-bank'
              className='wd-sel'
              value={form.bankId}
              onChange={(e) => setForm({ ...form, bankId: e.target.value })}
              required
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} •••• {b.last4}
                </option>
              ))}
            </select>
          )}
        </div>

        <button type='submit' disabled={blocked} className='wd-btn'>
          {submitting && <Loader2 size={16} className='wd-spin' />}
          {submitting ? 'Processing…' : 'Withdraw'}
        </button>
      </form>
    </div>
  );
}