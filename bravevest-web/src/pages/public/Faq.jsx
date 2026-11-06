import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Search,
  MessageCircle,
  FileText,
  Shield,
  Wallet,
  TrendingUp,
  Globe,
  Layers,
} from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: MessageCircle },
  { id: 'investing', label: 'Investing', icon: FileText },
  { id: 'wallet', label: 'Wallet & Payments', icon: Wallet },
  { id: 'security', label: 'Security & KYC', icon: Shield },
  { id: 'taxation', label: 'Returns & Taxation', icon: TrendingUp },
  { id: 'diaspora', label: 'Diaspora', icon: Globe },
  { id: 'products', label: 'Product-Specific', icon: Layers },
];

const FAQS = [
  { cat: 'general', q: 'What is BraveVest?', a: 'BraveVest is a private credit platform that connects investors to vetted, collateralized lending opportunities across Nigeria. We originate, underwrite, and service credit facilities across energy, real estate, agri, and SME trade finance — then open them up to investors seeking fixed returns.' },
  { cat: 'general', q: 'Who can invest on BraveVest?', a: 'Any Nigerian resident aged 18+ with a valid government-issued ID and a bank account. Diaspora investors can invest through our USD-denominated products (coming soon) — see the Diaspora section.' },
  { cat: 'general', q: 'Is BraveVest regulated?', a: 'BraveVest operates in alignment with SEC Nigeria guidelines and partners only with CBN-licensed custodians. All investor funds are held in segregated accounts.' },
  { cat: 'general', q: 'What are the fees?', a: 'BraveVest charges a 1% origination fee on each deal (built into the yield) and a 10% performance fee on returns above the target. There are no deposit or withdrawal fees.' },

  { cat: 'investing', q: 'How do I start investing?', a: 'Create an account, complete your KYC verification, deposit funds, and browse the Marketplace to select a project that fits your risk and return profile. Once invested, your capital is deployed immediately and returns begin accruing.' },
  { cat: 'investing', q: 'What is the minimum investment?', a: 'Minimum investment varies by project, typically ranging from ₦25,000 to ₦100,000. Some premium real estate notes require a minimum of ₦200,000.' },
  { cat: 'investing', q: 'How are returns paid?', a: 'Returns are paid directly to your BraveVest wallet on a monthly or quarterly basis, depending on the specific deal structure. Most deals pay quarterly.' },
  { cat: 'investing', q: 'Can I withdraw before the tenor ends?', a: 'Most deals are locked for their full tenor. However, we are launching a secondary market in Q1 2027 where you can sell your position to other investors before maturity.' },
  { cat: 'investing', q: 'What happens if a borrower defaults?', a: 'We have a rigorous underwriting process and require collateral for all loans. In the rare event of a default, our recovery team works to liquidate collateral and recover investor capital. Our cumulative default rate is below 0.8%.' },
  { cat: 'investing', q: 'Can I diversify across multiple deals?', a: 'Yes. We recommend spreading your capital across 5–10 deals to minimize concentration risk. The platform lets you invest in as many active deals as you like.' },

  { cat: 'wallet', q: 'How do I fund my wallet?', a: 'Bank transfer is the primary method. We support NGN transfers via all major Nigerian banks and USD transfers via SWIFT. Card and USSD deposits are coming soon.' },
  { cat: 'wallet', q: 'How long do deposits take?', a: 'NGN bank transfers typically reflect within 5 minutes during business hours. SWIFT USD transfers take 1–3 business days.' },
  { cat: 'wallet', q: 'Are there withdrawal fees?', a: 'No. Withdrawals to your linked Nigerian bank account are free. Same-day processing if requested before 3 PM WAT.' },
  { cat: 'wallet', q: 'Can I withdraw to a different bank account?', a: 'For security reasons, withdrawals must go to the bank account linked to your verified KYC profile. To change it, contact support with documentation.' },

  { cat: 'security', q: 'What KYC documents do I need?', a: "A valid government ID (NIN, driver's license, or international passport), a selfie for liveness verification, and proof of address (utility bill or bank statement not older than 3 months)." },
  { cat: 'security', q: 'How long does KYC take?', a: 'Most verifications are completed within 24 hours. Complex cases (e.g., name mismatches) may take up to 3 business days.' },
  { cat: 'security', q: 'Can I invest before completing KYC?', a: 'You can browse the platform and fund your wallet, but you must complete KYC before you can invest or withdraw any funds.' },
  { cat: 'security', q: 'Is my data secure?', a: 'Yes. We use bank-grade 256-bit encryption, are ISO 27001 certified, and never store sensitive data in plain text. All PII is protected under NDPR (Nigeria Data Protection Regulation).' },

  { cat: 'taxation', q: 'How is my investment return taxed?', a: 'Interest income (yield) earned from private credit investments is subject to Withholding Tax (WHT). For Nigerian residents, WHT on interest is 10%. BraveVest deducts WHT at source before crediting returns to your wallet.' },
  { cat: 'taxation', q: 'What is WHT and when does it apply?', a: "Withholding Tax is an advance payment of income tax deducted at the point of earning. On BraveVest, WHT is applied to your gross yield each time a distribution is made — not on your principal. You'll see gross yield, WHT deduction, and net yield in every transaction receipt." },
  { cat: 'taxation', q: 'Do I need to file taxes on BraveVest earnings?', a: 'Yes. WHT is a prepayment, not a final tax. You must report your BraveVest earnings on your annual Personal Income Tax return (Form A) with your state internal revenue service. BraveVest issues a downloadable WHT credit note every January to support your filing.' },
  { cat: 'taxation', q: 'Are there exemptions from WHT?', a: 'Yes. Certain institutional investors, pension funds, and non-residents from countries with a Double Taxation Agreement (DTA) may be exempt. Submit your exemption certificate to support@bravevest.com before your first investment.' },
  { cat: 'taxation', q: 'Is capital gains tax applicable?', a: 'Currently, no. Private credit returns are treated as interest income, not capital gains. If we launch the secondary market in 2027, capital gains treatment will apply to any profit from selling your position.' },
  { cat: 'taxation', q: 'How do I get my WHT credit note?', a: 'From your Dashboard, go to "Tax Documents" and download your annual WHT credit note. Notes are also emailed automatically by January 31st each year.' },
  { cat: 'taxation', q: 'What about VAT?', a: "BraveVest's platform fee (the 1% origination fee) is VAT-inclusive. There is no VAT on your investment returns — only WHT." },
  { cat: 'taxation', q: 'Do diaspora investors pay different taxes?', a: 'For non-resident investors, Nigerian WHT still applies at 10% (or 7.5% under most DTAs). You may also owe tax in your country of residence. Consult a local tax advisor — see the Diaspora section for more.' },

  { cat: 'diaspora', q: 'Can I invest from outside Nigeria?', a: 'Yes. Diaspora investors can invest via our USD-denominated products (launching Q4 2026). You will need a Nigerian BVN, international passport, and a USD funding source. Sign up and select "Diaspora" as your investor type.' },
  { cat: 'diaspora', q: 'How do I fund my wallet from abroad?', a: 'We accept USD via SWIFT wire transfer and USDC via our partner on-ramp (launching Q1 2027). Minimum SWIFT transfer is $500; our partner banks in the US and UK process wires in 1–3 business days.' },
  { cat: 'diaspora', q: 'What are the SWIFT transfer fees?', a: 'Intermediary bank fees typically range from $15–$35 per transfer (deducted by the sending or intermediary bank — not by BraveVest). We recommend sending $1,000+ per transfer to minimize fee impact.' },
  { cat: 'diaspora', q: 'Can I withdraw to a foreign bank account?', a: 'USD withdrawals are currently supported to banks in the US, UK, and Canada via SWIFT. Withdrawal fee is $20 flat. NGN withdrawals must go to a Nigerian bank account.' },
  { cat: 'diaspora', q: 'Do I need a Nigerian BVN?', a: "Yes. All investors — including diaspora — need a BVN for KYC and tax reporting. If you don't have one, you can enroll at any Nigerian bank branch or via our partner NIBSS agent (remote enrollment coming soon)." },
  { cat: 'diaspora', q: 'How does currency risk work?', a: 'USD-denominated products protect you from Naira depreciation. Your capital and returns are held in USD, so you gain if the Naira weakens. Conversely, NGN-denominated products are exposed to currency risk if you plan to repatriate in USD.' },
  { cat: 'diaspora', q: "Can I invest if I don't have a Nigerian bank account?", a: 'Yes. Diaspora investors can use a foreign bank account for USD transfers and withdrawals. You will still need a BVN and Nigerian ID for KYC.' },
  { cat: 'diaspora', q: 'What taxes apply to diaspora returns?', a: 'Nigerian WHT applies at 10% (or 7.5% under applicable DTAs). You may also owe tax in your resident country — e.g., US persons must report foreign interest income on Form 1040, Schedule B. Consult a cross-border tax advisor.' },

  { cat: 'products', q: 'Lagos Solar Fund II — what is it?', a: 'A 40MW distributed solar portfolio across Lagos and Ogun states. Target yield is 14.5% over 18 months, paid quarterly. The fund is senior-secured with 15% first-loss protection held by the sponsor. Minimum investment is ₦50,000.' },
  { cat: 'products', q: 'Lagos Solar Fund II — what are the risks?', a: 'Key risks include construction delays, offtaker credit (primarily industrial customers), and currency exposure on imported equipment. All three are mitigated via fixed-price EPC contracts, a diversified offtaker base, and USD hedge on capex.' },
  { cat: 'products', q: 'Abuja Real Estate Note — what is it?', a: "A 24-month note backed by a portfolio of 12 serviced plots in Abuja's Guzape district. Yield is 12.0% paid quarterly, with first-loss protection of 20%. Collateral coverage ratio is 1.8x. Minimum investment is ₦100,000." },
  { cat: 'products', q: "Abuja Real Estate Note — what happens if land doesn't sell?", a: 'The borrower has committed to a buyback guarantee if plots are not sold by month 20. If they default, the trustee has the right to sell the underlying land at fair value, which provides a 1.8x coverage cushion over investor principal.' },
  { cat: 'products', q: 'Ogun Agri Cooperative — what is it?', a: 'Working capital financing for a cassava and maize cooperative in Ogun State. Yield is 14.0% over 12 months, paid quarterly. Collateralized by warehouse receipts and crop insurance. Minimum investment is ₦25,000.' },
  { cat: 'products', q: 'Ogun Agri Cooperative — what are the risks?', a: "Weather risk is the primary concern, mitigated via crop insurance from a NAIC-backed underwriter. Commodity price risk is managed by forward contracts with the cooperative's off-taker. Concentration risk (single crop) is mitigated by the co-op's diversified planting." },
  { cat: 'products', q: 'SME Trade Finance — what is it?', a: 'Short-duration (6-month) facilities for importers of FMCG goods. Yield is 16.5% over 6 months, paid quarterly. Collateralized by inventory and receivables with 1.5x coverage. Minimum investment is ₦5,000.' },
  { cat: 'products', q: 'Can I invest in multiple products at once?', a: 'Yes. You can spread capital across any number of active deals. We recommend 5–10 deals for proper diversification across sectors and tenors.' },
];

