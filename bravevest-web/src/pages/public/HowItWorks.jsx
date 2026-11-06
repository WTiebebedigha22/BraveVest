import { Link } from 'react-router-dom';
import { UserPlus, Search, ShieldCheck, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const STEPS = [
  { icon: UserPlus, title: 'Create an Account', desc: 'Sign up in minutes. Verify your identity to unlock full platform features.' },
  { icon: Search, title: 'Browse Markets', desc: 'Explore vetted private credit, real estate, and SME deals across Nigeria.' },
  { icon: ShieldCheck, title: 'Fund Your Wallet', desc: 'Deposit Naira or USD directly into your BraveVest wallet via bank transfer.' },
  { icon: TrendingUp, title: 'Invest & Earn', desc: 'Select a deal, invest your capital, and watch your fixed returns accrue.' },
];

const BENEFITS = [
  'Diversified access to real-world assets',
  'Fixed, contractually-defined returns',
  'Institutional-grade underwriting',
  'No hidden fees or complex derivatives',
];

const CSS = `
.hw { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.hw * { box-sizing:border-box; }
.hw-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.hw-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:52px; padding:0 32px; border-radius:8px; font-weight:600; font-size:15px; text-decoration:none; background:var(--by-yellow); color:#121214; transition:background .15s; }
.hw-btn:hover { background:#FFB82E; }
.hw-btn:focus-visible { outline:2px solid #121214; outline-offset:2px; }

.hw-hero { position:relative; overflow:hidden; padding:88px 0 72px; }
.hw-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(600px 360px at 80% 0%, rgba(247,166,0,.2), transparent 70%); }
.hw-glow::after { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--by-line) 1px, transparent 1px), linear-gradient(90deg, var(--by-line) 1px, transparent 1px); background-size:56px 56px; opacity:.45;
  -webkit-mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); }
.hw-hero .hw-wrap { position:relative; }
.hw-chip { display:inline-flex; padding:6px 12px; border-radius:6px; background:var(--by-card); border:1px solid var(--by-line); font-size:13px; font-weight:600; color:var(--by-amber); }
.hw h1 { font-size:clamp(40px,6.4vw,72px); font-weight:800; line-height:1.05; letter-spacing:-0.04em; margin:20px 0 20px; max-width:820px; }
.hw h1 em { font-style:normal; background:linear-gradient(transparent 62%, rgba(247,166,0,.6) 62%) no-repeat; background-size:0 100%; animation:hw-mark .9s .4s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes hw-mark { to { background-size:100% 100%; } }
@media (prefers-reduced-motion:reduce) { .hw h1 em { animation:none; background-size:100% 100%; } }
.hw-sub { font-size:clamp(16px,1.8vw,19px); color:var(--by-mute); line-height:1.65; max-width:600px; margin:0; }

.hw-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; padding-bottom:96px; }
.hw-step { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:28px 24px; transition:border-color .15s, background .15s; }
.hw-step:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.hw-step-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
.hw-ic { width:44px; height:44px; border-radius:10px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; }
.hw-n { font-size:44px; font-weight:800; line-height:1; letter-spacing:-0.04em; color:var(--by-amber); }
.hw-step h3 { font-size:18px; font-weight:700; margin:0 0 8px; }
.hw-step p { font-size:14px; color:var(--by-mute); line-height:1.65; margin:0; }

.hw-deep { background:var(--by-card); padding:96px 0; }
.hw-deep-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
.hw-title { font-size:clamp(28px,3.6vw,40px); font-weight:800; letter-spacing:-0.025em; line-height:1.1; margin:16px 0 20px; }
.hw-p { font-size:16px; color:var(--by-mute); line-height:1.7; margin:0 0 32px; max-width:520px; }
.hw-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:16px; }
.hw-list li { display:flex; align-items:center; gap:12px; font-size:15px; font-weight:600; }
.hw-list svg { color:var(--by-green); flex:none; }

.hw-deal { background:#fff; border:1px solid var(--by-line); border-radius:20px; padding:32px; box-shadow:0 24px 60px -20px rgba(18,18,20,.18); }
.hw-deal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:13px; color:var(--by-mute); font-weight:500; }
.hw-deal-head span { color:var(--by-green); background:rgba(14,159,91,.1); padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; }
.hw-deal h3 { font-size:26px; font-weight:800; letter-spacing:-0.02em; margin:0 0 24px; }
.hw-row { display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-top:1px solid var(--by-line); font-size:15px; color:var(--by-mute); }
.hw-row b { color:var(--by-text); font-weight:700; font-variant-numeric:tabular-nums; }
.hw-row b.g { color:var(--by-green); font-size:20px; }
.hw-badge { color:var(--by-amber)!important; background:rgba(247,166,0,.16); padding:2px 10px; border-radius:6px; }
.hw-prog { margin:20px 0 28px; }
.hw-prog-top { display:flex; justify-content:space-between; font-size:12px; color:var(--by-mute); margin-bottom:8px; }
.hw-bar { height:8px; border-radius:99px; background:var(--by-line); overflow:hidden; }
.hw-bar i { display:block; width:72%; height:100%; background:var(--by-yellow); border-radius:99px; }
.hw-deal .hw-btn { width:100%; }

.hw-cta { padding:96px 20px; }
.hw-cta-box { max-width:1200px; margin:0 auto; border-radius:24px; padding:72px 24px; text-align:center; background:linear-gradient(135deg,#FFF1CC 0%,#F5F5F7 65%); border:1px solid var(--by-line); }
.hw-cta-box h2 { font-size:clamp(28px,3.6vw,40px); font-weight:800; letter-spacing:-0.025em; margin:0 0 12px; }
.hw-cta-box p { color:var(--by-mute); font-size:16px; margin:0 0 32px; }

@media (max-width:960px) { .hw-steps { grid-template-columns:repeat(2,1fr); } .hw-deep-grid { grid-template-columns:1fr; gap:40px; } }
@media (max-width:560px) { .hw-hero { padding:56px 0 48px; } .hw-steps { grid-template-columns:1fr; padding-bottom:64px; } .hw-deep, .hw-cta { padding:64px 20px; } .hw-deep .hw-wrap { padding:0; } .hw-deep-grid { padding:0 20px; } }
`;

export default function HowItWorks() {
  return (
    <PageShell theme='light'>
      <style>{CSS}</style>
      <div className='hw'>
        <section className='hw-hero'>
          <div className='hw-glow' aria-hidden='true' />
          <div className='hw-wrap'>
            <span className='hw-chip'>How It Works</span>
            <h1>Your journey to <em>fixed returns.</em></h1>
            <p className='hw-sub'>
              BraveVest bridges the gap between discerning investors and Africa's most resilient private credit opportunities.
            </p>
          </div>
        </section>

        <section>
          <div className='hw-wrap'>
            <div className='hw-steps'>
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className='hw-step'>
                  <div className='hw-step-top'>
                    <div className='hw-ic'><Icon size={22} /></div>
                    <div className='hw-n'>{i + 1}</div>
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='hw-deep'>
          <div className='hw-wrap hw-deep-grid'>
            <div>
              <span className='hw-chip' style={{ background: '#fff' }}>Why BraveVest</span>
              <h2 className='hw-title'>A better way to build your portfolio.</h2>
              <p className='hw-p'>
                Traditional savings accounts erode your wealth. Equities are volatile. BraveVest offers a third path: fixed-income private credit, backed by real assets.
              </p>
              <ul className='hw-list'>
                {BENEFITS.map((b) => (
                  <li key={b}><CheckCircle2 size={20} /> {b}</li>
                ))}
              </ul>
            </div>

            <div className='hw-deal'>
              <div className='hw-deal-head'>Sample Investment <span>Fixed return</span></div>
              <h3>Lagos Solar Fund II</h3>
              <div className='hw-row'><span>Expected Yield</span><b className='g'>14.5% APY</b></div>
              <div className='hw-row'><span>Tenor</span><b>18 Months</b></div>
              <div className='hw-row'><span>Risk Rating</span><b className='hw-badge'>A</b></div>
              <div className='hw-prog'>
                <div className='hw-prog-top'><span>Funded: 72%</span><span>₦50,000 min</span></div>
                <div className='hw-bar' role='progressbar' aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} aria-label='Funded'><i /></div>
              </div>
              <Link to='/marketplace' className='hw-btn'>Explore Deals <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>

        <section className='hw-cta'>
          <div className='hw-cta-box'>
            <h2>Ready to get started?</h2>
            <p>Join 52,000+ investors earning fixed returns on BraveVest.</p>
            <Link to='/register' className='hw-btn'>Create Free Account</Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}