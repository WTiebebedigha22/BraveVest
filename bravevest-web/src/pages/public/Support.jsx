import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.by-page { padding:72px 0 96px; }
.by-eyebrow { font-size:13px; font-weight:600; color:var(--by-amber); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:12px; }
.by-page h1 { font-size:clamp(36px,5vw,56px); font-weight:800; letter-spacing:-0.03em; margin:0 0 16px; line-height:1.08; }
.by-page h1 em { font-style:normal; color:var(--by-amber); }
.by-page .by-lede { font-size:17px; color:var(--by-mute); line-height:1.6; max-width:600px; margin:0 0 48px; }
.by-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:48px; }
.by-tile { background:var(--by-card); border:1px solid transparent; border-radius:16px; padding:28px; text-decoration:none; color:inherit; display:block; transition:border-color .15s, background .15s; }
.by-tile:hover { border-color:var(--by-yellow); background:var(--by-card2); }
.by-tile .ic { width:44px; height:44px; border-radius:10px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
.by-tile h3 { font-size:18px; font-weight:700; margin:0 0 8px; }
.by-tile p { font-size:14px; line-height:1.65; color:var(--by-mute); margin:0 0 16px; }
.by-tile .more { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--by-amber); }
.by-sec { padding:48px 0; }
.by-sec h2 { font-size:clamp(24px,3vw,32px); font-weight:800; letter-spacing:-0.025em; margin:0 0 12px; }
.by-sec .by-sub { color:var(--by-mute); font-size:16px; margin:0 0 32px; }
.by-faq { display:flex; flex-direction:column; gap:12px; max-width:800px; }
.by-faq-item { background:var(--by-card); border-radius:12px; padding:20px 24px; }
.by-faq-item h4 { font-size:15px; font-weight:700; margin:0 0 8px; color:var(--by-text); }
.by-faq-item p { font-size:14px; color:var(--by-mute); line-height:1.65; margin:0; }
.by-alert { background:rgba(247,166,0,.08); border:1px solid rgba(247,166,0,.25); border-radius:12px; padding:20px 24px; display:flex; gap:14px; align-items:flex-start; margin-top:32px; }
.by-alert .ic { color:var(--by-amber); flex-shrink:0; }
.by-alert h4 { font-size:15px; font-weight:700; margin:0 0 4px; color:var(--by-text); }
.by-alert p { font-size:14px; color:var(--by-mute); line-height:1.6; margin:0; }
.by-alert a { color:var(--by-amber); font-weight:600; text-decoration:none; }
@media (max-width:900px) { .by-grid3 { grid-template-columns:1fr; } .by-page { padding:48px 0 64px; } }
`;

const FAQS = [
  { q: 'How do I complete KYC?', a: 'Log in → click Profile → Complete KYC. Upload a government ID (NIN, driver\'s license, or passport), a selfie, and proof of address. Approval takes under 24 hours.' },
  { q: 'How do I fund my wallet?', a: 'Go to Wallet → Deposit. Choose bank transfer (free, instant) or Paystack (card, 1.5% fee). Funds reflect in your wallet within 5 minutes.' },
  { q: 'When do returns get paid?', a: 'Returns are paid quarterly to your BraveVest wallet based on the specific deal structure. You will see every payout in your Statement.' },
  { q: 'What happens if a borrower defaults?', a: 'All projects are collateralized. Our recovery team liquidates collateral to recover investor capital. Since 2023, our default rate is zero.' },
  { q: 'How do I withdraw?', a: 'Go to Wallet → Withdraw. Enter the amount, select your verified bank account, confirm. Funds arrive within 1 business day. No withdrawal fees.' },
  { q: 'Can I change my bank account?', a: 'For security, withdrawals only go to your KYC-verified bank account. To change it, contact support with documentation.' },
];

export default function Support() {
  return (
    <PageShell theme="light" ticker>
      <style>{CSS}</style>
      <div className="by">
        <section className="by-page">
          <div className="by-wrap">
            <div className="by-eyebrow">Support</div>
            <h1>How can we <em>help</em>?</h1>
            <p className="by-lede">
              Find answers to common questions, or reach our team directly. We respond within 2 hours on business days.
            </p>

            <div className="by-grid3">
              <Link to="/faq" className="by-tile">
                <div className="ic"><BookOpen size={22} /></div>
                <h3>FAQ</h3>
                <p>Answers to the most common questions about investing, KYC, and withdrawals.</p>
                <span className="more">Browse FAQ <ArrowRight size={14} /></span>
              </Link>
              <Link to="/contact" className="by-tile">
                <div className="ic"><Mail size={22} /></div>
                <h3>Contact us</h3>
                <p>Send us a message and we'll respond within 2 hours on business days.</p>
                <span className="more">Open contact form <ArrowRight size={14} /></span>
              </Link>
              <a href="mailto:support@bravevest.com" className="by-tile">
                <div className="ic"><MessageCircle size={22} /></div>
                <h3>Email support</h3>
                <p>Reach our support team directly at support@bravevest.com.</p>
                <span className="more">Send email <ArrowRight size={14} /></span>
              </a>
            </div>

            <div className="by-sec">
              <h2>Common questions</h2>
              <p className="by-sub">Quick answers to the things investors ask most.</p>
              <div className="by-faq">
                {FAQS.map((f) => (
                  <div key={f.q} className="by-faq-item">
                    <h4>{f.q}</h4>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>

              <div className="by-alert">
                <div className="ic"><AlertTriangle size={20} /></div>
                <div>
                  <h4>Cannot find what you need?</h4>
                  <p>
                    Our team is available Mon–Fri, 9am–6pm WAT. {' '}
                    <Link to="/contact">Send us a message</Link> or email{' '}
                    <a href="mailto:support@bravevest.com">support@bravevest.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}