const CSS = `
.fq { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.fq * { box-sizing:border-box; }
.fq-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.fq-chip { display:inline-flex; padding:6px 12px; border-radius:6px; background:var(--by-card); border:1px solid var(--by-line); font-size:13px; font-weight:600; color:var(--by-amber); }

.fq-hero { position:relative; overflow:hidden; padding:80px 0 56px; }
.fq-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(600px 360px at 80% 0%, rgba(247,166,0,.2), transparent 70%); }
.fq-glow::after { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--by-line) 1px, transparent 1px), linear-gradient(90deg, var(--by-line) 1px, transparent 1px); background-size:56px 56px; opacity:.45;
  -webkit-mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); mask-image:radial-gradient(ellipse at 75% 0%, #000 0%, transparent 65%); }
.fq-hero .fq-wrap { position:relative; }
.fq h1 { font-size:clamp(40px,6vw,68px); font-weight:800; line-height:1.06; letter-spacing:-0.04em; margin:20px 0 20px; }
.fq h1 em { font-style:normal; background:linear-gradient(transparent 62%, rgba(247,166,0,.6) 62%) no-repeat; background-size:0 100%; animation:fq-mark .9s .4s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes fq-mark { to { background-size:100% 100%; } }
@media (prefers-reduced-motion:reduce) { .fq h1 em { animation:none; background-size:100% 100%; } }
.fq-sub { font-size:clamp(16px,1.8vw,19px); color:var(--by-mute); line-height:1.7; max-width:600px; margin:0 0 32px; }
.fq-search { position:relative; max-width:560px; }
.fq-search svg { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--by-mute); pointer-events:none; }
.fq-search input { width:100%; height:56px; padding:0 18px 0 48px; background:var(--by-card); border:1px solid transparent; border-radius:10px; font-family:inherit; font-size:16px; color:var(--by-text); outline:none; transition:border-color .15s, background .15s; }
.fq-search input::placeholder { color:#9A9AA6; }
.fq-search input:focus { border-color:var(--by-yellow); background:#fff; }

.fq-layout { display:grid; grid-template-columns:272px 1fr; gap:40px; align-items:start; padding:24px 0 96px; }
.fq-side { position:sticky; top:32px; }
.fq-cats { display:flex; flex-direction:column; gap:4px; }
.fq-cat { display:flex; align-items:center; gap:12px; width:100%; padding:12px 14px; background:transparent; border:0; border-radius:8px; font-family:inherit; font-size:14px; font-weight:600; color:var(--by-mute); cursor:pointer; text-align:left; white-space:nowrap; transition:background .15s, color .15s; }
.fq-cat svg { color:var(--by-mute); flex:none; }
.fq-cat:hover { background:var(--by-card); color:var(--by-text); }
.fq-cat[aria-pressed='true'] { background:var(--by-card); color:var(--by-text); box-shadow:inset 3px 0 0 var(--by-yellow); }
.fq-cat[aria-pressed='true'] svg { color:var(--by-amber); }
.fq-cat:focus-visible, .fq-q:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.fq-help { margin-top:28px; padding:22px; background:var(--by-card); border-radius:16px; }
.fq-help b { display:block; font-size:15px; margin-bottom:6px; }
.fq-help p { font-size:13px; color:var(--by-mute); line-height:1.6; margin:0 0 14px; }
.fq-help a { display:inline-flex; align-items:center; gap:4px; font-size:14px; font-weight:600; color:var(--by-amber); text-decoration:none; }
.fq-help a:hover { text-decoration:underline; }

.fq-list { display:flex; flex-direction:column; gap:10px; }
.fq-item { background:var(--by-card); border:1px solid transparent; border-radius:14px; transition:border-color .15s; }
.fq-item.open { border-color:var(--by-yellow); background:#fff; }
.fq-item:not(.open):hover { background:var(--by-card2); }
.fq-q { display:flex; justify-content:space-between; align-items:center; gap:16px; width:100%; padding:20px 22px; background:none; border:0; border-radius:14px; font-family:inherit; text-align:left; cursor:pointer; }
.fq-q span { font-size:16px; font-weight:700; line-height:1.4; letter-spacing:-0.01em; color:var(--by-text); }
.fq-q i { width:28px; height:28px; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; background:#fff; color:var(--by-mute); transition:background .15s, color .15s, transform .2s; }
.fq-item.open .fq-q i { background:rgba(247,166,0,.16); color:var(--by-amber); transform:rotate(180deg); }
.fq-a { padding:0 22px 22px; color:var(--by-mute); font-size:15px; line-height:1.75; max-width:760px; }
.fq-tag { display:inline-block; margin-bottom:8px; font-size:11px; font-weight:700; color:var(--by-amber); background:rgba(247,166,0,.14); padding:3px 8px; border-radius:4px; }
.fq-empty { padding:64px 24px; text-align:center; background:var(--by-card); border-radius:16px; }
.fq-empty svg { color:#B4B4BE; margin:0 auto 16px; display:block; }
.fq-empty b { display:block; font-size:18px; margin-bottom:6px; }
.fq-empty p { font-size:14px; color:var(--by-mute); margin:0; }

@media (max-width:900px) {
  .fq-hero { padding:48px 0 40px; }
  .fq-layout { grid-template-columns:1fr; gap:24px; padding-bottom:64px; }
  .fq-side { position:static; }
  .fq-cats { flex-direction:row; gap:8px; overflow-x:auto; padding-bottom:6px; scrollbar-width:none; }
  .fq-cats::-webkit-scrollbar { display:none; }
  .fq-cat { width:auto; border:1px solid var(--by-line); border-radius:99px; padding:10px 16px; }
  .fq-cat[aria-pressed='true'] { box-shadow:none; border-color:var(--by-yellow); background:rgba(247,166,0,.12); }
  .fq-help { display:none; }
}
`;

