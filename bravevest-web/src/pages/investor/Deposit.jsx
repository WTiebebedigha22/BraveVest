import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

export default function Deposit() {
  const nav = useNavigate();
  const { format } = useCurrency();
  const [step, setStep] = useState(1); // 1 = Amount, 2 = Bank Transfer, 3 = Success
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const amountNum = Number(amount) || 0;
  const fee = amountNum * 0.001; // 0.1% deposit fee example
  const netAmount = amountNum - fee;

  async function initiateDeposit() {
    if (amountNum < 1000) return;
    setLoading(true);
    try {
      // In a real P2P platform, this returns a virtual account or a specific
      // payment URL. We mock the response here.
      const res = await api.post('/api/payments/initialize', {
        amount: amountNum,
        method,
        purpose: 'wallet_deposit',
      }).catch(() => ({
        data: {
          reference: 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          virtualAccount: {
            bank: 'Providus Bank',
            accountName: 'BraveVest Clearing',
            accountNumber: '990' + Math.floor(1000000 + Math.random() * 9000000),
          },
          expiresInMinutes: 30,
        }
      }));

      const orderData = res?.data?.data || res?.data || res;
      setOrder(orderData);
      setStep(2);
    } catch (e) {
      alert('Failed to initiate deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  }

  // ── STEP 3: SUCCESS ──
  if (step === 3) {
    return (
      <div style={{ padding: '80px 0' }}>
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--success)" strokeWidth={1.5} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '12px' }}>Deposit Initiated</h1>
          <p className="lede" style={{ margin: '0 auto 32px' }}>
            Your deposit is being processed. Funds will be credited to your wallet once the bank transfer is confirmed.
          </p>
          <div className="card" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <div className="data-label">Reference Number</div>
            <div style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--gold)', marginTop: '8px' }}>{order?.reference}</div>
          </div>
          <Link to="/wallet" className="btn btn--primary">Go to Wallet</Link>
        </div>
      </div>
    );
  }

  // ── STEP 2: BANK TRANSFER INSTRUCTIONS ──
  if (step === 2 && order) {
    return (
      <div style={{ padding: '80px 0' }}>
        <div className="container container--narrow">
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Complete Your Payment</span>
            <h1 style={{ marginBottom: '12px' }}>Transfer exactly {format(amountNum)}</h1>
            <p className="lede" style={{ margin: '0 auto' }}>
              Send the exact amount to the account below. This account is reserved for your transaction only.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '24px', borderLeft: '2px solid var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div className="data-label">Bank</div>
                <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', marginTop: '6px' }}>{order?.virtualAccount?.bank}</div>
              </div>
              <div>
                <div className="data-label">Account Name</div>
                <div style={{ fontSize: '16px', marginTop: '6px' }}>{order?.virtualAccount?.accountName}</div>
              </div>
            </div>
            
            <div style={{ background: 'var(--navy-950)', padding: '24px', textAlign: 'center', marginTop: '16px' }}>
              <div className="data-label" style={{ marginBottom: '8px' }}>Account Number</div>
              <div style={{ fontFamily: 'monospace', fontSize: '32px', color: 'var(--ivory)', letterSpacing: '4px' }}>
                {order?.virtualAccount?.accountNumber}
              </div>
              <button onClick={() => copyToClipboard(order?.virtualAccount?.accountNumber)} className="btn btn--ghost" style={{ marginTop: '12px', fontSize: '11px' }}>
                <Copy size={12} /> Copy Number
              </button>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--navy-800)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--gold)' }}>
              <Clock size={18} />
              <span style={{ fontSize: '13px' }}>This account expires in {order?.expiresInMinutes} minutes</span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--slate)', textAlign: 'center', marginTop: '32px' }}>
            Do not send funds from a different account. Doing so may result in a delayed or rejected deposit.
          </p>

          <button onClick={() => setStep(3)} className="btn btn--primary" style={{ width: '100%', marginTop: '24px' }}>
            I have sent the funds
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 1: AMOUNT ENTRY ──
  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container container--narrow">
        <button onClick={() => nav('/wallet')} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Wallet
        </button>

        <div style={{ marginBottom: '48px' }}>
          <span className="eyebrow">Deposit Funds</span>
          <h1 style={{ marginBottom: '12px' }}>Add to your wallet</h1>
          <p className="lede" style={{ margin: 0 }}>
            Deposits are processed via bank transfer. Funds are credited once the transaction clears.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <label className="form-label">Amount</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)', fontSize: '20px', fontFamily: 'var(--font-serif)' }}>₦</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              style={{
                width: '100%',
                padding: '20px 16px 20px 48px',
                background: 'var(--navy-950)',
                border: '1px solid var(--line)',
                color: 'var(--ivory)',
                fontSize: '32px',
                fontFamily: 'var(--font-serif)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[5000, 10000, 25000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="pill"
                style={{ cursor: 'pointer', background: 'transparent' }}
              >
                {format(v)}
              </button>
            ))}
          </div>
        </div>

        {amountNum > 0 && (
          <div className="card" style={{ marginBottom: '24px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--slate)' }}>
              <span>Deposit Amount</span>
              <span style={{ color: 'var(--ivory)' }}>{format(amountNum)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--slate)' }}>
              <span>Processing Fee (0.1%)</span>
              <span style={{ color: 'var(--ivory)' }}>{format(fee)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', marginTop: '8px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gold)', fontWeight: '500' }}>Credited to Wallet</span>
              <span style={{ color: 'var(--gold)', fontWeight: '500', fontFamily: 'var(--font-serif)', fontSize: '18px' }}>{format(netAmount)}</span>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ marginBottom: '16px' }}>Payment Method</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '12px 0' }}>
            <input type="radio" checked={method === 'bank_transfer'} onChange={() => setMethod('bank_transfer')} style={{ width: 'auto', accentColor: 'var(--gold)' }} />
            <div>
              <div style={{ fontSize: '15px', color: 'var(--ivory)' }}>Bank Transfer</div>
              <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>Instant transfer to a dedicated virtual account</div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '12px 0', opacity: 0.5 }}>
            <input type="radio" disabled style={{ width: 'auto' }} />
            <div>
              <div style={{ fontSize: '15px', color: 'var(--slate)' }}>Card Payment</div>
              <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>Coming soon</div>
            </div>
          </label>
        </div>

        <button
          onClick={initiateDeposit}
          disabled={amountNum < 1000 || loading}
          className="btn btn--primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Initializing…' : `Deposit ${amountNum ? format(amountNum) : ''}`}
        </button>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--slate)', fontSize: '12px' }}>
          <ShieldCheck size={14} /> Secured by BraveVest. Funds held by regulated banking partners.
        </div>
      </div>
    </div>
  );
}
