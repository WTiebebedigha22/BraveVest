import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.su { --su-bg:#FFFFFF; --su-card:#F9F9FB; --su-card2:#F5F5F7; --su-line:#E4E4E9; --su-text:#121214; --su-mute:#6B6B76; --su-yellow:#F7A600; --su-amber:#C27C00; --su-green:#0E9F5B;
  background:var(--su-bg); color:var(--su-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.su * { box-sizing:border-box; }
.su-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }

/* Hero Banner with Dark Overlay */
.su-hero { position:relative; overflow:hidden; padding:96px 0 80px; background-color:#121214; color:#FFFFFF; text-align:center; }
.su-hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.35; filter:brightness(0.8); }
.su-hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(18,18,20,0.6) 0%, rgba(18,18,20,0.85) 100%); }
.su-hero .su-wrap { position:relative; z-index:2; max-width:760px; }
.su-chip { display:inline-flex; padding:6px 14px; border-radius:6px; background:rgba(247,166,0,0.15); border:1px solid rgba(247,166,0,0.3); font-size:13px; font-weight:700; color:var(--su-yellow); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:16px; }
.su-hero h1 { font-size:clamp(38px, 5.5vw, 60px); font-weight:800; letter-spacing:-0.035em; margin:0 0 16px; line-height:1.08; }
.su-hero h1 em { font-style:normal; color:var(--su-yellow); }
.su-hero p { font-size:clamp(16px, 1.8vw, 18px); color:#D1D5DB; line-height:1.6; margin:0; }

/* Body Layout */
.su-body { padding:72px 0 96px; background:var(--su-bg); }
.su-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-bottom:64px; }
.su-tile { background:var(--su-card); border:1px solid var(--su-line); border-radius:20px; padding:32px; text-decoration:none; color:inherit; display:block; transition:all 0.2s ease; box-shadow:0 10px 30px -10px rgba(18,18,20,0.04); }
.su-tile:hover { border-color:var(--su-yellow); background:#FFFFFF; transform:translateY(-3px); box-shadow:0 20px 40px -15px rgba(247,166,0,0.15); }
.su-tile .ic { width:48px; height:48px; border-radius:12px; background:rgba(247,166,0,0.15); color:var(--su-amber); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
.su-tile h3 { font-size:20px; font-weight:800; margin:0 0 8px; color:var(--su-text); }
.su-tile p { font-size:14.5px; line-height:1.65; color:var(--su-mute); margin:0 0 20px; }
.su-tile .more { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:700; color:var(--su-amber); }

.su-sec h2 { font-size:clamp(26px, 3.5vw, 36px); font-weight:800; letter-spacing:-0.025em; margin:0 0 8px; color:var(--su-text); }
.su-sec .su-sub { color:var(--su-mute); font-size:16px; margin:0 0 32px; }
.su-faq { display:flex; flex-direction:column; gap:16px; max-width:900px; }
.su-faq-item { background:var(--su-card); border:1px solid var(--su-line); border-radius:16px; padding:24px 28px; transition:border-color 0.2s; }
.su-faq-item:hover { border-color:var(--su-yellow); }
.su-faq-item h4 { font-size:16px; font-weight:700; margin:0 0 8px; color:var(--su-text); }
.su-faq-item p { font-size:14.5px; color:var(--su-mute); line-height:1.65; margin:0; }

.su-alert { background:rgba(247,166,0,0.08); border:1px solid rgba(247,166,0,0.3); border-radius:16px; padding:24px 28px; display:flex; gap:16px; align-items:flex-start; margin-top:40px; }
.su-alert .ic { color:var(--su-amber); flex-shrink:0; margin-top:2px; }
.su-alert h4 { font-size:16px; font-weight:700; margin:0 0 4px; color:var(--su-text); }
.su-alert p { font-size:14.5px; color:var(--su-mute); line-height:1.6; margin:0; }
.su-alert a { color:var(--su-amber); font-weight:700; text-decoration:none; }
.su-alert a:hover { text-decoration:underline; }

@media (max-width:900px) { .su-grid3 { grid-template-columns:1fr; gap:16px; } .su-hero { padding:72px 0 60px; } .su-body { padding:48px 0 64px; } }
`;

const FAQS = [
  { q: 'How do I complete KYC?', a: 'Log in → click Profile → Complete KYC. Upload a government ID (NIN, driver\'s license, or international passport), a live selfie, and proof of address. Approval typically takes under 24 hours.' },
  { q: 'How do I fund my wallet?', a: 'Go to Wallet → Deposit. Choose bank transfer (free, instant settlement) or Paystack (debit card, 1.5% fee). Funds reflect in your BraveVest wallet within 5 minutes.' },
  { q: 'When do returns get paid?', a: 'Returns are paid quarterly directly to your BraveVest wallet based on the specific asset deal structure. Every payout is fully itemized in your Statement.' },
  { q: 'What happens if a borrower defaults?', a: 'All private credit projects are heavily collateralized with verified real-world assets. Our risk and legal recovery team liquidates collateral to secure investor capital.' },
  { q: 'How do I withdraw funds?', a: 'Go to Wallet → Withdraw. Enter the amount, select your KYC-verified bank account, and confirm. Funds arrive within 1 business day with zero withdrawal fees.' },
  { q: 'Can I change my registered bank account?', a: 'For security purposes, withdrawals are strictly restricted to your KYC-verified bank account. To update it, contact support securely with official documentation.' },
];

export default function Support() {
  return (
    <PageShell theme="light" ticker>
      <style>{CSS}</style>
      <div className="su">
        {/* Hero Banner with Professional Financial Image and Dark Overlay */}
        <section className="su-hero">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80" 
            alt="Customer support team" 
            className="su-hero-bg" 
          />
          <div className="su-hero-overlay" />
          <div className="su-wrap">
            <span className="su-chip">Help Center</span>
            <h1>How can we <em>help</em> you?</h1>
            <p>
              Find instant answers to common questions or reach out to our client advisory team. We respond within 2 hours on business days.
            </p>
          </div>
        </section>

        {/* Body Content */}
        <div className="su-body">
          <div className="su-wrap">
            <div className="su-grid3">
              <Link to="/faq" className="su-tile">
                <div className="ic"><BookOpen size={24} /></div>
                <h3>Browse FAQ</h3>
                <p>Comprehensive answers to the most common questions about investing, KYC verification, and withdrawals.</p>
                <span className="more">Explore FAQ <ArrowRight size={16} /></span>
              </Link>
              <Link to="/contact" className="su-tile">
                <div className="ic"><Mail size={24} /></div>
                <h3>Contact Us</h3>
                <p>Send a secure message directly to our support desk and receive a prompt response within 2 hours.</p>
                <span className="more">Open contact form <ArrowRight size={16} /></span>
              </Link>
              <a href="mailto:support@bravevest.com" className="su-tile">
                <div className="ic"><MessageCircle size={24} /></div>
                <h3>Email Support</h3>
                <p>Reach our client success team directly anytime via email at support@bravevest.com.</p>
                <span className="more">Send email <ArrowRight size={16} /></span>
              </a>
            </div>

            <div className="su-sec">
              <h2>Frequently Asked Questions</h2>
              <p className="su-sub">Quick answers to the topics investors ask about most.</p>
              <div className="su-faq">
                {FAQS.map((f) => (
                  <div key={f.q} className="su-faq-item">
                    <h4>{f.q}</h4>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>

              <div className="su-alert">
                <div className="ic"><AlertTriangle size={22} /></div>
                <div>
                  <h4>Cannot find what you need?</h4>
                  <p>
                    Our advisory desk is available Monday through Friday, 9am–6pm WAT. {' '}
                    <Link to="/contact">Send us a message</Link> or email{' '}
                    <a href="mailto:support@bravevest.com">support@bravevest.com</a> directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}