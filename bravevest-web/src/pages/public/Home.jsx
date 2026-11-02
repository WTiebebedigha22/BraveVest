import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Flame, Download, Headphones, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ASSET_CLASSES = [
  { name: 'Lagos Solar II', type: 'Energy', apy: '14.5%', change: '+0.2%', icon: '⚡' },
  { name: 'Abuja REIT', type: 'Real Estate', apy: '12.0%', change: '+1.1%', icon: '🏢' },
  { name: 'SME Trade Finance', type: 'SME', apy: '16.5%', change: '-0.5%', icon: '💼' },
  { name: 'Ogun Agri Coop', type: 'Agri', apy: '14.0%', change: '+0.8%', icon: '🌾' },
];

const HOT_DEALS = [
  { name: 'Lagos Solar Fund II', apy: '14.5%', funded: '72%', icon: '⚡', tenor: '18 mo' },
  { name: 'Abuja Real Estate Note', apy: '12.0%', funded: '45%', icon: '🏢', tenor: '24 mo' },
  { name: 'Ogun Agri Cooperative', apy: '14.0%', funded: '88%', icon: '🌾', tenor: '12 mo' },
  { name: 'SME Trade Finance', apy: '16.5%', funded: '34%', icon: '💼', tenor: '6 mo' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [fxRates, setFxRates] = useState([]);
  const [fxLoading, setFxLoading] = useState(true);
  const [fxError, setFxError] = useState(false);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          const r = data.rates;
          setFxRates([
            { pair: 'USD / NGN', price: r.NGN?.toFixed(2) || '1,500.00', change: '+0.42%', icon: '🇳🇬' },
            { pair: 'GBP / NGN', price: (r.NGN / r.GBP).toFixed(2) || '1,900.00', change: '-0.15%', icon: '🇬🇧' },
            { pair: 'EUR / NGN', price: (r.NGN / r.EUR).toFixed(2) || '1,620.00', change: '+0.88%', icon: '🇪🇺' },
            { pair: 'USD / GBP', price: (1 / r.GBP).toFixed(4) || '0.79', change: '-0.05%', icon: '🇺🇸' },
          ]);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(() => {
        setFxError(true);
        setFxRates([
          { pair: 'USD / NGN', price: '1,450.00', change: '+0.42%', icon: '🇳🇬' },
          { pair: 'GBP / NGN', price: '1,840.00', change: '-0.15%', icon: '🇬🇧' },
          { pair: 'EUR / NGN', price: '1,570.00', change: '+0.88%', icon: '🇪🇺' },
          { pair: 'USD / GBP', price: '0.7880', change: '-0.05%', icon: '🇺🇸' },
        ]);
      })
      .finally(() => setFxLoading(false));
  }, []);

  return (
    <div style={{ background: '#FFFFFF', color: '#111', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ═══ RESPONSIVE STYLE INJECTIONS ═══ */}
      <style>{`
        .bv-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .bv-hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
        }

        .bv-widgets-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bv-widgets-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .bv-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          text-align: center;
          padding: 40px 0;
          border-top: 1px solid #EAEAEA;
          border-bottom: 1px solid #EAEAEA;
        }

        .bv-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .bv-card-span-2 {
          grid-column: span 2;
        }

        .bv-hero-title {
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #111;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .bv-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .bv-bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bv-card-span-2 {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .bv-widgets-top {
            grid-template-columns: 1fr;
          }
          .bv-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bv-bento-grid {
            grid-template-columns: 1fr;
          }
          .bv-card-span-2 {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .bv-stats-grid {
            grid-template-columns: 1fr;
          }
          .bv-signup-box {
            flex-direction: column;
            border-radius: 20px !important;
            padding: 8px !important;
          }
          .bv-signup-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* ═══ HERO SECTION ═══ */}
      <section style={{ padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: '-10%', width: '55%', height: '100%', background: 'radial-gradient(ellipse at top right, rgba(246,165,0,0.12), transparent 65%)', pointerEvents: 'none' }} />
        
        <div className="bv-container">
          <div className="bv-hero-grid">

            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '20px' }}>
                <span style={{ width: '24px', height: '2px', background: '#F6A500' }} />
                The New Financial Platform
              </div>
              <h1 className="bv-hero-title">
                One place to grow,<br />spend, and move<br />your money.
              </h1>
              <p style={{ fontSize: '18px', color: '#555', marginBottom: '32px', lineHeight: 1.6 }}>
                Deposit · Earn · Invest · Withdraw
              </p>

              {/* Form Input */}
              <div className="bv-signup-box" style={{ display: 'flex', alignItems: 'center', background: '#F5F5F5', borderRadius: '40px', padding: '6px', maxWidth: '460px', marginBottom: '24px', gap: '8px' }}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email / Mobile Number"
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', fontSize: '15px', color: '#111', outline: 'none', width: '100%' }}
                />
                <Link
                  to="/register"
                  className="bv-signup-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '40px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  <Shield size={16} /> Sign Up Now
                </Link>
              </div>

              {/* Social Login Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#555', flexWrap: 'wrap' }}>
                <span>Or Use</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5', color: '#DB4437', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>G</div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5', color: '#111', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}></div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5', color: '#0088CC', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✈</div>
              </div>
            </div>

            {/* Right Side Cards / Widgets */}
            <div className="bv-widgets-container">
              <div className="bv-widgets-top">
                
                {/* Live FX Rate Highlight */}
                <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>
                    <Flame size={16} color="#F6A500" /> Live FX Rates
                    {fxError && <span style={{ fontSize: '10px', color: '#F6465D', marginLeft: 'auto' }}>Offline</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#F6A500', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>₦</div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888' }}>USD/NGN</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>
                        {fxLoading ? '...' : fxRates[0]?.price}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#0ECB81', fontSize: '13px', fontWeight: '600' }}>
                      {fxLoading ? '' : fxRates[0]?.change}
                    </div>
                  </div>
                  <svg viewBox="0 0 100 30" style={{ width: '100%', height: '36px', stroke: '#0ECB81', fill: 'none', strokeWidth: '2' }}>
                    <path d="M0,25 Q10,20 20,22 T40,15 T60,18 T80,10 T100,25" />
                  </svg>
                </div>

                {/* Exchange Rates List */}
                <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>Exchange Rates</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {fxRates.slice(0, 3).map((rate, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', background: '#F0F0F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{rate.icon}</div>
                        <div style={{ flex: 1, fontSize: '12px', fontWeight: '600', color: '#111' }}>{rate.pair}</div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{fxLoading ? '...' : rate.price}</div>
                          <div style={{ fontSize: '10px', color: rate.change.startsWith('-') ? '#F6465D' : '#0ECB81', fontWeight: '500' }}>{rate.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Active Deals Widget */}
              <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
                    <span style={{ color: '#111', borderBottom: '2px solid #F6A500', paddingBottom: '2px' }}>Active Deals</span>
                    <span style={{ color: '#888' }}>Fully Funded</span>
                  </div>
                  <Link to="/marketplace" style={{ fontSize: '12px', color: '#F6A500', fontWeight: '600', textDecoration: 'none' }}>View all</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {HOT_DEALS.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FAF9F6', padding: '10px', borderRadius: '10px' }}>
                      <div style={{ width: '28px', height: '28px', background: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{c.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>{c.tenor}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#0ECB81' }}>{c.apy}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>{c.funded}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <div className="bv-container">
        <div className="bv-stats-grid">
          <div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: '#111', lineHeight: 1 }}>₦184B+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>Assets Under Management</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: '#111', lineHeight: 1 }}>52,000+</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>Active Investors</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: '#F6A500', lineHeight: 1 }}>14.2%</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>Average Yield</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', color: '#0ECB81', lineHeight: 1 }}>&lt;0.8%</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>Default Rate</div>
          </div>
        </div>
      </div>

      {/* ═══ BENTO FEATURES ═══ */}
      <section style={{ padding: '80px 0' }}>
        <div className="bv-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', marginBottom: '12px' }}>
              One platform, endless possibilities.
            </h2>
            <p style={{ fontSize: '18px', color: '#555', marginBottom: '24px' }}>
              Unlock every way to grow, manage, and spend your money.
            </p>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}>
              <Shield size={18} /> Create Your Account
            </Link>
          </div>

          <div className="bv-bento-grid">

            {/* Deposit */}
            <div style={{ background: '#F8F8F8', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>
                <span style={{ width: '20px', height: '2px', background: '#F6A500' }} /> Deposit
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>Naira & USD<br />Instant funding</div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '24px' }}>
                <div style={{ width: '80px', height: '80px', background: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(246,165,0,0.3)' }}>₦</div>
              </div>
            </div>

            {/* Invest */}
            <div style={{ background: '#F8F8F8', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>
                <span style={{ width: '20px', height: '2px', background: '#F6A500' }} /> Invest
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', lineHeight: 1.3 }}>Private Credit<br />Fixed Returns</div>
              <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                <div style={{ width: '100%', height: '60px', background: 'linear-gradient(180deg, rgba(246,165,0,0.1) 0%, transparent 100%)', borderBottom: '2px solid #F6A500' }}>
                  <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', stroke: '#F6A500', fill: 'none', strokeWidth: '2' }}>
                    <path d="M0,30 Q20,20 40,35 T70,20 T100,10" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Earn */}
            <div style={{ background: '#F8F8F8', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>
                <span style={{ width: '20px', height: '2px', background: '#F6A500' }} /> Earn
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111' }}>Yield up to</div>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#F6A500', lineHeight: 1, marginBottom: '8px' }}>18.5%</div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '24px' }}>
                <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #E0E0E0 0%, #FFF 100%)', borderRadius: '16px', border: '1px solid #DDD', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '24px' }}>📈</span>
                </div>
              </div>
            </div>

            {/* Card (Span 2) */}
            <div className="bv-card-span-2" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #333 100%)', borderRadius: '20px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
                  <span style={{ width: '20px', height: '2px', background: '#F6A500' }} /> Card
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', lineHeight: 1.3 }}>Cashback up to</div>
                <div style={{ fontSize: '48px', fontWeight: '700', lineHeight: 1, marginBottom: '8px', color: '#F6A500' }}>5%</div>
              </div>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.85 }}>
                <div style={{ width: '220px', height: '140px', background: 'linear-gradient(135deg, #EAEAEA 0%, #FFF 100%)', borderRadius: '16px', transform: 'rotate(-15deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', letterSpacing: '2px' }}>BRAVEVEST</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ width: '28px', height: '20px', background: 'rgba(246,165,0,0.2)', borderRadius: '4px', border: '1px solid #F6A500' }} />
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '20px', height: '20px', background: '#EB001B', borderRadius: '50%' }} />
                      <div style={{ width: '20px', height: '20px', background: '#F79E1B', borderRadius: '50%', marginLeft: '-8px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div style={{ background: '#F6A500', borderRadius: '20px', padding: '32px', color: '#fff', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
                <span style={{ width: '20px', height: '2px', background: '#fff' }} /> Mobile
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600', lineHeight: 1.3 }}>Manage on the go</div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '24px' }}>
                <div style={{ width: '90px', height: '120px', background: '#111', borderRadius: '16px 16px 0 0', border: '4px solid #333', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '36px', height: '36px', background: '#F6A500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>B</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FLOATING HELP ═══ */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
        <button aria-label="Download App" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: '1px solid #EAEAEA', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Download size={20} />
        </button>
        <button aria-label="Support" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: '1px solid #EAEAEA', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
          <Headphones size={20} />
        </button>
      </div>

    </div>
  );
}