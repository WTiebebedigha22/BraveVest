import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, Shield, ArrowRight, Sparkles, PieChart, Zap, CheckCircle, Users } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.by-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:48px; padding:0 28px; border-radius:8px; font-weight:600; font-size:15px; text-decoration:none; border:0; cursor:pointer; transition:background .15s, border-color .15s; }
.by-btn--y { background:var(--by-yellow); color:#121214; }
.by-btn--y:hover { background:#FFB82E; }
.by-btn--g { background:transparent; color:var(--by-text); border:1px solid var(--by-line); }
.by-btn--g:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.by-btn:focus-visible, .by-input:focus-visible { outline:2px solid var(--by-yellow); outline-offset:2px; }

.by-hero { padding:88px 0 72px; }
.by-hero-grid { display:grid; grid-template-columns:1.15fr .85fr; gap:56px; align-items:center; }
.by-chip { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:6px; background:var(--by-card); border:1px solid var(--by-line); font-size:13px; font-weight:500; color:var(--by-amber); }
.by-dot { width:7px; height:7px; border-radius:50%; background:var(--by-green); box-shadow:0 0 0 0 rgba(32,178,108,.6); animation:by-pulse 2s infinite; }
@keyframes by-pulse { 70% { box-shadow:0 0 0 8px rgba(32,178,108,0); } 100% { box-shadow:0 0 0 0 rgba(32,178,108,0); } }
@media (prefers-reduced-motion:reduce) { .by-dot { animation:none; } }
.by h1 { font-size:clamp(40px,6.4vw,72px); font-weight:800; line-height:1.04; letter-spacing:-0.035em; margin:20px 0 20px; }
.by h1 em { font-style:normal; color:var(--by-amber); }
.by-sub { font-size:clamp(16px,1.8vw,18px); color:var(--by-mute); line-height:1.65; max-width:560px; margin:0 0 32px; }
.by-signup { display:flex; gap:10px; max-width:520px; margin-bottom:14px; }
.by-input { flex:1; min-width:0; height:48px; padding:0 16px; border-radius:8px; background:var(--by-card); border:1px solid var(--by-line); color:var(--by-text); font-size:15px; }
.by-input::placeholder { color:var(--by-mute); }
.by-input:focus { border-color:var(--by-yellow); }
.by-alt { display:flex; gap:20px; font-size:14px; }
.by-alt a { color:var(--by-mute); text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
.by-alt a:hover { color:var(--by-amber); }

.by-panel { background:var(--by-card); border:1px solid var(--by-line); border-radius:16px; padding:8px; }
.by-panel-head { display:flex; justify-content:space-between; align-items:center; padding:14px 16px 10px; font-size:14px; font-weight:600; }
.by-panel-head span { color:var(--by-mute); font-weight:500; font-size:12px; }
.by-row { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:10px; }
.by-row:hover { background:var(--by-card2); }
.by-row .ic { width:36px; height:36px; border-radius:50%; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; flex:none; }
.by-row b { font-size:14px; font-weight:600; flex:1; }
.by-row .v { font-size:14px; font-weight:600; color:var(--by-green); font-variant-numeric:tabular-nums; }

.by-stats { background:var(--by-card); border-top:1px solid var(--by-line); border-bottom:1px solid var(--by-line); padding:44px 0; }
.by-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
.by-stat b { display:block; font-size:clamp(30px,4.2vw,44px); font-weight:800; letter-spacing:-0.02em; font-variant-numeric:tabular-nums; }
.by-stat span { font-size:14px; color:var(--by-mute); }

.by-sec { padding:96px 0; }
.by-title { font-size:clamp(28px,3.6vw,40px); font-weight:800; letter-spacing:-0.025em; margin:0 0 12px; }
.by-title em { font-style:normal; color:var(--by-amber); }
.by-lede { color:var(--by-mute); font-size:16px; margin:0 0 48px; }
.by-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.by-card { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:28px; transition:border-color .15s, background .15s; }
.by-card:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.by-card .ic { width:44px; height:44px; border-radius:10px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
.by-card h3 { font-size:18px; font-weight:700; margin:0 0 8px; }
.by-card p { font-size:14px; line-height:1.65; color:var(--by-mute); margin:0; }

.by-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.by-step { background:var(--by-card); border-radius:16px; padding:28px; position:relative; }
.by-step .n { font-size:56px; font-weight:800; color:var(--by-amber); line-height:1; letter-spacing:-0.04em; margin-bottom:20px; }
.by-step h3 { font-size:18px; font-weight:700; margin:0 0 8px; }
.by-step p { font-size:14px; color:var(--by-mute); line-height:1.6; margin:0; }

.by-cta { margin:0 20px 96px; }
.by-cta-box { max-width:1200px; margin:0 auto; border-radius:24px; padding:72px 24px; text-align:center; background:linear-gradient(135deg,#FFF1CC 0%,#F5F5F7 65%); border:1px solid var(--by-line); }
.by-cta-box p { color:var(--by-mute); font-size:16px; line-height:1.6; margin:0 0 32px; }
.by-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

@media (max-width:900px) {
  .by-hero { padding:56px 0 48px; }
  .by-hero-grid { grid-template-columns:1fr; gap:40px; }
  .by-grid3, .by-steps { grid-template-columns:1fr; }
  .by-stats-grid { grid-template-columns:repeat(2,1fr); }
  .by-sec { padding:64px 0; }
}
@media (max-width:480px) { .by-signup { flex-direction:column; } .by-signup .by-btn { width:100%; } }

.by-hero { position:relative; overflow:hidden; padding:80px 0 56px; }
.by-glow { position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(600px 400px at 85% 25%, rgba(247,166,0,.22), transparent 70%), radial-gradient(500px 300px at 0% 0%, rgba(247,166,0,.08), transparent 70%); }
.by-glow::after { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--by-line) 1px, transparent 1px), linear-gradient(90deg, var(--by-line) 1px, transparent 1px); background-size:56px 56px; opacity:.45;
  -webkit-mask-image:radial-gradient(ellipse at 70% 30%, #000 0%, transparent 70%); mask-image:radial-gradient(ellipse at 70% 30%, #000 0%, transparent 70%); }
.by-hero .by-wrap { position:relative; }
.by-hero h1 { font-size:clamp(44px,7vw,84px); letter-spacing:-0.04em; }
.by-hero h1 em { color:var(--by-text); background:linear-gradient(transparent 62%, rgba(247,166,0,.6) 62%) no-repeat; background-size:0 100%; animation:by-mark .9s .6s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes by-mark { to { background-size:100% 100%; } }
.by-rise { opacity:0; transform:translateY(16px); animation:by-rise .7s cubic-bezier(.2,.8,.2,1) forwards; }
.by-rise--2 { animation-delay:.2s; }
@keyframes by-rise { to { opacity:1; transform:none; } }
@media (prefers-reduced-motion:reduce) { .by-rise { opacity:1; transform:none; animation:none; } .by-hero h1 em { animation:none; background-size:100% 100%; } }

.by-calc { background:#fff; border:1px solid var(--by-line); border-radius:20px; padding:24px; box-shadow:0 24px 60px -20px rgba(18,18,20,.18); }
.by-calc-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; font-weight:700; font-size:16px; }
.by-calc-head span { font-size:12px; font-weight:600; color:var(--by-green); background:rgba(14,159,91,.1); padding:4px 10px; border-radius:6px; }
.by-lbl { display:flex; justify-content:space-between; font-size:13px; color:var(--by-mute); margin-bottom:8px; }
.by-lbl b { color:var(--by-text); font-weight:700; }
.by-amt { display:flex; align-items:center; height:56px; border-radius:10px; border:1px solid var(--by-line); background:var(--by-card); padding:0 16px; gap:8px; }
.by-amt:focus-within { border-color:var(--by-yellow); background:#fff; }
.by-amt span { font-size:22px; font-weight:700; color:var(--by-mute); }
.by-amt input { flex:1; min-width:0; border:0; background:transparent; font-size:26px; font-weight:800; color:var(--by-text); letter-spacing:-0.02em; font-variant-numeric:tabular-nums; outline:none; }
.by-chips { display:flex; gap:8px; flex-wrap:wrap; margin:12px 0 24px; }
.by-qchip { height:32px; padding:0 12px; border-radius:6px; border:1px solid var(--by-line); background:#fff; font-size:13px; font-weight:600; color:var(--by-text); cursor:pointer; }
.by-qchip:hover, .by-qchip[aria-pressed='true'] { border-color:var(--by-yellow); background:rgba(247,166,0,.12); }
.by-range { width:100%; accent-color:var(--by-yellow); margin:4px 0 24px; height:4px; cursor:pointer; }
.by-result { background:var(--by-card); border-radius:12px; padding:18px; margin-bottom:16px; }
.by-result-top { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:14px; }
.by-result small { display:block; font-size:12px; color:var(--by-mute); margin-bottom:4px; }
.by-earn { font-size:30px; font-weight:800; color:var(--by-green); letter-spacing:-0.03em; font-variant-numeric:tabular-nums; line-height:1; }
.by-total { font-size:15px; font-weight:700; font-variant-numeric:tabular-nums; text-align:right; }
.by-bar { display:flex; height:8px; border-radius:99px; overflow:hidden; background:var(--by-line); }
.by-bar i { display:block; height:100%; transition:width .3s ease; }
.by-bar i:first-child { background:#121214; }
.by-bar i:last-child { background:var(--by-yellow); }
.by-legend { display:flex; gap:16px; margin-top:10px; font-size:12px; color:var(--by-mute); }
.by-legend span::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:6px; background:#121214; }
.by-legend span:last-child::before { background:var(--by-yellow); }
.by-calc .by-btn { width:100%; }
.by-note { font-size:11px; color:var(--by-mute); text-align:center; margin:12px 0 0; line-height:1.5; }
.by-warn { color:#C0392B; font-size:12px; margin:-16px 0 16px; }

.by-trust { display:flex; gap:12px 36px; flex-wrap:wrap; margin-top:56px; padding-top:28px; border-top:1px solid var(--by-line); }
.by-trust span { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:var(--by-mute); }
.by-trust svg { color:var(--by-amber); }
@media (max-width:900px) { .by-hero { padding:48px 0 40px; } .by-trust { margin-top:40px; } }
`;

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(15);
  const fmt = (n) => '₦' + Math.round(n).toLocaleString('en-NG');
  const valid = amount >= 5000;
  const earn = (amount * rate) / 100;
  const principalPct = (amount / (amount + earn)) * 100;
  const quick = [5000, 50000, 250000, 1000000];
  const navigate = useNavigate();
  const onSignup = (e) => {
    e.preventDefault();
    navigate('/register', { state: { email } });
  };

  const trust = [
    { label: 'Bravelion Holdings', icon: Shield },
    { label: 'Paystack Secured', icon: CheckCircle },
    { label: 'SEC-aligned KYC', icon: Shield },
    { label: '0 Defaults Since 2023', icon: TrendingUp },
  ];
  const features = [
    { icon: TrendingUp, title: 'Investments', desc: 'Fixed-return private credit deals from ₦5,000.' },
    { icon: PieChart, title: 'Portfolio', desc: 'Track performance, allocation, and payouts in real time.' },
    { icon: Wallet, title: 'Wallet', desc: 'Deposit via bank transfer or Paystack. Withdraw anytime.' },
    { icon: Shield, title: 'Verified deals', desc: 'Every project vetted by Bravelion Capital.' },
    { icon: Zap, title: 'Fixed returns', desc: '12–18% annual yield. Not signals — real credit.' },
    { icon: Users, title: 'Referral', desc: 'Earn 1% of every investment from people you refer.' },
  ];
  const stats = [
    { value: '89+', label: 'Countries served' },
    { value: '13K+', label: 'Active investors' },
    { value: '4.8', label: 'Avg. investor rating' },
    { value: '0%', label: 'Default rate since 2023' },
  ];
  const steps = [
    { n: '01', title: 'Register', desc: 'Create your free account with an email.' },
    { n: '02', title: 'Verify KYC', desc: 'Upload your ID — done in under 24 hours.' },
    { n: '03', title: 'Invest', desc: 'Fund your wallet, pick a deal, earn returns.' },
  ];

  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='by'>
        {/* Hero */}
        <section className='by-hero'>
          <div className='by-glow' aria-hidden='true' />
          <div className='by-wrap by-hero-grid'>
            <div className='by-rise'>
              <span className='by-chip'><span className='by-dot' /> Verified investment marketplace</span>
              <h1>Invest. Trade. <em>Build wealth.</em></h1>
              <p className='by-sub'>
                Direct access to vetted Nigerian private credit, real estate, and SME opportunities. Verified by Bravelion Capital. Starting at ₦5,000.
              </p>
              <form className='by-signup' onSubmit={onSignup}>
                <input
                  className='by-input'
                  type='email'
                  placeholder='Enter your email'
                  aria-label='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type='submit' className='by-btn by-btn--y'>Create free account</button>
              </form>
              <div className='by-alt'>
                <Link to='/marketplace'>Browse opportunities <ArrowRight size={14} /></Link>
                <Link to='/about'>How it works</Link>
              </div>
            </div>

            <aside className='by-calc by-rise by-rise--2' aria-label='Returns calculator'>
              <div className='by-calc-head'>See what you could earn <span>Fixed returns</span></div>

              <label className='by-lbl' htmlFor='by-amount'>Investment amount</label>
              <div className='by-amt'>
                <span>₦</span>
                <input
                  id='by-amount'
                  inputMode='numeric'
                  value={amount ? amount.toLocaleString('en-NG') : ''}
                  onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
                />
              </div>
              <div className='by-chips'>
                {quick.map((q) => (
                  <button key={q} type='button' className='by-qchip' aria-pressed={amount === q} onClick={() => setAmount(q)}>
                    {fmt(q)}
                  </button>
                ))}
              </div>
              {!valid && <p className='by-warn'>Minimum investment is ₦5,000.</p>}

              <div className='by-lbl'><span>Annual yield</span><b>{rate}%</b></div>
              <input
                className='by-range'
                type='range'
                min='12'
                max='18'
                step='0.5'
                value={rate}
                aria-label='Annual yield percentage'
                onChange={(e) => setRate(Number(e.target.value))}
              />

              <div className='by-result'>
                <div className='by-result-top'>
                  <div>
                    <small>Earnings in 12 months</small>
                    <div className='by-earn'>+{fmt(valid ? earn : 0)}</div>
                  </div>
                  <div>
                    <small style={{ textAlign: 'right' }}>Total value</small>
                    <div className='by-total'>{fmt(valid ? amount + earn : 0)}</div>
                  </div>
                </div>
                <div className='by-bar' aria-hidden='true'>
                  <i style={{ width: `${valid ? principalPct : 100}%` }} />
                  <i style={{ width: `${valid ? 100 - principalPct : 0}%` }} />
                </div>
                <div className='by-legend'><span>Your capital</span><span>Your return</span></div>
              </div>

              <Link to='/register' state={{ amount, email }} className='by-btn by-btn--y'>
                Start with {fmt(valid ? amount : 5000)} <ArrowRight size={16} />
              </Link>
              <p className='by-note'>Illustration only. Actual yield depends on the deal you choose.</p>
            </aside>
          </div>

          <div className='by-wrap'>
            <div className='by-trust'>
              {trust.map(({ label, icon: Icon }) => (
                <span key={label}><Icon size={16} /> {label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className='by-stats'>
          <div className='by-wrap by-stats-grid'>
            {stats.map(({ value, label }) => (
              <div key={label} className='by-stat'>
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className='by-sec'>
          <div className='by-wrap'>
            <h2 className='by-title'>An entire investment <em>operating system</em></h2>
            <p className='by-lede'>Everything in one place</p>
            <div className='by-grid3'>
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='by-card'>
                  <div className='ic'><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className='by-sec' style={{ paddingTop: 0 }}>
          <div className='by-wrap'>
            <h2 className='by-title'>Start investing in <em>under 5 minutes</em></h2>
            <p className='by-lede'>3 simple steps</p>
            <div className='by-steps'>
              {steps.map(({ n, title, desc }) => (
                <div key={n} className='by-step'>
                  <div className='n'>{n}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='by-cta'>
          <div className='by-cta-box'>
            <Sparkles size={32} color='#C27C00' style={{ marginBottom: 16 }} />
            <h2 className='by-title'>Ready to start <em>building wealth</em>?</h2>
            <p>Join thousands of Nigerian investors earning fixed returns on vetted opportunities.</p>
            <div className='by-cta-btns'>
              <Link to='/register' className='by-btn by-btn--y'>Create free account <ArrowRight size={16} /></Link>
              <Link to='/marketplace' className='by-btn by-btn--g'>View live deals</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}