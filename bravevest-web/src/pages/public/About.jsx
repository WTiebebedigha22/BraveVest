import { Link } from 'react-router-dom';
import { Shield, Zap, Users, BookOpen, TrendingUp, Lock, CheckCircle, Target, Sparkles, ArrowRight } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const STATS = [
  { value: '89+', label: 'Countries served' },
  { value: '13K+', label: 'Active investors' },
  { value: '9', label: 'Live projects' },
  { value: '0%', label: 'Default rate' },
];

const PILLARS = [
  { icon: Shield, title: 'Verified projects', desc: 'Every deal vetted' },
  { icon: Lock, title: 'Segregated', desc: 'CBN custodians' },
  { icon: Zap, title: 'Fixed returns', desc: '12–18% annual' },
  { icon: CheckCircle, title: 'SEC-aligned', desc: 'Full KYC' },
];

const PURPOSE = [
  { icon: Target, title: 'Our Mission', text: 'To give every Nigerian investor direct access to institutional-grade fixed income — transparent, collateralized, and starting at ₦5,000.' },
  { icon: Sparkles, title: 'Our Vision', text: "To become Nigeria's most trusted private credit platform — known for conservative underwriting, transparent reporting, and a zero-default track record." },
];

const DELIVER = [
  { icon: Shield, title: 'Collateralized deals', desc: 'Every credit facility is secured.' },
  { icon: Zap, title: 'Traceable payments', desc: 'Paystack + bank transfer only.' },
  { icon: Users, title: 'Real team, real address', desc: 'Bravelion Holdings company.' },
  { icon: BookOpen, title: 'Transparent reporting', desc: 'Every transaction visible.' },
  { icon: TrendingUp, title: 'Fixed returns', desc: '12–18% annual yield.' },
  { icon: CheckCircle, title: 'Zero defaults', desc: 'Since 2023.' },
];

const CSS = `
.ab { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.ab * { box-sizing:border-box; }
.ab-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.ab-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:52px; padding:0 32px; border-radius:8px; font-weight:600; font-size:15px; text-decoration:none; transition:background .15s, border-color .15s, color .15s; }
.ab-btn--y { background:var(--by-yellow); color:#121214; }
.ab-btn--y:hover { background:#FFB82E; }
.ab-btn--g { border:1px solid var(--by-line); color:var(--by-text); background:#fff; }
.ab-btn--g:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.ab-btn:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.ab-chip { display:inline-flex; padding:6px 12px; border-radius:6px; background:var(--by-card); border:1px solid var(--by-line); font-size:13px; font-weight:600; color:var(--by-amber); }

.ab-hero { position:relative; overflow:hidden; padding:88px 0 72px; }
.ab-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(600px 360px at 80% 0%, rgba(247,166,0,.2), transparent 70%); }
.ab-glow::after { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--by-line) 1px, transparent 1px), linear-gradient(90deg, var(--by-line) 1px, transparent 1px); background-size:56px 56px; opacity:.45;
  -webkit-mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); }
.ab-hero .ab-wrap { position:relative; }
.ab h1 { font-size:clamp(38px,6vw,68px); font-weight:800; line-height:1.06; letter-spacing:-0.04em; margin:20px 0 20px; max-width:860px; }
.ab h1 em { font-style:normal; background:linear-gradient(transparent 62%, rgba(247,166,0,.6) 62%) no-repeat; background-size:0 100%; animation:ab-mark .9s .4s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes ab-mark { to { background-size:100% 100%; } }
@media (prefers-reduced-motion:reduce) { .ab h1 em { animation:none; background-size:100% 100%; } }
.ab-sub { font-size:clamp(16px,1.8vw,19px); color:var(--by-mute); line-height:1.7; max-width:680px; margin:0; }

.ab-stats { background:var(--by-card); border-top:1px solid var(--by-line); border-bottom:1px solid var(--by-line); padding:44px 0; }
.ab-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
.ab-stat b { display:block; font-size:clamp(30px,4.2vw,44px); font-weight:800; letter-spacing:-0.02em; font-variant-numeric:tabular-nums; }
.ab-stat span { font-size:14px; color:var(--by-mute); }

.ab-sec { padding:96px 0; }
.ab-sec--soft { background:var(--by-card); }
.ab-title { font-size:clamp(28px,3.6vw,40px); font-weight:800; letter-spacing:-0.025em; line-height:1.1; margin:16px 0 20px; }
.ab-head { margin-bottom:48px; }
.ab-head .ab-title { margin-bottom:0; }
.ab-p { font-size:16px; color:var(--by-mute); line-height:1.75; margin:0 0 16px; max-width:540px; }
.ab-split { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }

.ab-grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
.ab-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.ab-card { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:24px; transition:border-color .15s, background .15s; }
.ab-card:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.ab-sec--soft .ab-card { background:#fff; border-color:var(--by-line); }
.ab-sec--soft .ab-card:hover { border-color:var(--by-yellow); }
.ab-card--lg { padding:32px; }
.ab-ic { width:44px; height:44px; border-radius:10px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
.ab-card h3 { font-size:17px; font-weight:700; margin:0 0 6px; }
.ab-card--lg h3 { font-size:20px; margin-bottom:12px; }
.ab-card p { font-size:14px; color:var(--by-mute); line-height:1.65; margin:0; }
.ab-card--lg p { font-size:15px; line-height:1.7; }

.ab-cta { padding:96px 20px; }
.ab-cta-box { max-width:1200px; margin:0 auto; border-radius:24px; padding:72px 24px; text-align:center; background:linear-gradient(135deg,#FFF1CC 0%,#F5F5F7 65%); border:1px solid var(--by-line); }
.ab-cta-box h2 { font-size:clamp(28px,3.6vw,40px); font-weight:800; letter-spacing:-0.025em; margin:0 0 32px; }
.ab-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

@media (max-width:960px) { .ab-split { grid-template-columns:1fr; gap:40px; } .ab-grid3 { grid-template-columns:repeat(2,1fr); } .ab-stats-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px) { .ab-hero { padding:56px 0 48px; } .ab-sec, .ab-cta { padding:64px 20px; } .ab-sec .ab-wrap { padding:0; } .ab-grid2, .ab-grid3 { grid-template-columns:1fr; } }
`;

