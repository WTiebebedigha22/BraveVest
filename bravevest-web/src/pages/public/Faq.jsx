import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, MessageCircle, FileText, Shield, Wallet, TrendingUp, Globe, Layers } from 'lucide-react';

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
  // ── General ──
  { cat: 'general', q: 'What is BraveVest?', a: 'BraveVest is a private credit platform that connects investors to vetted, collateralized lending opportunities across Nigeria. We originate, underwrite, and service credit facilities across energy, real estate, agri, and SME trade finance — then open them up to investors seeking fixed returns.' },
  { cat: 'general', q: 'Who can invest on BraveVest?', a: 'Any Nigerian resident aged 18+ with a valid government-issued ID and a bank account. Diaspora investors can invest through our USD-denominated products (coming soon) — see the Diaspora section.' },
  { cat: 'general', q: 'Is BraveVest regulated?', a: 'BraveVest operates in alignment with SEC Nigeria guidelines and partners only with CBN-licensed custodians. All investor funds are held in segregated accounts.' },
  { cat: 'general', q: 'What are the fees?', a: 'BraveVest charges a 1% origination fee on each deal (built into the yield) and a 10% performance fee on returns above the target. There are no deposit or withdrawal fees.' },

  // ── Investing ──
  { cat: 'investing', q: 'How do I start investing?', a: 'Create an account, complete your KYC verification, deposit funds, and browse the Marketplace to select a project that fits your risk and return profile. Once invested, your capital is deployed immediately and returns begin accruing.' },
  { cat: 'investing', q: 'What is the minimum investment?', a: 'Minimum investment varies by project, typically ranging from ₦25,000 to ₦100,000. Some premium real estate notes require a minimum of ₦200,000.' },
  { cat: 'investing', q: 'How are returns paid?', a: 'Returns are paid directly to your BraveVest wallet on a monthly or quarterly basis, depending on the specific deal structure. Most deals pay quarterly.' },
  { cat: 'investing', q: 'Can I withdraw before the tenor ends?', a: 'Most deals are locked for their full tenor. However, we are launching a secondary market in Q1 2027 where you can sell your position to other investors before maturity.' },
  { cat: 'investing', q: 'What happens if a borrower defaults?', a: 'We have a rigorous underwriting process and require collateral for all loans. In the rare event of a default, our recovery team works to liquidate collateral and recover investor capital. Our cumulative default rate is below 0.8%.' },
  { cat: 'investing', q: 'Can I diversify across multiple deals?', a: 'Yes. We recommend spreading your capital across 5–10 deals to minimize concentration risk. The platform lets you invest in as many active deals as you like.' },

  // ── Wallet & Payments ──
  { cat: 'wallet', q: 'How do I fund my wallet?', a: 'Bank transfer is the primary method. We support NGN transfers via all major Nigerian banks and USD transfers via SWIFT. Card and USSD deposits are coming soon.' },
  { cat: 'wallet', q: 'How long do deposits take?', a: 'NGN bank transfers typically reflect within 5 minutes during business hours. SWIFT USD transfers take 1–3 business days.' },
  { cat: 'wallet', q: 'Are there withdrawal fees?', a: 'No. Withdrawals to your linked Nigerian bank account are free. Same-day processing if requested before 3 PM WAT.' },
  { cat: 'wallet', q: 'Can I withdraw to a different bank account?', a: 'For security reasons, withdrawals must go to the bank account linked to your verified KYC profile. To change it, contact support with documentation.' },

  // ── Security & KYC ──
  { cat: 'security', q: 'What KYC documents do I need?', a: 'A valid government ID (NIN, driver\'s license, or international passport), a selfie for liveness verification, and proof of address (utility bill or bank statement not older than 3 months).' },
  { cat: 'security', q: 'How long does KYC take?', a: 'Most verifications are completed within 24 hours. Complex cases (e.g., name mismatches) may take up to 3 business days.' },
  { cat: 'security', q: 'Can I invest before completing KYC?', a: 'You can browse the platform and fund your wallet, but you must complete KYC before you can invest or withdraw any funds.' },
  { cat: 'security', q: 'Is my data secure?', a: 'Yes. We use bank-grade 256-bit encryption, are ISO 27001 certified, and never store sensitive data in plain text. All PII is protected under NDPR (Nigeria Data Protection Regulation).' },

  // ── Returns & Taxation ──
  { cat: 'taxation', q: 'How is my investment return taxed?', a: 'Interest income (yield) earned from private credit investments is subject to Withholding Tax (WHT). For Nigerian residents, WHT on interest is 10%. BraveVest deducts WHT at source before crediting returns to your wallet.' },
  { cat: 'taxation', q: 'What is WHT and when does it apply?', a: 'Withholding Tax is an advance payment of income tax deducted at the point of earning. On BraveVest, WHT is applied to your gross yield each time a distribution is made — not on your principal. You\'ll see gross yield, WHT deduction, and net yield in every transaction receipt.' },
  { cat: 'taxation', q: 'Do I need to file taxes on BraveVest earnings?', a: 'Yes. WHT is a prepayment, not a final tax. You must report your BraveVest earnings on your annual Personal Income Tax return (Form A) with your state internal revenue service. BraveVest issues a downloadable WHT credit note every January to support your filing.' },
  { cat: 'taxation', q: 'Are there exemptions from WHT?', a: 'Yes. Certain institutional investors, pension funds, and non-residents from countries with a Double Taxation Agreement (DTA) may be exempt. Submit your exemption certificate to support@bravevest.com before your first investment.' },
  { cat: 'taxation', q: 'Is capital gains tax applicable?', a: 'Currently, no. Private credit returns are treated as interest income, not capital gains. If we launch the secondary market in 2027, capital gains treatment will apply to any profit from selling your position.' },
  { cat: 'taxation', q: 'How do I get my WHT credit note?', a: 'From your Dashboard, go to "Tax Documents" and download your annual WHT credit note. Notes are also emailed automatically by January 31st each year.' },
  { cat: 'taxation', q: 'What about VAT?', a: 'BraveVest\'s platform fee (the 1% origination fee) is VAT-inclusive. There is no VAT on your investment returns — only WHT.' },
  { cat: 'taxation', q: 'Do diaspora investors pay different taxes?', a: 'For non-resident investors, Nigerian WHT still applies at 10% (or 7.5% under most DTAs). You may also owe tax in your country of residence. Consult a local tax advisor — see the Diaspora section for more.' },

  // ── Diaspora ──
  { cat: 'diaspora', q: 'Can I invest from outside Nigeria?', a: 'Yes. Diaspora investors can invest via our USD-denominated products (launching Q4 2026). You\'ll need a Nigerian BVN, international passport, and a USD funding source. Sign up and select "Diaspora" as your investor type.' },
  { cat: 'diaspora', q: 'How do I fund my wallet from abroad?', a: 'We accept USD via SWIFT wire transfer and USDC via our partner on-ramp (launching Q1 2027). Minimum SWIFT transfer is $500; our partner banks in the US and UK process wires in 1–3 business days.' },
  { cat: 'diaspora', q: 'What are the SWIFT transfer fees?', a: 'Intermediary bank fees typically range from $15–$35 per transfer (deducted by the sending or intermediary bank — not by BraveVest). We recommend sending $1,000+ per transfer to minimize fee impact.' },
  { cat: 'diaspora', q: 'Can I withdraw to a foreign bank account?', a: 'USD withdrawals are currently supported to banks in the US, UK, and Canada via SWIFT. Withdrawal fee is $20 flat. NGN withdrawals must go to a Nigerian bank account.' },
  { cat: 'diaspora', q: 'Do I need a Nigerian BVN?', a: 'Yes. All investors — including diaspora — need a BVN for KYC and tax reporting. If you don\'t have one, you can enroll at any Nigerian bank branch or via our partner NIBSS agent (remote enrollment coming soon).' },
  { cat: 'diaspora', q: 'How does currency risk work?', a: 'USD-denominated products protect you from Naira depreciation. Your capital and returns are held in USD, so you gain if the Naira weakens. Conversely, NGN-denominated products are exposed to currency risk if you plan to repatriate in USD.' },
  { cat: 'diaspora', q: 'Can I invest if I don\'t have a Nigerian bank account?', a: 'Yes. Diaspora investors can use a foreign bank account for USD transfers and withdrawals. You\'ll still need a BVN and Nigerian ID for KYC.' },
  { cat: 'diaspora', q: 'What taxes apply to diaspora returns?', a: 'Nigerian WHT applies at 10% (or 7.5% under applicable DTAs). You may also owe tax in your resident country — e.g., US persons must report foreign interest income on Form 1040, Schedule B. Consult a cross-border tax advisor.' },

  // ── Product-Specific ──
  { cat: 'products', q: 'Lagos Solar Fund II — what is it?', a: 'A 40MW distributed solar portfolio across Lagos and Ogun states. Target yield is 14.5% over 18 months, paid quarterly. The fund is senior-secured with 15% first-loss protection held by the sponsor. Minimum investment is ₦50,000.' },
  { cat: 'products', q: 'Lagos Solar Fund II — what are the risks?', a: 'Key risks include construction delays, offtaker credit (primarily industrial customers), and currency exposure on imported equipment. All three are mitigated via fixed-price EPC contracts, a diversified offtaker base, and USD hedge on capex.' },
  { cat: 'products', q: 'Abuja Real Estate Note — what is it?', a: 'A 24-month note backed by a portfolio of 12 serviced plots in Abuja\'s Guzape district. Yield is 12.0% paid quarterly, with first-loss protection of 20%. Collateral coverage ratio is 1.8x. Minimum investment is ₦100,000.' },
  { cat: 'products', q: 'Abuja Real Estate Note — what happens if land doesn\'t sell?', a: 'The borrower has committed to a buyback guarantee if plots are not sold by month 20. If they default, the trustee has the right to sell the underlying land at fair value, which provides a 1.8x coverage cushion over investor principal.' },
  { cat: 'products', q: 'Ogun Agri Cooperative — what is it?', a: 'Working capital financing for a cassava and maize cooperative in Ogun State. Yield is 14.0% over 12 months, paid quarterly. Collateralized by warehouse receipts and crop insurance. Minimum investment is ₦25,000.' },
  { cat: 'products', q: 'Ogun Agri Cooperative — what are the risks?', a: 'Weather risk is the primary concern, mitigated via crop insurance from a NAIC-backed underwriter. Commodity price risk is managed by forward contracts with the cooperative\'s off-taker. Concentration risk (single crop) is mitigated by the co-op\'s diversified planting.' },
  { cat: 'products', q: 'SME Trade Finance — what is it?', a: 'Short-duration (6-month) facilities for importers of FMCG goods. Yield is 16.5% over 6 months, paid quarterly. Collateralized by inventory and receivables with 1.5x coverage. Minimum investment is ₦5,000.' },
  { cat: 'products', q: 'Can I invest in multiple products at once?', a: 'Yes. You can spread capital across any number of active deals. We recommend 5–10 deals for proper diversification across sectors and tenors.' },
];