export default function FAQ() {
  const [activeCat, setActiveCat] = useState('general');
  const [open, setOpen] = useState(0);
  const [search, setSearch] = useState('');

  const searching = search.trim().length > 0;

  // Searching looks across every category; otherwise show the selected category.
  const filtered = useMemo(() => {
    if (searching) {
      const q = search.trim().toLowerCase();
      return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return FAQS.filter((f) => f.cat === activeCat);
  }, [activeCat, search, searching]);

  const handleCatChange = (id) => {
    setActiveCat(id);
    setOpen(0);
    setSearch('');
  };

  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || '';

  return (
    <PageShell theme='light' ticker>
      <style>{CSS}</style>
      <div className='fq'>
        <section className='fq-hero'>
          <div className='fq-glow' aria-hidden='true' />
          <div className='fq-wrap'>
            <span className='fq-chip'>Support</span>
            <h1>How can we <em>help?</em></h1>
            <p className='fq-sub'>
              Everything you need to know about investing and managing your portfolio with BraveVest.
            </p>
            <div className='fq-search'>
              <Search size={18} />
              <input
                type='search'
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpen(0); }}
                placeholder='Search for answers...'
                aria-label='Search for answers'
              />
            </div>
          </div>
        </section>

        <div className='fq-wrap fq-layout'>
          <aside className='fq-side'>
            <div className='fq-cats' role='group' aria-label='Categories'>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type='button'
                    className='fq-cat'
                    aria-pressed={!searching && activeCat === cat.id}
                    onClick={() => handleCatChange(cat.id)}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className='fq-help'>
              <b>Still need help?</b>
              <p>Our team responds within 2 hours on business days.</p>
              <Link to='/support'>Contact support <ChevronRight size={14} /></Link>
            </div>
          </aside>

          <main>
            {filtered.length === 0 ? (
              <div className='fq-empty'>
                <Search size={32} />
                <b>No results found</b>
                <p>Try a different search term or choose another category.</p>
              </div>
            ) : (
              <div className='fq-list'>
                {filtered.map((faq, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={faq.q} className={`fq-item${isOpen ? ' open' : ''}`}>
                      <button
                        type='button'
                        className='fq-q'
                        aria-expanded={isOpen}
                        aria-controls={`fq-a-${i}`}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                      >
                        <span>{faq.q}</span>
                        <i><ChevronDown size={16} /></i>
                      </button>
                      {isOpen && (
                        <div id={`fq-a-${i}`} className='fq-a' role='region'>
                          {searching && <span className='fq-tag'>{catLabel(faq.cat)}</span>}
                          <div>{faq.a}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </PageShell>
  );
}