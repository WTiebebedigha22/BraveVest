import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { api } from '@/api/client';
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
  clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

const ICON_MAP = {
  'credit-card': Icons.card,
  'repeat': Icons.transfer,
  'smartphone': Icons.smartphone,
};

export default function Withdraw() {
  const navigate = useNavigate();
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      await api.post('/api/payments/withdraw', { amount: amountNum, method });
      setSuccess(true);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to request withdrawal');
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="pay-page">
        <div className="pay-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 20px', borderRadius: 32, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b5e20' }}>
            <Icons.clock />
          </div>
          <h2 className="pay-title" style={{ fontSize: 24 }}>Withdrawal requested</h2>
          <p className="pay-sub" style={{ marginBottom: 28 }}>
            Funds will settle in 1–2 business days. You'll receive an email once processed.
          </p>
          <button className="pay-cta" onClick={() => navigate('/wallet')}>
            Back to wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <Link to="/wallet" className="pay-back">
        <Icons.arrowLeft /> Back to wallet
      </Link>

      <h1 className="pay-title">Withdraw</h1>
      <p className="pay-sub">
        Move wallet funds to a bank account or card. Minimum ${MIN_DEPOSIT_USD} equivalent.
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
        </div>

        <div className="pay-card">
          <label className="pay-label">Withdrawal method</label>
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
          {busy ? 'Requesting…' : 'Request withdrawal'}
        </button>

        <div className="pay-note">
          <Icons.clock />
          <span>
            Withdrawals settle in 1–2 business days. A small processing fee may apply.
          </span>
        </div>
      </form>
    </div>
  );
}
