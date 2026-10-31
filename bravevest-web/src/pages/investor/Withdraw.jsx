import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

export default function Withdraw() {
  const nav = useNavigate();
  const { format } = useCurrency();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [wallet, setWallet] = useState({ balance: 0 });
  
  // Withdrawal safety states
  const [confirmed, setConfirmed] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    api.get('/api/wallet').then(r => {
      setWallet(r.data?.data || r.data || { balance: 0 });
    }).catch(() => {});
  }, []);

  const amountNum = Number(amount) || 0;
  const fee = amountNum * 0.002; // 0.2% withdrawal fee
  const amountToReceive = amountNum - fee;
  const exceedsBalance = amountNum > wallet.balance;

  async function initiateWithdrawal() {
    if (amountNum < 1000 || exceedsBalance || !confirmed || pin.length !== 4) {
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/payments/withdraw', {
        amount: amountNum,
        pin,
      });
      setSuccess(true);
    } catch (e) {
      alert('Withdrawal failed. Check your PIN and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ padding: '80px 0' }}>
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <Clock size={48} color="var(--gold)" strokeWidth={1.5} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '12px' }}>Withdrawal Pending</h1>
          <p className="lede" style={{ margin: '0 auto 32px' }}>
            Your withdrawal request has been received. Standard settlement is 1-2 business days. 
            You will receive an email when the transfer is complete.
          </p>
          <Link to="/wallet" className="btn btn--primary">Return to Wallet</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container container--narrow">
        <button onClick={() => nav('/wallet')} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Wallet
        </button>

        <div style={{ marginBottom: '48px' }}>
          <span className="eyebrow">Withdraw Funds</span>
          <h1 style={{ marginBottom: '12px' }}>Move funds out</h1>
          <p className="lede" style={{ margin: 0 }}>
            Withdrawals are processed to your verified settlement account within 1-2 business days.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <label className="form-label">Withdrawal Amount</label>
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
                border: `1px solid ${exceedsBalance ? 'var(--danger)' : 'var(--line)'}`,
                color: 'var(--ivory)',
                fontSize: '32px',
                fontFamily: 'var(--font-serif)',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <button onClick={() => setAmount(String(Math.floor(wallet.balance)))} className="btn btn--ghost" style={{ fontSize: '11px', padding: 0 }}>
              USE MAX BALANCE
            </button>
            <div style={{ fontSize: '12px', color: exceedsBalance ? 'var(--danger)' : 'var(--slate)' }}>
              Available: {format(wallet.balance)}
            </div>
          </div>
        </div>

        {/* Fee breakdown */}
        {amountNum > 0 && (
          <div className="card" style={{ marginBottom: '24px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--slate)' }}>
              <span>Withdrawal Amount</span>
              <span style={{ color: 'var(--ivory)' }}>{format(amountNum)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--slate)' }}>
              <span>Processing Fee (0.2%)</span>
              <span style={{ color: 'var(--ivory)' }}>{format(fee)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', marginTop: '8px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gold)', fontWeight: '500' }}>You will receive</span>
              <span style={{ color: 'var(--gold)', fontWeight: '500', fontFamily: 'var(--font-serif)', fontSize: '18px' }}>{format(amountToReceive)}</span>
            </div>
          </div>
        )}

        {/* Settlement Account */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="data-label" style={{ marginBottom: '12px' }}>Settlement Account</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', color: 'var(--ivory)' }}>GTBank</div>
              <div style={{ fontSize: '12px', color: 'var(--slate)', fontFamily: 'monospace', marginTop: '4px' }}>0123••••••</div>
            </div>
            <span className="pill pill--gold">Verified</span>
          </div>
        </div>

        {/* Confirmation & PIN */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="data-label" style={{ marginBottom: '16px' }}>Authorize Withdrawal</div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--slate)' }}>
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: '4px', accentColor: 'var(--gold)' }} />
            <span>
              I confirm the settlement account details are correct. Incorrect details may result in lost funds.
            </span>
          </label>
          
          <div style={{ marginTop: '20px' }}>
            <label className="form-label">Transaction PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              style={{
                width: '120px',
                padding: '16px',
                background: 'var(--navy-950)',
                border: '1px solid var(--line)',
                color: 'var(--ivory)',
                fontSize: '24px',
                letterSpacing: '8px',
                textAlign: 'center',
                fontFamily: 'monospace',
              }}
            />
          </div>
        </div>

        {exceedsBalance && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>
            <AlertTriangle size={16} /> Amount exceeds available balance.
          </div>
        )}

        <button
          onClick={initiateWithdrawal}
          disabled={amountNum < 1000 || exceedsBalance || !confirmed || pin.length !== 4 || loading}
          className="btn btn--primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Processing…' : 'Request Withdrawal'}
        </button>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--slate)', fontSize: '12px' }}>
          <ShieldCheck size={14} /> Withdrawals are verified against your KYC identity.
        </div>
      </div>
    </div>
  );
}
