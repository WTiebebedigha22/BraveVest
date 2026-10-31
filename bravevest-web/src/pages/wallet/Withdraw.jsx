import { useState } from 'react';
import { ChevronDown, Copy, ArrowRight } from 'lucide-react';

export default function Withdraw() {
  const [method, setMethod] = useState('Internal Transfer');

  return (
    <div className="wallet-page">
      <div className="container" style={{ paddingTop: '32px', maxWidth: '1200px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#111' }}>Withdraw</h1>
          <button style={{ background: '#EAEAEA', border: 'none', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#111' }}>
            <span style={{ fontSize: '16px' }}>⚡</span> Fiat Withdraw
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* Left Form */}
          <div className="wallet-card">
            <div className="form-row">
              <label style={{ width: '140px', color: '#888', fontSize: '14px' }}>Select Coin</label>
              <div style={{ flex: 1 }}>
                <div className="input-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#F9F9F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>₿</div>
                    <span style={{ fontWeight: '600' }}>BTC</span> <span style={{ color: '#888', fontSize: '12px' }}>Bitcoin</span>
                  </div>
                  <ChevronDown size={16} color="#888" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <label style={{ width: '140px', color: '#888', fontSize: '14px' }}>Withdraw to</label>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #EAEAEA', width: '100%' }}>
                  <div onClick={() => setMethod('On-chain')} style={{ padding: '0 16px 12px', fontSize: '14px', color: method === 'On-chain' ? '#111' : '#666', fontWeight: method === 'On-chain' ? '600' : '400', borderBottom: method === 'On-chain' ? '2px solid #F6A500' : '2px solid transparent', cursor: 'pointer' }}>On-chain Withdrawal</div>
                  <div onClick={() => setMethod('Internal Transfer')} style={{ padding: '0 16px 12px', fontSize: '14px', color: method === 'Internal Transfer' ? '#111' : '#666', fontWeight: method === 'Internal Transfer' ? '600' : '400', borderBottom: method === 'Internal Transfer' ? '2px solid #F6A500' : '2px solid transparent', cursor: 'pointer' }}>Internal Transfer</div>
                </div>
              </div>
            </div>

            <div className="form-row" style={{ alignItems: 'flex-start' }}>
              <label style={{ width: '140px', color: '#888', fontSize: '14px', paddingTop: '12px' }}>Recipient Account</label>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {['Email Address', 'Mobile Number', 'UID'].map((t, i) => (
                    <button key={t} style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', border: 'none', background: i === 0 ? 'rgba(246,165,0,0.1)' : '#F5F5F5', color: i === 0 ? '#F6A500' : '#666', cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
                <div className="input-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9F9F9' }}>
                  <input type="text" placeholder="Please enter" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px' }} />
                  <Copy size={16} color="#888" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <label style={{ width: '140px', color: '#888', fontSize: '14px' }}>Withdrawable Amount</label>
              <div style={{ flex: 1 }}>
                <div className="input-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9F9F9' }}>
                  <input type="text" placeholder="Minimum: 0.0005" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px' }} />
                  <span style={{ fontSize: '14px', color: '#F6A500', fontWeight: '600', cursor: 'pointer' }}>All</span>
                </div>
              </div>
            </div>

            <div style={{ marginLeft: '140px', background: '#F9F9F9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#666' }}>
                <span>Select account (1) ▲</span>
                <span>0 ⇄</span>
              </div>
             // (Continuing the Withdraw.jsx template string from Section 6)
              {[
                { name: 'Funding', checked: true, bal: '0' },
                { name: 'Unified Trading', checked: false, bal: '0' },
                { name: 'Flexible Easy Earn', checked: false, bal: '0' }
              ].map(acc => (
                <div key={acc.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#111' }}>
                    <input type="checkbox" defaultChecked={acc.checked} style={{ width: '16px', height: '16px', accentColor: '#F6A500' }} />
                    {acc.name}
                  </label>
                  <span style={{ fontWeight: '500', color: '#111' }}>{acc.bal}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '140px', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA', marginBottom: '24px', fontSize: '14px', color: '#666' }}>
              <span>Transaction Fee</span>
              <span style={{ fontWeight: '500', color: '#111' }}>0 BTC</span>
            </div>

            <div className="form-row" style={{ alignItems: 'center' }}>
              <label style={{ width: '140px', color: '#888', fontSize: '14px' }}>Amount Received</label>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#111' }}>-- BTC</span>
                <button className="btn btn--primary" style={{ padding: '14px 48px', opacity: 0.5, cursor: 'not-allowed', borderRadius: '8px' }}>Confirm</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (FAQ & Limits) */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>FAQ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#555' }}>
                <div style={{ display: 'flex', gap: '8px' }}><span>•</span> <span>Crypto Withdrawal FAQs</span></div>
                <div style={{ display: 'flex', gap: '8px' }}><span>•</span> <span>How to Withdraw Through Internal Transfer</span></div>
                <div style={{ display: 'flex', gap: '8px' }}><span>•</span> <span>View the Deposit/Withdrawal Status of All Coins</span></div>
                <div style={{ display: 'flex', gap: '8px' }}><span>•</span> <span>How to Change Your Withdrawal Limit</span></div>
                <div style={{ display: 'flex', gap: '8px' }}><span>•</span> <span>How to Manage Your Withdrawal Address Book</span></div>
              </div>
            </div>

            <div style={{ background: '#F9F9F9', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Daily Remaining Limit</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '6px', background: '#0ECB81', borderRadius: '3px' }} />
                <span style={{ fontSize: '12px', color: '#0ECB81', fontWeight: '600' }}>100.00%</span>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>1,000,000 / 1,000,000</div>
              <div style={{ fontSize: '13px', color: '#F6A500', fontWeight: '600', cursor: 'pointer' }}>Manage Limit</div>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0, cursor: 'pointer', color: '#111' }}>Recent Withdrawal Records</h3>
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#888', cursor: 'pointer' }}>BTC Withdrawal History</h3>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="light-table">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Chain Type</th>
                  <th>Qty</th>
                  <th>Transaction Fee</th>
                  <th>Address</th>
                  <th>Txd</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600' }}>XRP</td>
                  <td>XRP</td>
                  <td>8.246225</td>
                  <td>0.2</td>
                  <td>rUnmT...n49dL <Copy size={12} style={{ display: 'inline', marginLeft: '4px', color: '#888' }} /></td>
                  <td>F3CDB...F3A3D <Copy size={12} style={{ display: 'inline', marginLeft: '4px', color: '#888' }} /></td>
                  <td style={{ color: '#0ECB81', fontWeight: '500' }}>• Successfully Transferred</td>
                  <td style={{ color: '#666', fontSize: '13px' }}>2026-10-07<br />12:53:27</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>BTC</td>
                  <td>BTC</td>
                  <td>0.00074406</td>
                  <td>0.000035</td>
                  <td>bc1ql...eyfek <Copy size={12} style={{ display: 'inline', marginLeft: '4px', color: '#888' }} /></td>
                  <td>02a50...a0569 <Copy size={12} style={{ display: 'inline', marginLeft: '4px', color: '#888' }} /></td>
                  <td style={{ color: '#0ECB81', fontWeight: '500' }}>• Successfully Transferred</td>
                  <td style={{ color: '#666', fontSize: '13px' }}>2026-10-05<br />22:59:08</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button style={{ background: 'none', border: 'none', color: '#F6A500', fontSize: '15px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              View More <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