export default function About() {
  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='ab'>
        <section className='ab-hero'>
          <div className='ab-glow' aria-hidden='true' />
          <div className='ab-wrap'>
            <span className='ab-chip'>About Us</span>
            <h1>Your trusted partner in <em>private credit investing</em></h1>
            <p className='ab-sub'>
              BraveVest is a private credit marketplace connecting Nigerian investors to vetted, collateralized lending opportunities. Founded to democratize access to institutional-grade fixed income — starting at ₦5,000.
            </p>
          </div>
        </section>

        <section className='ab-stats'>
          <div className='ab-wrap ab-stats-grid'>
            {STATS.map(({ value, label }) => (
              <div key={label} className='ab-stat'><b>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </section>

        <section className='ab-sec'>
          <div className='ab-wrap ab-split'>
            <div>
              <span className='ab-chip'>Who We Are</span>
              <h2 className='ab-title'>A Bravelion Holdings company</h2>
              <p className='ab-p'>
                BraveVest originates, underwrites, and services private credit facilities across energy, real estate, agriculture, and SME trade finance. Every project is vetted, collateralized, and managed by our team.
              </p>
              <p className='ab-p'>
                We partner only with CBN-licensed custodians. All investor funds are held in segregated accounts. All payments process through Paystack.
              </p>
            </div>
            <div className='ab-grid2'>
              {PILLARS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='ab-card'>
                  <div className='ab-ic'><Icon size={20} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='ab-sec ab-sec--soft'>
          <div className='ab-wrap'>
            <div className='ab-head'>
              <span className='ab-chip' style={{ background: '#fff' }}>Our Purpose</span>
              <h2 className='ab-title'>Mission &amp; Vision</h2>
            </div>
            <div className='ab-grid2'>
              {PURPOSE.map(({ icon: Icon, title, text }) => (
                <div key={title} className='ab-card ab-card--lg'>
                  <div className='ab-ic'><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='ab-sec'>
          <div className='ab-wrap'>
            <div className='ab-head'>
              <span className='ab-chip'>Why BraveVest</span>
              <h2 className='ab-title'>What we actually deliver</h2>
            </div>
            <div className='ab-grid3'>
              {DELIVER.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='ab-card'>
                  <div className='ab-ic'><Icon size={20} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='ab-cta'>
          <div className='ab-cta-box'>
            <h2>Ready to start investing?</h2>
            <div className='ab-cta-btns'>
              <Link to='/register' className='ab-btn ab-btn--y'>Create free account <ArrowRight size={16} /></Link>
              <Link to='/marketplace' className='ab-btn ab-btn--g'>View live deals</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}