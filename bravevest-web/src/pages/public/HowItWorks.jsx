import { Link } from 'react-router-dom';
import {
  UserPlus, BadgeCheck, Wallet, TrendingUp, ArrowRight,
  Shield, CheckCircle, Zap, Sparkles, Clock, Lock, Award,
  Percent, Users, FileCheck,
} from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

.elite-light-root {
  --bg-primary: var(--bv-bg);
  --bg-surface: var(--bv-bg-elevated);
  --bg-surface-glass: rgba(255, 255, 255, 0.85);
  --border-color: rgba(194, 124, 0, 0.15);
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

.elite-ambient {
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 1100px; height: 700px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.14) 0%, rgba(252, 251, 250, 0) 70%);
  z-index: 1; pointer-events: none;
}

.elite-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.03em; }
.elite-gradient-text { background: var(--gold-text-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.elite-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 10px; height: 54px; padding: 0 32px;
  border-radius: 14px; font-weight: 700; font-size: 15px;
  text-decoration: none; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1.5px solid transparent; white-space: nowrap;
}
.elite-btn:hover { transform: translateY(-3px); }
.elite-btn-gold { background: var(--gold-gradient); color: var(--bv-text); box-shadow: 0 16px 32px -10px rgba(247, 166, 0, 0.45); }
.elite-btn-gold:hover { filter: brightness(1.05); box-shadow: 0 20px 40px -8px rgba(247, 166, 0, 0.65); }
.elite-btn-outline { background: var(--bv-bg-elevated); color: var(--text-main); border-color: rgba(18, 20, 26, 0.15); box-shadow: 0 4px 12px rgba(18, 18, 20, 0.04); }
.elite-btn-outline:hover { background: var(--warm-tint); border-color: var(--bv-accent); color: var(--gold-dark); }

/* ── HERO with image ── */
.elite-hero-hiw {
  position: relative;
  padding: 120px 0 130px;
  text-align: center;
  color: var(--bv-bg-elevated);
  background:
    linear-gradient(rgba(18, 18, 20, 0.72), rgba(18, 18, 20, 0.85)),
    url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
  overflow: hidden;
}
.elite-hero-hiw h1 {
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.08;
  max-width: 900px;
  margin: 0 auto 24px;
  color: var(--bv-bg-elevated);
}
.elite-hero-hiw h1 .elite-gradient-text {
  background: linear-gradient(135deg, #FFC94D 0%, var(--bv-accent) 50%, #FFE29A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.elite-hero-hiw p {
  font-size: clamp(17px, 2vw, 20px);
  color: var(--bv-text-muted);
  max-width: 720px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

/* Outline button reads on dark hero */
.elite-hero-hiw .elite-btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: var(--bv-bg-elevated);
  border-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}
.elite-hero-hiw .elite-btn-outline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--bv-accent);
  color: var(--gold-light);
}

.elite-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; border-radius: 99px;
  background: rgba(247, 166, 0, 0.2);
  border: 1px solid rgba(247, 166, 0, 0.5);
  color: #FFC94D;
  font-size: 13.5px; font-weight: 700;
  margin-bottom: 28px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px rgba(247, 166, 0, 0.2);
}

.elite-section { padding: 90px 0; position: relative; }
.elite-section-alt { background: var(--bv-bg-elevated); }
.elite-section-header { text-align: center; max-width: 700px; margin: 0 auto 64px; }
.elite-section-header h2 { font-size: clamp(32px, 4vw, 46px); margin: 0 0 16px; }
.elite-section-header p { color: var(--text-muted); font-size: 17px; line-height: 1.6; margin: 0; }

/* Steps Timeline */
.elite-timeline {
  position: relative;
  display: grid; gap: 32px;
  max-width: 900px; margin: 0 auto;
}
.elite-timeline::before {
  content: '';
  position: absolute;
  left: 48px; top: 60px; bottom: 60px;
  width: 2px;
  background: linear-gradient(180deg, var(--bv-accent) 0%, var(--gold-light) 50%, var(--bv-accent) 100%);
  opacity: 0.4;
}

.elite-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 24px;
  align-items: flex-start;
  background: var(--bv-bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.3s;
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.05);
}
.elite-step:hover { border-color: var(--bv-accent); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(194, 124, 0, 0.1); }
.elite-step-num {
  width: 72px; height: 72px; border-radius: 20px;
  background: var(--gold-gradient); color: var(--bv-text);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px; font-weight: 800;
  box-shadow: 0 12px 24px rgba(247, 166, 0, 0.3);
  flex-shrink: 0;
}
.elite-step-body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 8px; }
.elite-step-body .step-tag { display: inline-block; padding: 3px 10px; background: var(--warm-tint); border: 1px solid rgba(247, 166, 0, 0.2); border-radius: 99px; font-size: 11px; font-weight: 700; color: var(--gold-dark); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
.elite-step-body p { color: var(--text-muted); font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
.elite-step-bullets { display: flex; flex-direction: column; gap: 8px; padding: 0; margin: 0; list-style: none; }
.elite-step-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text-main); }
.elite-step-bullets svg { color: var(--success-green); flex-shrink: 0; margin-top: 3px; }