export default function FAQ() {
  const [activeCat, setActiveCat] = useState('general');
  const [open, setOpen] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = FAQS;
    if (activeCat) list = list.filter(f => f.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return list;
  }, [activeCat, search]);

  const handleCatChange = (id) => { setActiveCat(id); setOpen(0); setSearch(''); };

  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '64px 0 48px' }}>
        <div className="container" style={{ maxWidth: '1200px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Support</span>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', margin: '16px 0 12px' }}>
            How can we help?
          </h1>
          <p style={{ fontSize: '17px', color: '#666', maxWidth: '540px', margin: '0 auto' }}>
            Everything you need to know about investing with BraveVest.
          </p>

          <div style={{ position: 'relative', maxWidth: '480px', margin: '32px auto 0' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpen(0); }}
              placeholder="Search for answers..."
              style={{ width: '100%', padding: '14px 16px 14px 48px', background: '#F5F5F5', border: '1px solid transparent', borderRadius: '10px', fontSize: '15px', color: '#111', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '1200px', padding: '48px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'flex-start' }}>
        
        {/* Category Sidebar */}
        <aside style={{ position: 'sticky', top: '96px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingLeft: '12px' }}>
            Categories
          </div>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCatChange(cat.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: isActive ? '#fff' : 'transparent',
                  border: isActive ? '1px solid #EAEAEA' : '1px solid transparent',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#111' : '#666',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '4px',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} color={isActive ? '#F6A500' : '#888'} />
                {cat.label}
                {isActive && <ChevronDown size={14} style={{ marginLeft: 'auto', color: '#F6A500' }} />}
              </button>
            );
          })}

          <div style={{ marginTop: '32px', padding: '20px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Still need help?</div>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
              Our team responds within 2 hours on business days.
            </p>
            <Link to="/support" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#F6A500', textDecoration: 'none' }}>
              Contact support <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} />
            </Link>
          </div>
        </aside>

        {/* FAQ List */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
              <Search size={32} color="#CCC" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>No results found</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Try a different search term or browse the categories on the left.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>{faq.q}</span>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: open === i ? 'rgba(246,165,0,0.1)' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {open === i ? <ChevronUp size={16} color="#F6A500" /> : <ChevronDown size={16} color="#888" />}
                    </div>
                  </button>
                  {open === i && (
                    <div style={{ padding: '0 24px 24px', color: '#555', fontSize: '14.5px', lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}