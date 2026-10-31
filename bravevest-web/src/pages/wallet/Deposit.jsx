import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

export default function Deposit() {
  const [activeTab, setActiveTab] = useState('One-Click Buy');
  const [buyType, setBuyType] = useState('Buy');

  return (
    <div className="wallet-page">
      <div className="container" style={{ paddingTop: '32px', maxWidth: '1200px' }}>
        
        <div className="wallet-tabs" style={{ borderBottom: 'none', borderBottom: '1px solid #EAEAEA' }}>
          {['One-Click Buy', 'P2P', 'Block', 'Fiat Deposit', 'Recurring Buy'].map(tab => (
            <div key={tab} className={`wallet-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', fontSize: '13px', color: '#666', alignItems: 'center' }}>
            <span>Orders ↗</span> <span>User Center ↗</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', marginTop: '24px' }}>
          
          {/* Left Side */}
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>One-Click Buy BTC With NGN</h1>
            <p style={{ color: '#555', marginBottom: '32px', lineHeight: 1.6, fontSize: '14px' }}>
              Trade BTC seamlessly on BraveVest with P2P and multiple payment options. VIPs enjoy 10% off fees with a minimum transaction of 1,500 USDT.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <button style={{ background: 'rgba(246,165,0,0.1)', color: '#F6A500', border: '1px solid #F6A500', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>Trending Events</button>
              <button style={{ background: 'transparent', color: '#666', border: '1px solid #EAEAEA', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>Ongoing Events (1)</button>
            </div>

            <div style={{ background: '#FDF6EC', border: '1px solid #F6A500', borderRadius: '12px', padding: '24px', position: 'relative' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Fiat-to-Crypto Frenzy rewards</h3>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', maxWidth: '80%' }}>Make a small fiat deposit and trade crypto to claim your share of the 97,200 USDT prize pool.</p>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(14,203,129,0.15)', color: '#0ECB81', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Ongoing</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Ends on 2026-11-01</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F6A500', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Event Details ↗
              </div>

              {/* Floating 3D Bank Icon Approximation */}
              <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', fontSize: '64px', opacity: 0.9 }}>
                🏦
              </div>
            </div>
          </div>

          {/* Right Side (Buy/Sell Form) */}
          <div style={{ background: '#F5F5F5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <div className="buy-sell-toggle">
              <button className={buyType === 'Buy' ? 'active' : 'inactive'} onClick={() => setBuyType('Buy')}>Buy</button>
              <button className={buyType === 'Sell' ? 'active' : 'inactive'} onClick={() => setBuyType('Sell')}>Sell</button>
            </div>

            <div style={{ padding: '32px 24px', background: '#fff', border: '1px solid #EAEAEA', borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>Spend</label>
                <div style={{ display: 'flex', background: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EAEAEA' }}>
                  <input type="text" placeholder="450 - 23,000,000" style={{ flex: 1, border: 'none', background: 'transparent', padding: '16px', fontSize: '16px', color: '#111', outline: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#fff', borderLeft: '1px solid #EAEAEA', cursor: 'pointer', fontWeight: '600' }}>
                    <div style={{ width: '20px', height: '20px', background: '#0ECB81', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>₦</div>
                    <span>NGN</span>
                    <ChevronDown size={14} color="#666" />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>Receive ≈</label>
                <div style={{ display: 'flex', background: '#F5F5F5', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EAEAEA' }}>
                  <input type="text" placeholder="Enter purchase amount" style={{ flex: 1, border: 'none', background: 'transparent', padding: '16px', fontSize: '16px', color: '#111', outline: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#fff', borderLeft: '1px solid #EAEAEA', cursor: 'pointer', fontWeight: '600' }}>
                    <div style={{ width: '20px', height: '20px', background: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>₿</div>
                    <span>BTC</span>
                    <ChevronDown size={14} color="#666" />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>1 BTC ≈ 107,200,000 NGN</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#111', fontWeight: '600', marginBottom: '12px' }}>Payment Methods</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #EAEAEA', borderRadius: '8px', cursor: 'pointer', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontSize: '10px', fontWeight: 'bold' }}>P2P</div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Bank Transfer (Africa)</span>
                  </div>
                  <ChevronDown size={16} color="#888" />
                </div>
              </div>

              <button className="btn btn--primary" style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '8px', opacity: 0.5, cursor: 'not-allowed' }}>Buy With NGN</button>
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111', cursor: 'pointer', fontWeight: '600' }}>
                  <Calendar size={16} /> Recurring Buy
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