/* Feature Grid */
.elite-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.elite-card {
  background: var(--bv-bg-elevated); border: 1px solid var(--border-color);
  border-radius: 24px; padding: 36px 32px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.05);
}
.elite-card:hover { transform: translateY(-8px); border-color: var(--bv-accent); box-shadow: 0 30px 60px rgba(194, 124, 0, 0.12), 0 0 30px rgba(247, 166, 0, 0.1); }
.elite-card-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: var(--warm-tint); border: 1px solid rgba(247, 166, 0, 0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold-dark); margin-bottom: 24px; transition: all 0.3s;
}
.elite-card:hover .elite-card-icon { background: var(--gold-gradient); color: var(--bv-text); transform: scale(1.08); }
.elite-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin: 0 0 10px; }
.elite-card p { color: var(--text-muted); font-size: 15px; line-height: 1.65; margin: 0; }

/* FAQ-style details */
.elite-faq { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.elite-faq-item {
  background: var(--bv-bg-elevated); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 24px 28px;
  transition: all 0.2s;
}
.elite-faq-item:hover { border-color: var(--bv-accent); }
.elite-faq-item summary { cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.elite-faq-item summary::-webkit-details-marker { display: none; }
.elite-faq-item summary::after { content: '+'; font-size: 24px; color: var(--gold-dark); transition: transform 0.2s; }
.elite-faq-item[open] summary::after { content: '−'; }
.elite-faq-item p { color: var(--text-muted); font-size: 15px; line-height: 1.7; margin: 16px 0 0; }

.elite-banner {
  background: linear-gradient(135deg, var(--bv-bg) 0%, var(--bv-bg-elevated) 100%);
  border: 1px solid rgba(247, 166, 0, 0.4);
  border-radius: 36px; padding: 72px 48px;
  text-align: center; position: relative; overflow: hidden;
  margin: 60px auto 120px; color: var(--bv-bg-elevated);
  box-shadow: 0 30px 80px rgba(18, 18, 20, 0.2);
}
.elite-banner::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.25), transparent 70%);
  pointer-events: none;
}
.elite-banner h2 { font-size: clamp(32px, 4.5vw, 48px); margin: 0 0 16px; color: var(--bv-bg-elevated); }
.elite-banner p { color: var(--bv-text-muted); font-size: 18px; max-width: 600px; margin: 0 auto 36px; }

