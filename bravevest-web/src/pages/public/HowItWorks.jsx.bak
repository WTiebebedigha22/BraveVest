import { Link } from 'react-router-dom';
import { UserPlus, Search, ShieldCheck, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { 
    icon: UserPlus, 
    title: 'Create an Account', 
    desc: 'Sign up in minutes. Verify your identity to unlock full platform features.' 
  },
  { 
    icon: Search, 
    title: 'Browse Markets', 
    desc: 'Explore vetted private credit, real estate, and SME deals across Nigeria.' 
  },
  { 
    icon: ShieldCheck, 
    title: 'Fund Your Wallet', 
    desc: 'Deposit Naira or USD directly into your BraveVest wallet via bank transfer.' 
  },
  { 
    icon: TrendingUp, 
    title: 'Invest & Earn', 
    desc: 'Select a deal, invest your capital, and watch your fixed returns accrue.' 
  },
];

const BENEFITS = [
  'Diversified access to real-world assets',
  'Fixed, contractually-defined returns',
  'Institutional-grade underwriting',
  'No hidden fees or complex derivatives'
];

export default function HowItWorks() {
  return (
    <div className="page-light" style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '80px 0 64px', textAlign: 'center', background: '#fff' }}>
        <div className="container container--narrow">
          <span className="orange-line-accent" style={{ justifyContent: 'center' }}>How It Works</span>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px', color: '#111' }}>
            Your journey to fixed returns.
          </h1>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            BraveVest bridges the gap between discerning investors and Africa's most resilient private credit opportunities.
          </p>
        </div>
      </section>

      {/* Steps Grid */}
      <section style={{ padding: '0 0 64px', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="grid-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} style={{ position: 'relative', padding: '32px 24px', background: '#FAFAFA', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
                  <div style={{ position: 'absolute', top: '-16px', left: '24px', width: '32px', height: '32px', background: '#F6A500', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: '4px solid #fff' }}>
                    {i + 1}
                  </div>
                  <Icon size={28} color="#F6A500" style={{ marginBottom: '20px', marginTop: '8px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section style={{ padding: '64px 0', background: '#FAFAFA' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Text */}
            <div>
              <span className="orange-line-accent">Why BraveVest</span>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#111' }}>
                A better way to build your portfolio.
              </h2>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, marginBottom: '32px' }}>
                Traditional savings accounts erode your wealth. Equities are volatile. BraveVest offers a third path: fixed-income private credit, backed by real assets.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {BENEFITS.map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={20} color="#0ECB81" />
                    <span style={{ fontSize: '15px', color: '#111', fontWeight: '500' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #EAEAEA' }}>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Sample Investment</div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '24px' }}>Lagos Solar Fund II</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA' }}>
                <span style={{ color: '#666' }}>Expected Yield</span>
                <span style={{ fontWeight: '700', color: '#0ECB81', fontSize: '18px' }}>14.5% APY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA' }}>
                <span style={{ color: '#666' }}>Tenor</span>
                <span style={{ fontWeight: '600', color: '#111' }}>18 Months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <span style={{ color: '#666' }}>Risk Rating</span>
                <span style={{ fontWeight: '600', color: '#F6A500', background: 'rgba(246,165,0,0.1)', padding: '2px 8px', borderRadius: '4px' }}>A</span>
              </div>

              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                <span>Funded: 72%</span>
                <span>₦50,000 min</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F5F5F5', borderRadius: '4px', marginBottom: '32px' }}>
                <div style={{ width: '72%', height: '100%', background: '#F6A500', borderRadius: '4px' }}></div>
              </div>

              <Link to="/marketplace" className="btn btn--primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                Explore Deals <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ padding: '80px 0', background: '#fff', textAlign: 'center', borderTop: '1px solid #EAEAEA' }}>
        <div className="container container--narrow">
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#111' }}>Ready to get started?</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>Join 52,000+ investors earning fixed returns on BraveVest.</p>
          <Link to="/register" className="btn btn--primary" style={{ padding: '16px 48px', fontSize: '16px' }}>Create Free Account</Link>
        </div>
      </section>

    </div>
  );
}