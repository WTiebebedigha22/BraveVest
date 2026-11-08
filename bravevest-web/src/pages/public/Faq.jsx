import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MessageCircle, FileText, Wallet, Shield, TrendingUp,
  Globe, Layers, ArrowRight, Sparkles,
} from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: MessageCircle },
  { id: 'investing', label: 'Investing', icon: FileText },
  { id: 'wallet', label: 'Wallet & Payments', icon: Wallet },
  { id: 'security', label: 'Security & KYC', icon: Shield },
  { id: 'taxation', label: 'Returns & Taxation', icon: TrendingUp },
  { id: 'diaspora', label: 'Diaspora', icon: Globe },
  { id: 'products', label: 'Products', icon: Layers },
];

const FAQS = [
  { cat: 'general', q: 'What is BraveVest?', a: 'BraveVest is a private credit platform connecting investors to vetted, collateralized lending opportunities across Nigeria. We originate, underwrite, and service credit facilities across energy, real estate, agri, and SME trade finance.' },
  { cat: 'general', q: 'Who can invest on BraveVest?', a: 'Any Nigerian resident aged 18+ with a valid government-issued ID and a bank account. Diaspora investors can invest through USD-denominated products.' },
  { cat: 'general', q: 'Is BraveVest regulated?', a: 'BraveVest operates in alignment with SEC Nigeria guidelines and partners only with CBN-licensed custodians. All investor funds are held in segregated accounts.' },
  { cat: 'general', q: 'What are the fees?', a: 'BraveVest charges a 1% origination fee (built into the yield) and a 10% performance fee above the target. No deposit or withdrawal fees.' },
  { cat: 'investing', q: 'How do I start investing?', a: 'Create an account, complete KYC, deposit funds, and browse the marketplace. Once invested, capital deploys immediately and returns begin accruing.' },
  { cat: 'investing', q: 'What is the minimum investment?', a: 'Minimum varies by project — typically ₦5,000 to ₦100,000. Premium real estate notes require ₦200,000+.' },
  { cat: 'investing', q: 'How are returns paid?', a: 'Returns are paid to your BraveVest wallet monthly or quarterly depending on the deal. Most deals pay quarterly.' },
  { cat: 'investing', q: 'What happens if a borrower defaults?', a: 'All loans are collateralized. Our recovery team liquidates collateral to recover capital. Our default rate since 2023 is zero.' },
  { cat: 'wallet', q: 'How do I fund my wallet?', a: 'Bank transfer is free and instant. Paystack card deposits incur a 1.5% fee. Deposits reflect in under 5 minutes.' },
  { cat: 'wallet', q: 'Are there withdrawal fees?', a: 'No. Withdrawals to your verified Nigerian bank account are free. Same-day processing if requested before 3 PM WAT.' },
  { cat: 'wallet', q: 'How long do deposits take?', a: 'NGN bank transfers reflect within 5 minutes during business hours. SWIFT USD transfers take 1–3 business days.' },
  { cat: 'security', q: 'What KYC documents do I need?', a: "A valid government ID (NIN, driver's license, or passport), a selfie for liveness, and proof of address not older than 3 months." },
  { cat: 'security', q: 'How long does KYC take?', a: 'Most verifications complete within 24 hours. Complex cases may take up to 3 business days.' },
  { cat: 'security', q: 'Is my data secure?', a: 'Yes. Bank-grade 256-bit encryption, ISO 27001 certified, NDPR compliant. We never sell or share your data.' },
  { cat: 'taxation', q: 'How is my investment return taxed?', a: 'Interest income is subject to Withholding Tax (WHT). For Nigerian residents, WHT on interest is 10%, deducted at source.' },
  { cat: 'taxation', q: 'Do I need to file taxes on BraveVest earnings?', a: 'Yes. WHT is a prepayment, not final tax. Report earnings on your annual Personal Income Tax return. BraveVest issues a downloadable WHT credit note every January.' },
  { cat: 'diaspora', q: 'Can I invest from outside Nigeria?', a: 'Yes. Diaspora investors can access USD-denominated products launching Q4 2026. You need a Nigerian BVN, international passport, and USD funding source.' },
  { cat: 'diaspora', q: 'How do I fund my wallet from abroad?', a: 'USD via SWIFT wire transfer (1–3 business days) or USDC via our partner on-ramp (launching Q1 2027).' },
  { cat: 'products', q: 'Lagos Solar Fund II — what is it?', a: 'A 40MW distributed solar portfolio across Lagos and Ogun. Target yield 14.5% over 18 months, paid quarterly. Senior-secured with 15% first-loss protection.' },
  { cat: 'products', q: 'Abuja Real Estate Note — what is it?', a: "A 24-month note backed by 12 serviced plots in Abuja's Guzape district. Yield 12.0% quarterly, 20% first-loss protection, 1.8x collateral coverage." },
];

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
  --warm-tint: #FFF8E6;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-main);
  overflow-x: hidden;
  position: relative;
}

