import PageShell from '@/components/shared/PageShell';
import { Shield, Lock, Eye, Server, CheckCircle2 } from 'lucide-react';

const ITEMS = [
  { icon: Lock, title: '256-bit encryption', desc: 'All data encrypted in transit (TLS 1.3) and at rest using military-grade security protocols.' },
  { icon: Shield, title: 'Segregated accounts', desc: 'Investor funds held safely in segregated accounts with CBN-licensed institutional custodians.' },
  { icon: Eye, title: 'KYC & AML verification', desc: 'Every investor is verified. Every private credit project is rigorously vetted prior to listing.' },
  { icon: Server, title: 'Paystack secured', desc: 'All transactions and payment flows are securely processed through PCI-DSS Level 1 certified gateways.' },
];

const CSS = `
.sc { --by-bg:#FFFFFF; --by-card:#F9F9FB; --by-card2:#F5F5F7; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.sc * { box-sizing:border-box; }
.sc-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }

/* Hero Section with Professional Financial Background & Dark Overlay */
.sc-hero { position:relative; overflow:hidden; padding:96px 0 80px; background-color:#121214; color:#FFFFFF; text-align:center; }
.sc-hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.35; filter:brightness(0.8); }
.sc-hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(18,18,20,0.6) 0%, rgba(18,18,20,0.85) 100%); }
.sc-hero .sc-wrap { position:relative; z-index:2; max-width:800px; }
.sc-chip { display:inline-flex; padding:6px 14px; border-radius:6px; background:rgba(247,166,0,0.15); border:1px solid rgba(247,166,0,0.3); font-size:13px; font-weight:700; color:var(--by-yellow); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:16px; }
.sc h1 { font-size:clamp(38px,6vw,68px); font-weight:800; line-height:1.06; letter-spacing:-0.04em; margin:0 0 16px; }
.sc h1 em { font-style:normal; color:var(--by-yellow); }
.sc-sub { font-size:clamp(16px, 1.8vw, 19px); color:#D1D5DB; line-height:1.65; margin:0 auto; max-width:640px; }

/* Security Cards Grid */
.sc-sec { padding:72px 0 112px; background:var(--by-bg); }
.sc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
.sc-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:36px; transition:border-color .2s, background .2s, transform .2s, box-shadow .2s; box-shadow:0 10px 30px -10px rgba(18,18,20,0.04); }
.sc-card:hover { border-color:var(--by-yellow); background:#FFFFFF; transform:translateY(-3px); box-shadow:0 20px 40px -15px rgba(247,166,0,0.15); }
.sc-ic { width:52px; height:52px; border-radius:14px; background:rgba(247,166,0,0.15); color:var(--by-amber); display:flex; align-items:center; justify-content:center; margin-bottom:24px; }
.sc-card h3 { font-size:22px; font-weight:800; letter-spacing:-0.02em; margin:0 0 10px; color:var(--by-text); }
.sc-card p { font-size:15px; color:var(--by-mute); line-height:1.7; margin:0; }

@media (max-width:760px) { .sc-hero { padding:72px 0 60px; } .sc-grid { grid-template-columns:1fr; } .sc-sec { padding:48px 0 72px; } .sc-card { padding:24px; } }
`;

export default function Security() {
  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='sc'>
        {/* Hero Section with Professional Financial Background & Dark Overlay */}
        <section className='sc-hero'>
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80" 
            alt="Cyber security and vault protection" 
            className='sc-hero-bg' 
          />
          <div className='sc-hero-overlay' />
          <div className='sc-wrap'>
            <span className='sc-chip'>Platform Security</span>
            <h1>Your capital is <em>protected</em></h1>
            <p className='sc-sub'>
              We employ institutional-grade security measures, bank-level encryption, and strict regulatory compliance to safeguard every investment.
            </p>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className='sc-sec'>
          <div className='sc-wrap'>
            <div className='sc-grid'>
              {ITEMS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='sc-card'>
                  <div className='sc-ic'><Icon size={24} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}