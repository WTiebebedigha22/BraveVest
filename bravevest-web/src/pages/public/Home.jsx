import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  TrendingUp,
  Landmark,
  Building2,
  Store,
  UserPlus,
  Wallet,
  Sparkles,
  Zap,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

/* ============ Elite Sophisticated Light Theme Palette & Styling ============ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

.elite-light-root {
  --bg-primary: var(--bv-bg);
  --bg-surface: var(--bv-bg-elevated);
  --bg-surface-glass: rgba(255, 255, 255, 0.85);
  --border-color: rgba(194, 124, 0, 0.15);
  --border-hover: rgba(247, 166, 0, 0.5);
  --bv-accent: var(--bv-orange);
  --gold-dark: #C27C00;
  --gold-light: #FFC94D;
  --gold-gradient: linear-gradient(135deg, #FFC94D 0%, var(--bv-accent) 50%, #C27C00 100%);
  --gold-text-gradient: linear-gradient(135deg, var(--bv-text) 20%, #C27C00 70%, var(--bv-accent) 100%);
  --text-main: var(--text-main);
  --text-muted: var(--bv-text-muted);
  --success-green: var(--bv-success);
  --warm-tint: var(--bv-bg-elevated);
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-main);
  overflow-x: hidden;
  position: relative;
}

.elite-light-root * { box-sizing: border-box; }
.elite-container { max-width: 1240px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }

/* Ambient Decorative Warm Glows */
.elite-ambient {
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 1100px; height: 700px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.14) 0%, rgba(252, 251, 250, 0) 70%);
  z-index: 1; pointer-events: none;
}

/* Typography */
.elite-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.elite-gradient-text {
  background: var(--gold-text-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Buttons */
.elite-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 54px;
  padding: 0 32px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1.5px solid transparent;
  white-space: nowrap;
}

.elite-btn:hover { transform: translateY(-3px); }

.elite-btn-gold {
  background: var(--gold-gradient);
  color: var(--bv-text);
  box-shadow: 0 16px 32px -10px rgba(247, 166, 0, 0.45);
}
.elite-btn-gold:hover {
  filter: brightness(1.05);
  box-shadow: 0 20px 40px -8px rgba(247, 166, 0, 0.65);
}

.elite-btn-outline {
  background: var(--bv-bg-elevated);
  color: var(--text-main);
  border-color: rgba(18, 20, 26, 0.15);
  box-shadow: 0 4px 12px rgba(18, 18, 20, 0.04);
}
.elite-btn-outline:hover {
  background: var(--warm-tint);
  border-color: var(--bv-accent);
  color: var(--gold-dark);
}

/* Hero Section */
.elite-hero {
  position: relative;
  padding: 100px 0 110px;
  text-align: center;
  color: var(--bv-bg-elevated);
  background: linear-gradient(rgba(18, 18, 20, 0.72), rgba(18, 18, 20, 0.78)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
  overflow: hidden;
}

.elite-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 99px;
  background: rgba(247, 166, 0, 0.2);
  border: 1px solid rgba(247, 166, 0, 0.5);
  color: var(--gold-light);
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 28px;
  box-shadow: 0 0 30px rgba(247, 166, 0, 0.2);
  backdrop-filter: blur(8px);
}

.elite-hero h1 {
  font-size: clamp(36px, 5.5vw, 70px);
  line-height: 1.08;
  max-width: 900px;
  margin: 0 auto 24px;
  color: var(--bv-bg-elevated);
}

.elite-hero h1 .elite-gradient-text {
  background: linear-gradient(135deg, #FFC94D 0%, var(--bv-accent) 50%, #FFE29A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.elite-hero p {
  font-size: clamp(16px, 1.8vw, 19px);
  color: var(--bv-text-muted);
  max-width: 640px;
  margin: 0 auto 36px;
  line-height: 1.6;
}

.elite-hero-cta {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.elite-hero .elite-btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: var(--bv-bg-elevated);
  border-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}
.elite-hero .elite-btn-outline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--bv-accent);
  color: var(--gold-light);
}

/* Live Market Stats Ribbon */
.elite-stats-ribbon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
}