@media (max-width: 968px) {
  .elite-hero-hiw { padding: 72px 0 90px; }
  .elite-grid-3 { grid-template-columns: 1fr; }
  .elite-timeline::before { display: none; }
  .elite-step { grid-template-columns: 1fr; }
  .elite-step-num { margin-bottom: 8px; }
  .elite-banner { padding: 48px 24px; }
}
`;

export default function HowItWorks() {
  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='elite-light-root'>
        <div className='elite-ambient' />

        {/* HERO with image background */}
        <section className='elite-hero-hiw bv-hero'>
          <div className='elite-container'>
            <div className='elite-badge'>
              <Sparkles size={15} />
              <span>How BraveVest Works</span>
            </div>
            <h1 className='elite-title'>
              From Sign-Up to <span className='elite-gradient-text'>Fixed Returns</span> immediately.
            </h1>
            <p>
              Four steps to start earning 12–18% annual yield on vetted, collateralized private credit opportunities.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to='/register' className='elite-btn elite-btn-gold'>
                Create Free Account <ArrowRight size={17} />
              </Link>
              <Link to='/marketplace' className='elite-btn elite-btn-outline'>
                Browse Deals
              </Link>
            </div>
          </div>
        </section>

        {/* Steps Timeline */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>The <span className='elite-gradient-text'>4-Step Process</span></h2>
              <p>Everything you need to know to deploy capital and start earning.</p>
            </div>

            <div className='elite-timeline'>
              <div className='elite-step'>
                <div className='elite-step-num'>01</div>
                <div className='elite-step-body'>
                  <span className='step-tag'>60 Seconds</span>
                  <h3>Create your account</h3>
                  <p>Sign up with your email address. No paperwork, no waiting room. Your account is live immediately.</p>
                  <ul className='elite-step-bullets'>
                    <li><CheckCircle size={16} /> Email + password signup — 3 fields only</li>
                    <li><CheckCircle size={16} /> 2FA-protected login for all sessions</li>
                    <li><CheckCircle size={16} /> No deposit required to browse</li>
                  </ul>
                </div>
              </div>

              <div className='elite-step'>
                <div className='elite-step-num'>02</div>
                <div className='elite-step-body'>
                  <span className='step-tag'>Under 24 Hours</span>
                  <h3>Complete KYC verification</h3>
                  <p>Upload a government ID and a selfie. Our team reviews and approves in under 24 hours (usually 2–4 hours).</p>
                  <ul className='elite-step-bullets'>
                    <li><CheckCircle size={16} /> NIN, driver's license, or passport accepted</li>
                    <li><CheckCircle size={16} /> Proof of address + liveness selfie</li>
                    <li><CheckCircle size={16} /> SEC-aligned compliance review</li>
                  </ul>
                </div>
              </div>

              <div className='elite-step'>
                <div className='elite-step-num'>03</div>
                <div className='elite-step-body'>
                  <span className='step-tag'>Instant</span>
                  <h3>Fund your wallet</h3>
                  <p>Deposit via bank transfer (free) or Paystack card (1.5% fee). Funds reflect in your wallet immediately.</p>
                  <ul className='elite-step-bullets'>
                    <li><CheckCircle size={16} /> Bank transfer — instant, no fees</li>
                    <li><CheckCircle size={16} /> Paystack — card, 1.5% processing fee</li>
                    <li><CheckCircle size={16} /> Segregated custodian accounts</li>
                  </ul>
                </div>
              </div>

              <div className='elite-step'>
                <div className='elite-step-num'>04</div>
                <div className='elite-step-body'>
                  <span className='step-tag'>Compounding</span>
                  <h3>Invest and earn</h3>
                  <p>Browse vetted opportunities, select your deal, and watch your capital compound with fixed quarterly returns.</p>
                  <ul className='elite-step-bullets'>
                    <li><CheckCircle size={16} /> Minimum investment from ₦5,000</li>
                    <li><CheckCircle size={16} /> Fixed 12–18% annual yields</li>
                    <li><CheckCircle size={16} /> Quarterly payouts, auto-credited</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className='elite-section elite-section-alt'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>What You Get <span className='elite-gradient-text'>As an Investor</span></h2>
              <p>Every account includes the full BraveVest platform — no tiers, no upsells.</p>
            </div>
            <div className='elite-grid-3'>
              {[
                { icon: Shield, title: 'Asset-backed deals', desc: 'Every investment is collateralized. Your capital is protected by real assets, not promises.' },
                { icon: Percent, title: 'Fixed 12–18% yields', desc: 'Predictable returns, paid quarterly. No trading, no speculation, no volatility.' },
                { icon: Wallet, title: 'Instant withdrawals', desc: 'Withdraw returns to your KYC-verified bank account in 1 business day. No withdrawal fees.' },
                { icon: Users, title: 'Diversified portfolio', desc: 'Spread capital across real estate, energy, agri, and SME deals — starting at ₦5,000 each.' },
                { icon: FileCheck, title: 'Full transparency', desc: 'Every deal, payout, and fee visible in your dashboard in real time. No hidden charges.' },
                { icon: Clock, title: '24-hour KYC', desc: 'Most investors are approved in under 4 hours. Start investing the same day.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className='elite-card'>
                  <div className='elite-card-icon'><Icon size={26} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Common <span className='elite-gradient-text'>Questions</span></h2>
              <p>Quick answers to what investors ask most.</p>
            </div>
            <div className='elite-faq'>
              {[
                { q: 'How do I fund my wallet?', a: 'Go to Wallet → Deposit. Choose bank transfer (free, instant) or Paystack card (1.5% fee). Funds reflect in your wallet immediately.' },
                { q: 'When do returns get paid?', a: 'Returns are paid quarterly to your BraveVest wallet based on the specific deal structure. You see every payout in your statement.' },
                { q: 'What happens if a borrower defaults?', a: 'All projects are collateralized. Our recovery team liquidates collateral to recover investor capital. Since 2023, our default rate is zero.' },
                { q: 'Can I withdraw before the tenor ends?', a: 'Most deals are locked for the full tenor. A secondary market is planned for Q1 2027, but is not yet live.' },
                { q: 'How do I change my bank account?', a: 'For security, withdrawals only go to your KYC-verified bank account. To change it, contact support with documentation.' },
              ].map((f) => (
                <details key={f.q} className='elite-faq-item'>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className='elite-container'>
          <div className='elite-banner bv-hero'>
            <h2 className='elite-title'>Start Earning Today</h2>
            <p>Join 14,250+ investors compounding capital on BraveVest.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to='/register' className='elite-btn elite-btn-gold'>
                Create Free Account <ArrowRight size={17} />
              </Link>
              <Link to='/faq' className='elite-btn elite-btn-outline'>
                Read Full FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}