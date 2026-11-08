import { Link } from 'react-router-dom';
import {
  Shield, BadgeCheck, TrendingUp, Landmark,
  Award, ArrowRight, Users, Clock, Target, Sparkles,
  CheckCircle, Lock,
} from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

.elite-light-root {
  --bg-primary: #FCFBFA;
  --bg-surface: #FFFFFF;
  --border-color: rgba(194, 124, 0, 0.15);
  --gold-primary: #F7A600;
  --gold-dark: #C27C00;
  --gold-light: #FFC94D;
  --gold-gradient: linear-gradient(135deg, #FFC94D 0%, #F7A600 50%, #C27C00 100%);
  --gold-text-gradient: linear-gradient(135deg, #12141A 20%, #C27C00 70%, #F7A600 100%);
  --text-main: #12141A;
  --text-muted: #5A5F73;
  --success-green: #0E9F5B;
  --warm-tint: #FFF8E6;
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
.elite-btn-gold { background: var(--gold-gradient); color: #12141A; box-shadow: 0 16px 32px -10px rgba(247, 166, 0, 0.45); }
.elite-btn-gold:hover { filter: brightness(1.05); box-shadow: 0 20px 40px -8px rgba(247, 166, 0, 0.65); }
.elite-btn-outline { background: #FFFFFF; color: var(--text-main); border-color: rgba(18, 20, 26, 0.15); box-shadow: 0 4px 12px rgba(18, 18, 20, 0.04); }
.elite-btn-outline:hover { background: var(--warm-tint); border-color: var(--gold-primary); color: var(--gold-dark); }

/* ── HERO with image ── */
.elite-hero-about {
  position: relative;
  padding: 120px 0 180px;
  text-align: center;
  color: #FFFFFF;
  background:
    linear-gradient(rgba(18, 18, 20, 0.72), rgba(18, 18, 20, 0.85)),
    url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
  overflow: hidden;
}
.elite-hero-about h1 {
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.08;
  max-width: 900px;
  margin: 0 auto 24px;
  color: #FFFFFF;
}
.elite-hero-about h1 .elite-gradient-text {
  background: linear-gradient(135deg, #FFC94D 0%, #F7A600 50%, #FFE29A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.elite-hero-about p {
  font-size: clamp(17px, 2vw, 20px);
  color: #E4E4E9;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.6;
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

/* ── Stats band floats over hero bottom ── */
.elite-stats-band {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1040px;
  margin: -80px auto 0;
  position: relative;
  z-index: 5;
}
.elite-stat-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(18, 18, 20, 0.08);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.elite-stat-card:hover { border-color: var(--gold-primary); transform: translateY(-4px); box-shadow: 0 24px 48px rgba(194, 124, 0, 0.15); }
.elite-stat-card .value { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--gold-dark); margin-bottom: 6px; }
.elite-stat-card .label { font-size: 13px; color: var(--text-muted); font-weight: 600; }

/* Sections */
.elite-section { padding: 90px 0; position: relative; }
.elite-section-alt { background: #FFFDF7; }
.elite-section-header { text-align: center; max-width: 700px; margin: 0 auto 64px; }
.elite-section-header h2 { font-size: clamp(32px, 4vw, 46px); margin: 0 0 16px; }
.elite-section-header p { color: var(--text-muted); font-size: 17px; line-height: 1.6; margin: 0; }

/* Story Grid */
.elite-story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.elite-story-grid h2 { font-size: clamp(28px, 3.4vw, 42px); margin: 0 0 20px; }
.elite-story-grid p { color: var(--text-muted); font-size: 16px; line-height: 1.75; margin: 0 0 16px; }

.elite-story-visual {
  position: relative;
  padding: 40px;
  background: linear-gradient(145deg, #FFFFFF 0%, #FFFDF7 100%);
  border: 1px solid rgba(247, 166, 0, 0.25);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(18, 18, 20, 0.08);
}
.elite-story-visual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.elite-story-cell {
  padding: 20px;
  background: var(--warm-tint);
  border: 1px solid rgba(247, 166, 0, 0.2);
  border-radius: 16px;
  text-align: left;
}
.elite-story-cell .cell-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--gold-gradient); color: #12141A; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.elite-story-cell .cell-title { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.elite-story-cell .cell-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

/* Mission/Vision */
.elite-mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.elite-mv-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}
.elite-mv-card::before {
  content: ''; position: absolute; top: -80px; right: -80px;
  width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.12) 0%, transparent 70%);
  pointer-events: none;
}
.elite-mv-card:hover { transform: translateY(-6px); border-color: var(--gold-primary); box-shadow: 0 30px 60px rgba(194, 124, 0, 0.12); }
.elite-mv-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: var(--warm-tint);
  border: 1px solid rgba(247, 166, 0, 0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold-dark);
  margin-bottom: 24px;
  transition: all 0.3s;
}
.elite-mv-card:hover .elite-mv-icon { background: var(--gold-gradient); color: #12141A; transform: scale(1.08); }
.elite-mv-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 12px; }
.elite-mv-card p { color: var(--text-muted); font-size: 15px; line-height: 1.7; margin: 0; position: relative; }

/* Values grid */
.elite-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.elite-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.elite-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 36px 32px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 12px 36px rgba(18, 18, 20, 0.05);
  text-align: left;
}
.elite-card:hover { transform: translateY(-8px); border-color: var(--gold-primary); box-shadow: 0 30px 60px rgba(194, 124, 0, 0.12), 0 0 30px rgba(247, 166, 0, 0.1); }
.elite-card-icon {
  width: 64px; height: 64px; border-radius: 18px;
  background: var(--warm-tint); border: 1px solid rgba(247, 166, 0, 0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold-dark); margin-bottom: 24px;
  transition: all 0.3s;
}
.elite-card:hover .elite-card-icon { background: var(--gold-gradient); color: #12141A; transform: scale(1.08); }
.elite-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin: 0 0 10px; }
.elite-card p { color: var(--text-muted); font-size: 15px; line-height: 1.65; margin: 0; }

/* Trust Strip */
.elite-strip { background: #FFFDF7; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 50px 0; text-align: center; }
.elite-logos { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 24px; }
.elite-logo-pill {
  display: inline-flex; align-items: center; gap: 10px;
  background: #FFFFFF; border: 1px solid var(--border-color);
  padding: 12px 24px; border-radius: 99px;
  font-weight: 700; color: var(--text-main); font-size: 15px;
  box-shadow: 0 4px 12px rgba(18, 18, 20, 0.03);
}
.elite-logo-pill svg { color: var(--gold-dark); }

/* Banner */
.elite-banner {
  background: linear-gradient(135deg, #12141A 0%, #1F222B 100%);
  border: 1px solid rgba(247, 166, 0, 0.4);
  border-radius: 36px;
  padding: 72px 48px;
  text-align: center;
  position: relative; overflow: hidden;
  margin: 60px auto 120px;
  color: #FFFFFF;
  box-shadow: 0 30px 80px rgba(18, 18, 20, 0.2);
}
.elite-banner::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.25), transparent 70%);
  pointer-events: none;
}
.elite-banner h2 { font-size: clamp(32px, 4.5vw, 48px); margin: 0 0 16px; color: #FFFFFF; }
.elite-banner p { color: #9BA1B0; font-size: 18px; max-width: 600px; margin: 0 auto 36px; }

@media (max-width: 968px) {
  .elite-hero-about { padding: 72px 0 140px; }
  .elite-stats-band { grid-template-columns: repeat(2, 1fr); margin-top: -60px; }
  .elite-story-grid, .elite-mv-grid { grid-template-columns: 1fr; }
  .elite-grid-3, .elite-grid-4 { grid-template-columns: 1fr; }
  .elite-banner { padding: 48px 24px; }
}
`;

export default function About() {
  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='elite-light-root'>

        {/* HERO with image background */}
        <section className='elite-hero-about'>
          <div className='elite-container'>
            <div className='elite-badge'>
              <Sparkles size={15} />
              <span>About Bravelion Holdings</span>
            </div>
            <h1 className='elite-title'>
              A <span className='elite-gradient-text'>Private Credit</span> Platform Built on Institutional Discipline
            </h1>
            <p>
              BraveVest is the investor-facing arm of Bravelion Holdings — Nigeria's leading private credit and real-asset
              underwriting platform. We connect vetted institutional-grade deals to individual investors.
            </p>
          </div>
        </section>

        {/* Stats band — floats over hero bottom */}
        <div className='elite-container'>
          <div className='elite-stats-band'>
            <div className='elite-stat-card'>
              <div className='value'>₦14.8B</div>
              <div className='label'>Capital Deployed</div>
            </div>
            <div className='elite-stat-card'>
              <div className='value'>14,250+</div>
              <div className='label'>Active Investors</div>
            </div>
            <div className='elite-stat-card'>
              <div className='value'>0.00%</div>
              <div className='label'>Default Rate</div>
            </div>
            <div className='elite-stat-card'>
              <div className='value'>7-Tier</div>
              <div className='label'>Underwriting</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-story-grid'>
              <div>
                <h2 className='elite-title'>
                  We built the credit infrastructure <span className='elite-gradient-text'>Bravelion needed</span>
                </h2>
                <p>
                  Founded in 2023, Bravelion Holdings began as a private credit boutique serving a handful of family offices.
                  After two years of consistent returns, we opened access to individual investors through BraveVest — while
                  maintaining the same institutional discipline that built our reputation.
                </p>
                <p>
                  Every facility we underwrite is secured against tangible assets. Every borrower is verified, tracked, and
                  audited. Every dollar deployed is traceable. We don't trade volatility — we fund the real economy.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                  <Link to='/marketplace' className='elite-btn elite-btn-gold'>
                    Explore Active Deals <ArrowRight size={16} />
                  </Link>
                  <Link to='/contact' className='elite-btn elite-btn-outline'>
                    Talk to Our Team
                  </Link>
                </div>
              </div>

              <div className='elite-story-visual'>
                <div className='elite-story-visual-grid'>
                  {[
                    { icon: Shield, title: 'Secured', desc: 'Every loan is asset-backed with legal enforcement.' },
                    { icon: Clock, title: 'Since 2023', desc: '2+ years of zero-default track record.' },
                    { icon: Users, title: '14K+ Investors', desc: 'From ₦5,000 to ₦50M+ allocations.' },
                    { icon: Award, title: 'Institutional Grade', desc: 'Underwritten to pension-fund standards.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className='elite-story-cell'>
                      <div className='cell-icon'><Icon size={18} /></div>
                      <div className='cell-title'>{title}</div>
                      <div className='cell-desc'>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className='elite-section elite-section-alt'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Mission & <span className='elite-gradient-text'>Vision</span></h2>
              <p>What we're building, and why it matters.</p>
            </div>
            <div className='elite-mv-grid'>
              <div className='elite-mv-card'>
                <div className='elite-mv-icon'><Target size={26} /></div>
                <h3>Our Mission</h3>
                <p>
                  To give every Nigerian investor — regardless of starting capital — access to the same
                  institutional-grade private credit deals that were once reserved for family offices and pension funds.
                </p>
              </div>
              <div className='elite-mv-card'>
                <div className='elite-mv-icon'><Sparkles size={26} /></div>
                <h3>Our Vision</h3>
                <p>
                  To become West Africa's most trusted private credit platform — known for conservative underwriting,
                  transparent reporting, and a compounding track record that stands for decades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className='elite-section'>
          <div className='elite-container'>
            <div className='elite-section-header'>
              <h2 className='elite-title'>Our <span className='elite-gradient-text'>Operating Principles</span></h2>
              <p>The non-negotiables that guide every deal we underwrite.</p>
            </div>
            <div className='elite-grid-3'>
              {[
                { icon: Shield, title: 'Collateralize everything', desc: 'Every facility is backed by tangible assets with legal enforcement mechanisms — no unsecured promises.' },
                { icon: Lock, title: 'Segregate investor funds', desc: 'All capital sits in CBN-licensed custodian accounts. BraveVest never touches investor principal.' },
                { icon: CheckCircle, title: 'Report transparently', desc: 'Every transaction, payout, and fee is visible in your dashboard in real time. No black boxes.' },
                { icon: TrendingUp, title: 'Underwrite conservatively', desc: 'We pass on 60%+ of deals we review. The deals that remain must clear our 7-tier assessment.' },
                { icon: BadgeCheck, title: 'Comply rigorously', desc: 'SEC-aligned KYC, NDPR data protection, and full AML record-keeping on every investor.' },
                { icon: Landmark, title: 'Fund the real economy', desc: 'Every naira deployed funds a real project — solar farms, housing, agri co-ops, and SME expansion.' },
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

        {/* Trust */}
        <div className='elite-strip'>
          <div className='elite-container'>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Institutional Standards & Regulatory Alignment
            </p>
            <div className='elite-logos'>
              <div className='elite-logo-pill'><Shield size={18} /> Bravelion Risk Engine</div>
              <div className='elite-logo-pill'><CheckCircle size={18} /> Paystack Encrypted Gateway</div>
              <div className='elite-logo-pill'><BadgeCheck size={18} /> SEC-Aligned Compliance</div>
              <div className='elite-logo-pill'><Award size={18} /> 0% Default Record</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='elite-container'>
          <div className='elite-banner'>
            <h2 className='elite-title'>Invest alongside Bravelion</h2>
            <p>Join 14,000+ investors earning fixed returns on vetted private credit.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to='/register' className='elite-btn elite-btn-gold'>
                Create Free Account <ArrowRight size={17} />
              </Link>
              <Link to='/marketplace' className='elite-btn elite-btn-outline'>
                View Live Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}