.elite-stat-card {
  background: var(--bv-bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: left;
  box-shadow: 0 10px 30px rgba(18, 18, 20, 0.04);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.elite-stat-card:hover {
  border-color: var(--bv-accent);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(194, 124, 0, 0.1);
}

.elite-stat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.elite-stat-card .label { font-size: 12.5px; color: var(--text-muted); font-weight: 600; line-height: 1.3; }
.elite-stat-card .value { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
.elite-stat-card .trend { font-size: 11px; color: var(--success-green); background: rgba(14, 159, 91, 0.1); padding: 2px 6px; border-radius: 6px; font-weight: 700; white-space: nowrap; }

/* Elevated Security & Trust Strip (Immediately Below Hero) */
.elite-strip {
  background: var(--bv-bg-elevated);
  border-bottom: 1px solid var(--border-color);
  padding: 28px 0;
  text-align: center;
  position: relative;
  z-index: 5;
  box-shadow: 0 10px 30px rgba(18, 18, 20, 0.04);
}
.elite-strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.elite-strip-label {
  color: var(--text-muted);
  font-size: 19px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  position: relative;
  gap: 8px;
  margin-bottom: 16px;
}.elite-strip-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 20px;
}

.elite-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.elite-logo-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bv-bg);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 99px;
  font-weight: 700;
  color: var(--text-main);
  font-size: 13.5px;
  transition: border-color 0.2s, transform 0.2s;
}

.elite-logo-pill:hover {
  border-color: var(--bv-accent);
  transform: translateY(-1px);
}

.elite-logo-pill svg { color: var(--gold-dark); }

/* Sections & Cards */
.elite-section { padding: 84px 0; position: relative; }
.elite-section-header { text-align: center; max-width: 720px; margin: 0 auto 56px; }
.elite-section-header h2 { font-size: clamp(32px, 4vw, 46px); margin-bottom: 16px; }
.elite-section-header p { color: var(--text-muted); font-size: 17px; line-height: 1.6; }

.elite-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.elite-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.elite-card {
  background: var(--bv-bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 36px 32px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  text-align: left;
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.05);
}

.elite-card.featured-pillar {
  border: 1.5px solid rgba(247, 166, 0, 0.55);
  box-shadow: 0 20px 50px rgba(194, 124, 0, 0.12);
}

.elite-pillar-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gold-dark);
  background: rgba(247, 166, 0, 0.12);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.elite-card:hover {
  transform: translateY(-8px);
  border-color: var(--bv-accent);
  box-shadow: 0 30px 60px rgba(194, 124, 0, 0.12), 0 0 30px rgba(247, 166, 0, 0.1);
}

.elite-card-icon {
  width: 60px; height: 60px;
  border-radius: 16px;
  background: var(--warm-tint);
  border: 1px solid rgba(247, 166, 0, 0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold-dark);
  margin-bottom: 24px;
  transition: all 0.3s;
}

.elite-card:hover .elite-card-icon,
.elite-card.featured-pillar .elite-card-icon {
  background: var(--gold-gradient);
  color: var(--bv-text);
  transform: scale(1.05);
}

.elite-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.elite-card p { color: var(--text-muted); font-size: 15px; line-height: 1.7; margin: 0; }

/* Wealth Calculator Section */
.elite-calc-wrapper {
  max-width: 1120px;
  margin: 0 auto 90px;
  position: relative;
  z-index: 10;
  padding: 0 24px;
}

.elite-calc-box {
  background: linear-gradient(145deg, var(--bv-bg-elevated) 0%, var(--bv-bg-elevated) 100%);
  border: 1px solid rgba(247, 166, 0, 0.35);
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 40px 100px rgba(18, 18, 20, 0.08), 0 0 40px rgba(247, 166, 0, 0.12);
}

.elite-calc-grid {
  display: grid;
  grid-template-columns: 1.2fr 1.1fr;
  gap: 48px;
  align-items: center;
}

.elite-input-group { margin-bottom: 28px; }
.elite-input-label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-muted); }
.elite-input-label b { color: var(--text-main); font-size: 18px; font-family: 'Space Grotesk', sans-serif; }

.elite-amount-box {
  display: flex;
  align-items: center;
  background: var(--bv-bg-elevated);
  border: 1.5px solid rgba(18, 20, 26, 0.12);
  border-radius: 16px;
  padding: 0 20px;
  height: 64px;
  transition: border-color 0.2s, background 0.2s;
}
.elite-amount-box:focus-within { border-color: var(--bv-accent); background: var(--bv-bg-elevated); box-shadow: 0 0 0 4px rgba(247, 166, 0, 0.15); }
.elite-amount-box span { font-size: 26px; font-weight: 700; color: var(--gold-dark); }
.elite-amount-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 30px;
  font-weight: 700;
  outline: none;
  padding-left: 8px;
}

