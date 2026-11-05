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
    padding: 40px 0 60px;
  }
  .bv-container {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .bv-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
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
    padding: 18px 16px 18px 48px;
    background: #f9fafb;
    color: #111111;
    font-size: 28px;
    font-weight: 700;
    outline: none;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    transition: border-color 0.15s ease;
  }
  .bv-input-amount:focus {
    border-color: #f59e0b;
    background: #ffffff;
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
  @media (max-width: 480px) {
    .bv-input-amount {
      font-size: 22px;
      padding: 14px 14px 14px 40px;
    }
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
        <div className="bv-container" style={{ textAlign: 'center', maxWidth: '560px', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Clock size={32} color="#f59e0b" strokeWidth={2} />
          </div>
          <h1 style={{ marginBottom: '12px', color: '#111111', fontSize: '26px', fontWeight: '700' }}>Withdrawal Pending</h1>
          <p style={{ margin: '0 auto 32px', color: '#6b7280', lineHeight: 1.6, fontSize: '15px' }}>
            Your withdrawal request has been received. Standard settlement is 1-2 business days. 
            You will receive an email confirmation once the transfer is completed.
          </p>
          <Link to="/wallet" className="bv-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '14px 32px' }}>Return to Wallet</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bv-withdraw-page">
      <style dangerouslySetInnerHTML={{ __html: withdrawStyles }} />
      <div className="bv-container">
        
        <button onClick={() => nav('/wallet')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', padding: 0 }}>
          <ArrowLeft size={16} /> Back to Wallet
        </button>

        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Withdraw Funds</span>
          <h1 style={{ margin: '4px 0 8px', color: '#111111', fontSize: '26px', fontWeight: '700' }}>Move funds out</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
            Withdrawals are processed securely to your verified settlement account within 1-2 business days.
          </p>
        </div>

        <div className="bv-card">
          <label className="bv-form-label">Withdrawal Amount (Min. ₦1,000)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '22px', fontWeight: '700' }}>₦</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              className="bv-input-amount"
              style={{ borderColor: exceedsBalance ? '#ef4444' : undefined }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
            <button onClick={() => setAmount(String(Math.floor(wallet.balance)))} style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
              USE MAX BALANCE
            </button>
            <div style={{ fontSize: '13px', color: exceedsBalance ? '#ef4444' : '#6b7280' }}>
              Available: <span style={{ color: '#111111', fontWeight: '600' }}>{format(wallet.balance)}</span>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        {amountNum > 0 && (
          <div className="bv-card" style={{ fontSize: '14px', background: '#fdfbf7', borderColor: '#fde68a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#6b7280' }}>
              <span>Withdrawal Amount</span>
              <span style={{ color: '#111111', fontWeight: '500' }}>{format(amountNum)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#6b7280' }}>
              <span>Processing Fee (0.2%)</span>
              <span style={{ color: '#111111', fontWeight: '500' }}>{format(fee)}</span>
            </div>
            <div style={{ borderTop: '1px solid #fef3c7', marginTop: '10px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#92400e', fontWeight: '600' }}>You will receive</span>
              <span style={{ color: '#d97706', fontWeight: '700', fontSize: '18px' }}>{format(amountToReceive)}</span>
            </div>
          </div>
        )}

        {/* Settlement Account */}
        <div className="bv-card">
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', fontWeight: '500' }}>Settlement Account</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#111111' }}>GTBank</div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace', marginTop: '2px' }}>0123••••••</div>
            </div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Verified</span>
          </div>
        </div>

        {/* Confirmation & PIN */}
        <div className="bv-card">
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px', fontWeight: '500' }}>Authorize Withdrawal</div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#111111', lineHeight: 1.5 }}>
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: '3px', accentColor: '#f59e0b', width: '16px', height: '16px', cursor: 'pointer' }} />
            <span>
              I confirm the settlement account details are correct. Incorrect destination details may lead to delayed or lost funds.
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
                padding: '12px',
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#111111',
                fontSize: '22px',
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
            <AlertTriangle size={16} /> Amount exceeds your available wallet balance.
          </div>
        )}

        <button
          onClick={initiateWithdrawal}
          disabled={amountNum < 1000 || exceedsBalance || !confirmed || pin.length !== 4 || loading}
          className="bv-btn-primary"
        >
          {loading ? 'Processing…' : 'Request Withdrawal'}
        </button>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#6b7280', fontSize: '13px' }}>
          <ShieldCheck size={16} color="#d97706" /> Withdrawals are secured and verified against your KYC identity.
        </div>

      </div>
    </div>
  );
}
