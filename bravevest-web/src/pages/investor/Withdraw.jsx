import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

const withdrawStyles = `
  .bv-withdraw-page {
    background-color: #f8f9fa;
    color: #111111;
    min-height: calc(100vh - 64px);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 60px 0;
  }
  .bv-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .bv-form-label {
    display: block;
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
    font-weight: 500;
  }
  .bv-input-amount {
    width: 100%;
    padding: 20px 16px 20px 48px;
    background: #f9fafb;
    color: #111111;
    font-size: 32px;
    font-weight: 600;
    outline: none;
    border-radius: 8px;
  }
  .bv-btn-primary {
    background-color: #f59e0b;
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    padding: 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.15s ease;
  }
  .bv-btn-primary:hover:not(:disabled) {
    background-color: #d97706;
  }
  .bv-btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
      <div className="bv-withdraw-page">
        <style dangerouslySetInnerHTML={{ __html: withdrawStyles }} />
        <div className="container container--narrow" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Clock size={48} color="#f59e0b" strokeWidth={1.5} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '12px', color: '#111111', fontSize: '28px' }}>Withdrawal Pending</h1>
          <p style={{ margin: '0 auto 32px', color: '#6b7280', lineHeight: 1.6, fontSize: '15px' }}>
            Your withdrawal request has been received. Standard settlement is 1-2 business days. 
            You will receive an email when the transfer is complete.
          </p>
          <Link to="/wallet" className="bv-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '12px 32px' }}>Return to Wallet</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bv-withdraw-page">
      <style dangerouslySetInnerHTML={{ __html: withdrawStyles }} />
      <div className="container container--narrow" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
        
        <button onClick={() => nav('/wallet')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: 0 }}>
          <ArrowLeft size={16} /> Back to Wallet
        </button>

        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Withdraw Funds</span>
          <h1 style={{ marginBottom: '8px', color: '#111111', fontSize: '28px', fontWeight: '700' }}>Move funds out</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Withdrawals are processed to your verified settlement account within 1-2 business days.
          </p>
        </div>

        <div className="bv-card">
          <label className="bv-form-label">Withdrawal Amount (Min. ₦1,000)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '24px', fontWeight: '600' }}>₦</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              className="bv-input-amount"
              style={{ border: `1px solid ${exceedsBalance ? '#ef4444' : '#d1d5db'}` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
            <button onClick={() => setAmount(String(Math.floor(wallet.balance)))} style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '12px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
              USE MAX BALANCE
            </button>
            <div style={{ fontSize: '13px', color: exceedsBalance ? '#ef4444' : '#6b7280' }}>
              Available: <span style={{ color: '#111111', fontWeight: '600' }}>{format(wallet.balance)}</span>
            </div>
          </div>
        </div>

        {/* Fee breakdown */}
        {amountNum > 0 && (
          <div className="bv-card" style={{ fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#6b7280' }}>
              <span>Withdrawal Amount</span>
              <span style={{ color: '#111111' }}>{format(amountNum)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#6b7280' }}>
              <span>Processing Fee (0.2%)</span>
              <span style={{ color: '#111111' }}>{format(fee)}</span>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '8px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#d97706', fontWeight: '600' }}>You will receive</span>
              <span style={{ color: '#d97706', fontWeight: '700', fontSize: '18px' }}>{format(amountToReceive)}</span>
            </div>
          </div>
        )}

        {/* Settlement Account */}
        <div className="bv-card">
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', fontWeight: '500' }}>Settlement Account</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#111111' }}>GTBank</div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace', marginTop: '4px' }}>0123••••••</div>
            </div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Verified</span>
          </div>
        </div>

        {/* Confirmation & PIN */}
        <div className="bv-card">
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', fontWeight: '500' }}>Authorize Withdrawal</div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#111111', lineHeight: 1.5 }}>
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: '3px', accentColor: '#f59e0b', width: '16px', height: '16px' }} />
            <span>
              I confirm the settlement account details are correct. Incorrect details may result in lost funds.
            </span>
          </label>
          
          <div style={{ marginTop: '24px' }}>
            <label className="bv-form-label">Transaction PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              style={{
                width: '140px',
                padding: '14px',
                background: 'var(--bv-surface)',
                border: '1px solid #d1d5db',
                color: '#111111',
                fontSize: '24px',
                letterSpacing: '6px',
                textAlign: 'center',
                fontFamily: 'monospace',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {exceedsBalance && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px', background: '#fee2e2', padding: '12px 16px', borderRadius: '8px' }}>
            <AlertTriangle size={16} /> Amount exceeds available balance.
          </div>
        )}

        <button
          onClick={initiateWithdrawal}
          disabled={amountNum < 1000 || exceedsBalance || !confirmed || pin.length !== 4 || loading}
          className="bv-btn-primary"
        >
          {loading ? 'Processing…' : 'Request Withdrawal'}
        </button>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#6b7280', fontSize: '13px' }}>
          <ShieldCheck size={16} color="#d97706" /> Withdrawals are verified against your KYC identity.
        </div>

      </div>
    </div>
  );
}