.elite-light-root * { box-sizing: border-box; }
.elite-container { max-width: 1240px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }

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
.elite-btn-outline { background: #FFFFFF; color: var(--text-main); border-color: rgba(18, 20, 26, 0.15); }
.elite-btn-outline:hover { background: var(--warm-tint); border-color: var(--gold-primary); color: var(--gold-dark); }

/* Hero with IMAGE background (like Home) */
.elite-hero-faq {
  position: relative;
  padding: 120px 0 120px;
  text-align: center;
  color: #FFFFFF;
  background:
    linear-gradient(rgba(18, 18, 20, 0.72), rgba(18, 18, 20, 0.82)),
    url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
  overflow: hidden;
}

.elite-hero-faq .elite-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; border-radius: 99px;
  background: rgba(247, 166, 0, 0.2);
  border: 1px solid rgba(247, 166, 0, 0.5);
  color: var(--gold-light);
  font-size: 13.5px; font-weight: 700;
  margin-bottom: 28px;
  backdrop-filter: blur(8px);
}

.elite-hero-faq h1 {
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.08;
  max-width: 900px;
  margin: 0 auto 24px;
  color: #FFFFFF;
}

.elite-hero-faq h1 .elite-gradient-text {
  background: linear-gradient(135deg, #FFC94D 0%, #F7A600 50%, #FFE29A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.elite-hero-faq p {
  font-size: clamp(17px, 2vw, 20px);
  color: #E4E4E9;
  max-width: 640px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

/* Search inside hero */
.elite-hero-search {
  position: relative;
  max-width: 560px;
  margin: 0 auto;
}
.elite-hero-search input {
  width: 100%;
  height: 60px;
  padding: 0 20px 0 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 16px;
  color: var(--text-main);
  outline: none;
  font-family: inherit;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}
.elite-hero-search input:focus {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 4px rgba(247, 166, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.2);
}
.elite-hero-search svg {
  position: absolute;
  left: 20px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

/* Category Chips */
.elite-cat-bar {
  display: flex; gap: 8px; flex-wrap: wrap;
  justify-content: center;
  max-width: 900px; margin: -32px auto 0;
  padding: 0 20px;
  position: relative; z-index: 5;
}
.elite-cat-chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px;
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 99px;
  font-weight: 600; font-size: 14px;
  color: var(--text-main);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(18, 18, 20, 0.06);
  transition: all 0.2s;
}
.elite-cat-chip:hover { border-color: var(--gold-primary); color: var(--gold-dark); transform: translateY(-2px); }
.elite-cat-chip.active { background: var(--gold-gradient); color: #12141A; border-color: transparent; box-shadow: 0 12px 24px rgba(247, 166, 0, 0.35); }

/* FAQ List */
.elite-faq-list {
  max-width: 900px;
  margin: 48px auto 0;
  display: flex; flex-direction: column; gap: 16px;
}
.elite-faq-item {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px 32px;
  transition: all 0.25s;
}
.elite-faq-item:hover { border-color: var(--gold-primary); box-shadow: 0 12px 32px rgba(194, 124, 0, 0.1); }
.elite-faq-item summary {
  cursor: pointer;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 700;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: var(--text-main);
}
.elite-faq-item summary::-webkit-details-marker { display: none; }
.elite-faq-item summary::after {
  content: '+';
  font-size: 26px;
  color: var(--gold-dark);
  font-family: 'Space Grotesk', sans-serif;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.elite-faq-item[open] summary::after { content: '−'; }
.elite-faq-item p {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.75;
  margin: 16px 0 0;
}

/* Empty */
.elite-empty {
  padding: 80px 24px; text-align: center;
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  max-width: 600px; margin: 48px auto 0;
}
.elite-empty h3 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; margin: 0 0 8px; }
.elite-empty p { color: var(--text-muted); margin: 0; }

/* Banner */
.elite-banner {
  background: linear-gradient(135deg, #12141A 0%, #1F222B 100%);
  border: 1px solid rgba(247, 166, 0, 0.4);
  border-radius: 36px; padding: 72px 48px;
  text-align: center; position: relative; overflow: hidden;
  margin: 80px auto 120px; color: #FFFFFF;
  box-shadow: 0 30px 80px rgba(18, 18, 20, 0.2);
  max-width: 1240px;
}
.elite-banner::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(circle, rgba(247, 166, 0, 0.25), transparent 70%);
  pointer-events: none;
}
.elite-banner h2 { font-size: clamp(32px, 4.5vw, 48px); margin: 0 0 16px; color: #FFFFFF; }
.elite-banner p { color: #9BA1B0; font-size: 18px; max-width: 600px; margin: 0 auto 36px; }

@media (max-width: 768px) {
  .elite-hero-faq { padding: 80px 0 100px; }
  .elite-cat-bar { margin-top: -24px; }
  .elite-faq-item { padding: 20px 24px; }
  .elite-faq-item summary { font-size: 16px; }
  .elite-banner { padding: 48px 24px; }
}
`;

export default function Faq() {
  const [activeCat, setActiveCat] = useState('general');
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const filtered = useMemo(() => {
    let list = FAQS;
    if (activeCat) list = list.filter((f) => f.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return list;
  }, [activeCat, search]);

  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='elite-light-root'>

        {/* Hero WITH IMAGE */}
        <section className='elite-hero-faq'>
          <div className='elite-container'>
            <div className='elite-badge'>
              <Sparkles size={15} />
              <span>Support Center</span>
            </div>
            <h1 className='elite-title'>
              Answers to <span className='elite-gradient-text'>Every Question</span>
            </h1>
            <p>
              Everything you need to know about investing, KYC, withdrawals, and returns on BraveVest.
            </p>

            <div className='elite-hero-search'>
              <Search size={20} />
              <input
                type='search'
                placeholder='Search for answers…'
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpenIdx(0); }}
                aria-label='Search FAQ'
              />
            </div>
          </div>
        </section>

        {/* Category chips — pulled up into hero */}
        <div className='elite-cat-bar'>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(cat.id); setOpenIdx(0); }}
                className={`elite-cat-chip ${active ? 'active' : ''}`}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <section style={{ padding: '48px 24px 0' }}>
          <div className='elite-container' style={{ maxWidth: 900 }}>
            {filtered.length === 0 ? (
              <div className='elite-empty'>
                <h3>No matches</h3>
                <p>Try a different search term or pick another category above.</p>
              </div>
            ) : (
              <div className='elite-faq-list'>
                {filtered.map((faq, i) => (
                  <details
                    key={faq.q}
                    className='elite-faq-item'
                    open={i === openIdx}
                    onToggle={(e) => { if (e.currentTarget.open) setOpenIdx(i); }}
                  >
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: '0 24px' }}>
          <div className='elite-banner'>
            <h2 className='elite-title'>Still need help?</h2>
            <p>Our support team responds within 2 hours on business days.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to='/contact' className='elite-btn elite-btn-gold'>
                Contact Support <ArrowRight size={17} />
              </Link>
              <Link to='/how-it-works' className='elite-btn elite-btn-outline'>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}