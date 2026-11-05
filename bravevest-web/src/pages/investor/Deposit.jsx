import { useState } from 'react';
import { ChevronDown, Calendar, ShieldCheck, TrendingUp, ArrowRight, CheckCircle2, Clock, ArrowDownLeft } from 'lucide-react';

const depositStyles = `
  .bv-deposit-page {
    background-color: #f8f9fa;
    color: #111111;
    min-height: calc(100vh - 64px);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding-bottom: 60px;
  }

  .bv-deposit-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px 0;
  }

  .bv-wallet-tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    gap: 8px;
    overflow-x: auto;
  }

  .bv-wallet-tab {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .bv-wallet-tab:hover {
    color: #111111;
  }

  .bv-wallet-tab.active {
    color: #d97706;
    border-bottom-color: #d97706;
    font-weight: 600;
  }

  .bv-deposit-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 40px;
    margin-top: 32px;
  }

  @media (max-width: 900px) {
    .bv-deposit-grid {
      grid-template-columns: 1fr;
    }
  }

  .bv-fund-banner {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 16px;
    padding: 28px;
    position: relative;
    overflow: hidden;
  }

  .bv-input-group {
    display: flex;
    background: #f9fafb;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #d1d5db;
    transition: border-color 0.15s ease;
  }

  .bv-input-group:focus-within {
    border-color: #f59e0b;
  }

  .bv-input-field {
    flex: 1;
    border: none;
    background: transparent;
    padding: 16px;
    font-size: 16px;
    color: #111111;
    outline: none;
    width: 100%;
  }

  .bv-input-field::placeholder {
    color: #9ca3af;
  }

  .bv-currency-select {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    background: #ffffff;
    border-left: 1px solid #d1d5db;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #111111;
  }

  .bv-tx-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    transition: border-color 0.15s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }

  .bv-tx-card:hover {
    border-color: #d1d5db;
  }
`;

// Mock recent transactions data
const RECENT_DEPOSITS = [
  { id: 'TXN-948201', amount: '₦150,000', method: 'Paystack Instant', date: '2026-10-28 14:32', status: 'Completed' },
  { id: 'TXN-883920', amount: '₦50,000', method: 'Flutterwave', date: '2026-10-15 09:12', status: 'Completed' },
  { id: 'TXN-772109', amount: '₦500,000', method: 'Bank Transfer', date: '2026-09-30 18:45', status: 'Completed' },
  { id: 'TXN-661294', amount: '₦25,000', method: 'Paystack Instant', date: '2026-09-12 11:04', status: 'Processing' },
];

export default function Deposit() {
  const [activeTab, setActiveTab] = useState('Fund Wallet');
  const [fundAmount, setFundAmount] = useState('');

  return (
    <div className="bv-deposit-page">
      <style dangerouslySetInnerHTML={{ __html: depositStyles }} />

      <div className="bv-deposit-container">
        
        {/* Navigation Tabs Switcher */}
        <div className="bv-wallet-tabs">
          {['Fund Wallet', 'General Investment Deposit', 'Bank Transfer', 'Transaction History'].map((tab) => (
            <div
              key={tab}
              className={`bv-wallet-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', fontSize: '13px', color: '#6b7280', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }}>Portfolio Overview ↗</span>
          </div>
        </div>

        {/* Conditional View: Transaction History vs Deposit Form */}
        {activeTab === 'Transaction History' ? (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111111' }}>Recent Deposit History</h2>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Showing latest records</span>
            </div>

            <div>
              {RECENT_DEPOSITS.map((tx) => (
                <div key={tx.id} className="bv-tx-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                      <ArrowDownLeft size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#111111' }}>Deposit via {tx.method}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{tx.id} • {tx.date}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>+{tx.amount}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: tx.status === 'Completed' ? '#059669' : '#d97706', marginTop: '2px' }}>
                      {tx.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bv-deposit-grid">
            
            {/* Left Column: Platform Overview & Value Proposition */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
                <TrendingUp size={14} /> Verified Investment Opportunities
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', color: '#111111' }}>
                Fund Your Account & Grow Your Wealth
              </h1>
              <p style={{ color: '#6b7280', marginBottom: '32px', lineHeight: 1.6, fontSize: '14px' }}>
                Deposit funds securely to back diverse, verified marketplace assets, scale high-yield projects, and track your capital growth in real-time.
              </p>

              {/* Feature Highlight Banner */}
              <div className="bv-fund-banner">
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#d97706" /> Secure Capital Allocation
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', maxWidth: '85%', lineHeight: 1.5 }}>
                  All deposited balances allocated toward platform opportunities undergo rigorous risk assessment and milestone monitoring.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    Explore Active Market Deals <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Deposit Form */}
            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
              
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '16px', color: '#111111' }}>
                {activeTab} (NGN)
              </div>

              <div style={{ padding: '28px 24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                    Deposit Amount
                  </label>
                  <div className="bv-input-group">
                    <input
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="Min. 5,000 NGN"
                      className="bv-input-field"
                    />
                    <div className="bv-currency-select">
                      <div style={{ width: '20px', height: '20px', background: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}>
                        ₦
                      </div>
                      <span>NGN</span>
                      <ChevronDown size={14} color="#6b7280" />
                    </div>
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                  {['10,000', '50,000', '250,000'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setFundAmount(amt)}
                      style={{ background: '#ffffff', border: '1px solid #d1d5db', color: '#111111', padding: '8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      ₦{amt}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#111111', fontWeight: '600', marginBottom: '10px' }}>
                    Payment Gateway
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', background: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '28px', height: '28px', background: '#d97706', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '10px', fontWeight: '800' }}>
                        Pay
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111111' }}>
                        Paystack / Flutterwave Instant Deposit
                      </span>
                    </div>
                    <ChevronDown size={16} color="#6b7280" />
                  </div>
                </div>

                <button
                  disabled={!fundAmount}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    cursor: fundAmount ? 'pointer' : 'not-allowed',
                    opacity: fundAmount ? 1 : 0.5,
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  Proceed to Deposit
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
                    <Calendar size={14} /> Automated Payouts enabled on active portfolios
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