.elite-quick-chips { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
.elite-chip {
  background: var(--bv-bg-elevated);
  border: 1px solid rgba(18, 18, 20, 0.08);
  color: var(--text-main);
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.elite-chip:hover, .elite-chip.active {
  background: var(--warm-tint);
  border-color: var(--bv-accent);
  color: var(--gold-dark);
}

.elite-slider {
  width: 100%;
  accent-color: var(--bv-accent);
  height: 6px;
  cursor: pointer;
  margin: 16px 0 8px;
}

.elite-calc-output {
  background: linear-gradient(135deg, #121316 0%, #1C1E24 100%);
  border: 1px solid rgba(247, 166, 0, 0.4);
  border-radius: 24px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow: hidden;
  color: #FFFFFF;
}

.elite-calc-output small { font-size: 13px; font-weight: 700; color: var(--gold-light); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 8px; }
.elite-calc-output .big-earn { font-family: 'Space Grotesk', sans-serif; font-size: 44px; font-weight: 800; color: var(--bv-success); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 16px; }
.elite-calc-output .total-val { font-size: 15px; font-weight: 600; color: rgba(255, 255, 255, 0.75); margin-bottom: 32px; display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; }

/* Image Asset Cards Showcase */
.elite-asset-card {
  background: var(--bv-bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.elite-asset-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px rgba(194, 124, 0, 0.15);
}

.elite-asset-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.elite-asset-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Banner CTA */
.elite-banner {
  background: linear-gradient(135deg, #121316 0%, #1C1E24 100%);
  border: 1px solid rgba(247, 166, 0, 0.4);
  border-radius: 36px;
  padding: 80px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin: 60px auto 120px;
  color: #FFFFFF;
  box-shadow: 0 30px 80px rgba(18, 18, 20, 0.2);
}

.elite-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.25), transparent 70%);
  pointer-events: none;
}

@media (max-width: 968px) {
  .elite-stats-ribbon { grid-template-columns: repeat(2, 1fr); }
  .elite-strip-inner { flex-direction: column; justify-content: center; }
  .elite-calc-grid { grid-template-columns: 1fr; }
  .elite-grid-3, .elite-grid-4 { grid-template-columns: 1fr; }
  .elite-calc-box { padding: 28px; }
  .elite-banner { padding: 48px 24px; }
}
`;

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(16);
  const fmt = (n) => '₦' + Math.round(n).toLocaleString('en-NG');
  const valid = amount >= 5000;
  const annualEarn = valid ? (amount * rate) / 100 : 0;
  const quickVals = [25000, 250000, 1000000, 5000000];
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/register', { state: { email } });
  };

  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='elite-light-root'>
        <div className='elite-ambient' />

        {/* 1. Hero Section */}
        <section className='elite-hero bv-hero'>
          <div className='elite-container'>
            <div className='elite-badge'>
              <Sparkles size={15} />
              <span>Institutional Private Credit &amp; Real Assets</span>
            </div>
            <h1 className='elite-title'>
              Engineer Your Wealth With <span className='elite-gradient-text'>Elite Fixed Yields</span>
            </h1>
            <p>
              Access rigorously vetted private credit, real estate development, and high-growth SME opportunities across Nigeria yielding up to 18% per annum.
            </p>
            <div className='elite-hero-cta bv-hero'>
              <Link to='/register' className='elite-btn elite-btn-gold'>
                Start Investing Today <ArrowRight size={18} />
              </Link>
              <Link to='/marketplace' className='elite-btn elite-btn-outline'>
                Explore Active Deals
              </Link>
            </div>

            {/* Live Stats Ribbon */}
            <div className='elite-stats-ribbon'>
              <div className='elite-stat-card'>
                <div className='elite-stat-card-top'>
                  <div className='label'>Total Capital Deployed</div>
                  <span className='trend'>+24% YoY</span>
                </div>
                <div className='value'>₦14.8B</div>
              </div>
              <div className='elite-stat-card'>
                <div className='elite-stat-card-top'>
                  <div className='label'>Average Annual Yield</div>
                  <span className='trend'>Fixed</span>
                </div>
                <div className='value'>16.4%</div>
              </div>
              <div className='elite-stat-card'>
                <div className='elite-stat-card-top'>
                  <div className='label'>Default Rate Since Inception</div>
                  <span className='trend'>Secure</span>
                </div>
                <div className='value'>0.00%</div>
              </div>
              <div className='elite-stat-card'>
                <div className='elite-stat-card-top'>
                  <div className='label'>Active Elite Investors</div>
                  <span className='trend'>Verified</span>
                </div>
                <div className='value'>14,250+</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Elevated Security & Institutional Trust Bar (Moved Up) */}
        <div className='elite-strip'>
          <div className='elite-container'>
            <div className='elite-strip-inner'>
              <div className='elite-strip-label'>
                <Shield size={16} style={{ color: 'var(--gold-dark)' }} />
                <span>Institutional Security &amp; Compliance</span>
              </div>
              <div className='elite-logos'>
                <div className='elite-logo-pill'><Shield size={16} /> Bravelion Risk Engine</div>
                <div className='elite-logo-pill'><CheckCircle size={16} /> Paystack Encrypted Gateway</div>
                <div className='elite-logo-pill'><BadgeCheck size={16} /> SEC-Aligned Compliance</div>
                <div className='elite-logo-pill'><Award size={16} /> 0% Default Record</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Prioritized Core Selling Points (Why Bravelion) */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Built for Capital Preservation &amp; Yield</h2>
              <p>We eliminate stock market volatility by prioritizing asset-backed security first, predictable fixed returns second, and effortless access third.</p>
            </div>
            <div className='elite-grid-3'>
              {/* Priority #1: Security & Underwriting */}
              <div className='elite-card featured-pillar'>
                <span className='elite-pillar-tag'>01 · Capital Protection</span>
                <div className='elite-card-icon'><Shield size={28} /></div>
                <h3>7-Tier Institutional Vetting</h3>
                <p>Every facility undergoes strict underwriting, audited cash-flow verification, and legal collateralization—sustaining a 0.00% default record.</p>
              </div>

              {/* Priority #2: Fixed High-Yield Returns */}
              <div className='elite-card'>
                <span className='elite-pillar-tag'>02 · Predictable Growth</span>
                <div className='elite-card-icon'><TrendingUp size={28} /></div>
                <h3>Fixed 12%–18% Annual Yields</h3>
                <p>Lock in inflation-beating, contractually fixed returns backed by tangible corporate assets and enforceable receivables rather than market speculation.</p>
              </div>

              {/* Priority #3: Low Friction & Liquidity */}
              <div className='elite-card'>
                <span className='elite-pillar-tag'>03 · Seamless Access</span>
                <div className='elite-card-icon'><Zap size={28} /></div>
                <h3>Start From Just ₦5,000</h3>
                <p>Access private credit deals previously reserved for institutions with automated quarterly payouts and instant Paystack funding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Wealth Calculator */}
        <div className='elite-calc-wrapper'>
          <div className='elite-calc-box'>
            <div className='elite-calc-grid'>
              <div>
                <h3 className='elite-title' style={{ fontSize: '26px', marginBottom: '8px' }}>Compound Growth Simulator</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>
                  Calculate your projected 12-month earnings across curated high-yield credit allocations.
                </p>

                <div className='elite-input-group'>
                  <div className='elite-input-label'>
                    <span>Principal Investment</span>
                    <b>{fmt(amount)}</b>
                  </div>
                  <div className='elite-amount-box'>
                    <span>₦</span>
                    <input
                      type='text'
                      inputMode='numeric'
                      value={amount ? amount.toLocaleString('en-NG') : ''}
                      onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
                    />
                  </div>
                  <div className='elite-quick-chips'>
                    {quickVals.map((q) => (
                      <button
                        key={q}
                        type='button'
                        className={`elite-chip ${amount === q ? 'active' : ''}`}
                        onClick={() => setAmount(q)}
                      >
                        {fmt(q)}
                      </button>
                    ))}
                  </div>
                  {!valid && <p style={{ color: 'var(--bv-danger)', fontSize: '13px', marginTop: '8px' }}>Minimum investment is ₦5,000.</p>}
                </div>

                <div className='elite-input-group' style={{ marginBottom: '0' }}>
                  <div className='elite-input-label'>
                    <span>Target Annual Yield</span>
                    <b style={{ color: 'var(--gold-dark)' }}>{rate}% p.a.</b>
                  </div>
                  <input
                    type='range'
                    className='elite-slider'
                    min='12'
                    max='18'
                    step='0.5'
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>12% (Conservative)</span>
                    <span>18% (Growth)</span>
                  </div>
                </div>
              </div>

              <div className='elite-calc-output'>
                <div>
                  <small>Projected 12-Month Net Returns</small>
                  <div className='big-earn'>+{fmt(annualEarn)}</div>
                  <div className='total-val'>
                    <span>Total Portfolio Value:</span>
                    <b style={{ fontFamily: 'Space Grotesk', fontSize: '18px' }}>
                      {fmt(valid ? amount + annualEarn : 0)}
                    </b>
                  </div>
                </div>
                <Link to='/register' state={{ amount, email }} className='elite-btn elite-btn-gold' style={{ width: '100%' }}>
                  Deploy Capital Now <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Curated Asset Classes */}
        <section className='elite-section' style={{ background: 'var(--bv-bg-elevated)' }}>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Curated Asset Classes</h2>
              <p>Diversify your capital across high-demand sectors driving West Africa's economic transformation.</p>
            </div>
            <div className='elite-grid-3'>
              <div className='elite-asset-card'>
                <img
                  src='https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
                  alt='Private Credit & Banking'
                  className='elite-asset-img'
                />
                <div className='elite-asset-body'>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dark)', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                    <Landmark size={16} /> PRIVATE CREDIT
                  </div>
                  <h3>Working Capital Facilities</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    Short-term inventory and receivable-backed credit lines extended to prime tier-1 distributors.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>Up to 18% p.a.</span>
                    <Link to='/marketplace' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--gold-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
                      Explore Deal <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className='elite-asset-card'>
                <img
                  src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                  alt='Real Estate Development'
                  className='elite-asset-img'
                />
                <div className='elite-asset-body'>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dark)', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                    <Building2 size={16} /> REAL ESTATE
                  </div>
                  <h3>Commercial &amp; Residential</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    Co-invest in fully pre-sold residential developments and prime commercial real estate with escrow protection.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>Up to 16% p.a.</span>
                    <Link to='/marketplace' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--gold-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
                      Explore Deal <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className='elite-asset-card'>
                <img
                  src='https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
                  alt='SME Growth Financing'
                  className='elite-asset-img'
                />
                <div className='elite-asset-body'>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dark)', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                    <Store size={16} /> SME FINANCING
                  </div>
                  <h3>Expansion-Stage Ventures</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    Fuel fast-growing Nigerian companies possessing verified cash flows and audited balance sheets.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>Up to 17% p.a.</span>
                    <Link to='/marketplace' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--gold-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
                      Explore Deal <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. How It Works */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Seamless 4-Step Onboarding</h2>
              <p>Establish your wealth portfolio and start earning within minutes.</p>
            </div>
            <div className='elite-grid-4'>
              <div className='elite-card' style={{ textAlign: 'center' }}>
                <div className='elite-card-icon' style={{ margin: '0 auto 24px' }}><UserPlus size={26} /></div>
                <h3>1. Register</h3>
                <p>Create your secure account in under 60 seconds.</p>
              </div>
              <div className='elite-card' style={{ textAlign: 'center' }}>
                <div className='elite-card-icon' style={{ margin: '0 auto 24px' }}><BadgeCheck size={26} /></div>
                <h3>2. Verify KYC</h3>
                <p>Submit valid identification for instant compliance clearance.</p>
              </div>
              <div className='elite-card' style={{ textAlign: 'center' }}>
                <div className='elite-card-icon' style={{ margin: '0 auto 24px' }}><Wallet size={26} /></div>
                <h3>3. Fund Wallet</h3>
                <p>Deposit securely via bank transfer or Paystack integration.</p>
              </div>
              <div className='elite-card' style={{ textAlign: 'center' }}>
                <div className='elite-card-icon' style={{ margin: '0 auto 24px' }}><TrendingUp size={26} /></div>
                <h3>4. Earn Returns</h3>
                <p>Select your asset deals and watch your capital compound.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Final Conversion Banner */}
        <div className='elite-container'>
          <div className='elite-banner bv-hero'>
            <h2 className='elite-title' style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', marginBottom: '16px' }}>
              Ready to Accelerate Your Wealth?
            </h2>
            <p style={{ color: 'var(--bv-text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 36px' }}>
              Join over 14,000 smart investors securing dependable fixed returns with Bravelion.
            </p>
            <form onSubmit={handleSignup} style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type='email'
                required
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  height: '54px',
                  padding: '0 20px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
              <button type='submit' className='elite-btn elite-btn-gold'>
                Get Started Free <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}