import PageShell from '@/components/shared/PageShell';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const ITEMS = [
  { icon: Lock, title: '256-bit encryption', desc: 'All data encrypted in transit (TLS 1.3) and at rest.' },
  { icon: Shield, title: 'Segregated accounts', desc: 'Investor funds held in segregated accounts with CBN-licensed custodians.' },
  { icon: Eye, title: 'KYC verification', desc: 'Every investor verified. Every project vetted.' },
  { icon: Server, title: 'Paystack secured', desc: 'All payments processed through Paystack.' },
];

const CSS = `
.sc { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.sc * { box-sizing:border-box; }
.sc-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.sc-chip { display:inline-flex; padding:6px 12px; border-radius:6px; background:var(--by-card); border:1px solid var(--by-line); font-size:13px; font-weight:600; color:var(--by-amber); }

.sc-hero { position:relative; overflow:hidden; padding:88px 0 56px; }
.sc-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(600px 360px at 80% 0%, rgba(247,166,0,.2), transparent 70%); }
.sc-glow::after { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--by-line) 1px, transparent 1px), linear-gradient(90deg, var(--by-line) 1px, transparent 1px); background-size:56px 56px; opacity:.45;
  -webkit-mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); }
.sc-hero .sc-wrap { position:relative; }
.sc h1 { font-size:clamp(38px,6vw,68px); font-weight:800; line-height:1.06; letter-spacing:-0.04em; margin:20px 0 0; max-width:860px; }
.sc h1 em { font-style:normal; background:linear-gradient(transparent 62%, rgba(247,166,0,.6) 62%) no-repeat; background-size:0 100%; animation:sc-mark .9s .4s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes sc-mark { to { background-size:100% 100%; } }
@media (prefers-reduced-motion:reduce) { .sc h1 em { animation:none; background-size:100% 100%; } }

.sc-sec { padding:16px 0 112px; }
.sc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
.sc-card { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:32px; transition:border-color .15s, background .15s; }
.sc-card:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.sc-ic { width:48px; height:48px; border-radius:12px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; margin-bottom:24px; }
.sc-card h3 { font-size:20px; font-weight:800; letter-spacing:-0.02em; margin:0 0 8px; }
.sc-card p { font-size:15px; color:var(--by-mute); line-height:1.7; margin:0; max-width:420px; }

@media (max-width:760px) { .sc-hero { padding:56px 0 40px; } .sc-grid { grid-template-columns:1fr; } .sc-sec { padding-bottom:72px; } .sc-card { padding:24px; } }
`;

export default function Security() {
  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='sc'>
        <section className='sc-hero'>
          <div className='sc-glow' aria-hidden='true' />
          <div className='sc-wrap'>
            <span className='sc-chip'>Security</span>
            <h1>Your money is <em>protected</em></h1>
          </div>
        </section>

        <section className='sc-sec'>
          <div className='sc-wrap'>
            <div className='sc-grid'>
              {ITEMS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='sc-card'>
                  <div className='sc-ic'><Icon size={22} /></div>
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