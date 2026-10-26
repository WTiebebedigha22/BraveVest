import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { paymentsApi } from '@/api/payments';
import { MIN_DEPOSIT_USD, USD_RATES, PAYMENT_METHODS } from '@/constants/payments';
import './Payments.css';

const Icons = {
  arrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  card: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  transfer: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  smartphone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const ICON_MAP = {
  'credit-card': Icons.card,
  'repeat': Icons.transfer,
  'smartphone': Icons.smartphone,
};

export default function Deposit() {
  const navigate = useNavigate();
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const amountNum = Number(amount) || 0;
  const usdEq = amountNum * (USD_RATES[currency] ?? 1);
  const minLocal = Math.round(MIN_DEPOSIT_USD / (USD_RATES[currency] ?? 1));
  const belowMin = amountNum > 0 && usdEq < MIN_DEPOSIT_USD;

  async function submit(e) {
    e.preventDefault();
    if (!amountNum || belowMin) {
      setError(`Minimum ${'$'}${MIN_DEPOSIT_USD} equivalent (${format(minLocal)}).`);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const result = await paymentsApi.initialize({
        amount: amountNum,
        method,
        purpose: 'wallet_deposit',
      });
      const url = result?.data?.authorization_url || result?.authorization_url;
      if (url) {
        window.location.href = url;
      } else {
        setError('Could not start payment. Try again.');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to start deposit');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pay-page">
      <Link to="/wallet" className="pay-back">
        <Icons.arrowLeft /> Back to wallet
      </Link>

      <h1 className="pay-title">Deposit</h1>
      <p className="pay-sub">
        Add funds to your BraveVest wallet. Minimum ${MIN_DEPOSIT_USD} equivalent per deposit.
      </p>

      <form onSubmit={submit}>
        <div className="pay-card">
          <label className="pay-label" htmlFor="amount">Amount</label>
          <div className={`pay-input-wrap${belowMin ? ' is-error' : ''}`}>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              className="pay-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              autoComplete="off"
            />
            <span className="pay-currency">{currency}</span>
          </div>
          {belowMin ? (
            <div className="pay-error">
              Minimum ${MIN_DEPOSIT_USD} equivalent ({format(minLocal)})
            </div>
          ) : (
            <div className="pay-hint">Minimum {format(minLocal)}</div>
          )}

          <div className="pay-quick">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                className="pay-chip"
                onClick={() => setAmount(String(q))}
              >
                {format(q)}
              </button>
            ))}
          </div>
        </div>

        <div className="pay-card">
          <label className="pay-label">Payment method</label>
          <div className="pay-method-list">
            {PAYMENT_METHODS.map((m) => {
              const Icon = ICON_MAP[m.icon] || Icons.card;
              const selected = method === m.id;
              return (
                <div
                  key={m.id}
                  className={`pay-method${selected ? ' is-selected' : ''}${!m.enabled ? ' is-disabled' : ''}`}
                  onClick={() => m.enabled && setMethod(m.id)}
                >
                  <div className="pay-method__icon">
                    <Icon />
                  </div>
                  <div className="pay-method__info">
                    <div className="pay-method__title">
                      {m.label}
                      {m.note && <span className="pay-method__badge">{m.note}</span>}
                    </div>
                    <div className="pay-method__sub">{m.sub}</div>
                  </div>
                  <div className="pay-method__radio" />
                </div>
              );
            })}
          </div>
        </div>

        {error && <div className="pay-error" style={{ marginBottom: 16 }}>{error}</div>}

        <button type="submit" className="pay-cta" disabled={!amountNum || belowMin || busy}>
          {busy ? 'Starting…' : `Deposit ${amountNum ? format(amountNum) : ''}`}
        </button>

        <div className="pay-note">
          <Icons.shield />
          <span>
            Payments are processed securely by Paystack. Funds land in your wallet within seconds.
          </span>
        </div>
      </form>
    </div>
  );
}
