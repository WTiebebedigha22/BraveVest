import { Link } from 'react-router-dom';
import './about.css';

const ENTITIES = [
  { name: 'BraveVest Capital', role: 'Origination and underwriting of private credit facilities.' },
  { name: 'BraveVest Trustees', role: 'Custody and fiduciary oversight of investor funds.' },
  { name: 'BraveVest Advisory', role: 'Structuring and advisory for institutional mandates.' },
  { name: 'BraveVest Tech', role: 'Platform engineering, data, and compliance automation.' },
];

const FLOW = [
  'Investors fund wallets via bank transfer or card.',
  'Capital is matched to vetted, collateralized credit facilities.',
  'Borrowers repay on a fixed schedule (monthly or quarterly).',
  'Returns are distributed to investor wallets, net of fees.',
];

const PRODUCTS = [
  { name: 'Private Credit', body: 'Senior-secured lending to mid-market businesses across Nigeria.' },
  { name: 'Real Estate Notes', body: 'Short-duration notes backed by commercial and residential property.' },
  { name: 'SME Trade Finance', body: 'Working-capital facilities for importers and exporters.' },
  { name: 'Agri Cooperatives', body: 'Seasonal financing for cooperatives and processors.' },
];

const JOURNEY = [
  { n: '01', title: 'Sign Up', body: 'Create an account and complete KYC verification.' },
  { n: '02', title: 'Fund Wallet', body: 'Deposit Naira or USD directly into your wallet.' },
  { n: '03', title: 'Choose a Deal', body: 'Browse live markets and pick opportunities that match your profile.' },
  { n: '04', title: 'Invest', body: 'Select an amount and confirm — capital is deployed instantly.' },
  { n: '05', title: 'Earn Returns', body: 'Fixed returns accrue and are paid to your wallet.' },
  { n: '06', title: 'Withdraw or Reinvest', body: 'Move funds out or compound them into new deals.' },
];

const COMPLIANCE = [
  { label: 'SEC Nigeria', body: 'Registered with the Securities and Exchange Commission as an investment platform.' },
  { label: 'CBN-Aligned', body: 'Banking partners are CBN-licensed and funds are held in segregated accounts.' },
  { label: 'ISO 27001', body: 'Information security management certified across the platform.' },
];

export default function About() {
  return (
    <div className="about page-light">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero__mesh" />
        <div className="container about-hero__inner">
          <div className="about-hero__eyebrow">About BraveVest</div>
          <h1 className="about-hero__title">
            Finance that <em>respects</em><br />the real economy.
          </h1>
          <p className="about-hero__sub">
            BraveVest is a private credit platform connecting institutional and retail investors to vetted, collateralized lending opportunities across Nigeria — from solar infrastructure to SME trade finance.
          </p>
          <div className="about-hero__meta">
            <span><strong>Founded</strong> 2021</span>
            <span className="about-hero__dot" />
            <span><strong>HQ</strong> Lagos, Nigeria</span>
            <span className="about-hero__dot" />
            <span><strong>AUM</strong> ₦184.4B</span>
          </div>
          <div className="about-hero__cta">
            <Link to="/register" className="btn btn--primary">Create Account</Link>
            <Link to="/marketplace" className="btn btn--outline">View Markets</Link>
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="about-promise">
        <div className="about-promise__label">The Promise</div>
        <h2 className="about-promise__title">
          Every deal is underwritten, collateralized, and serviced by our credit team — so investors can earn fixed returns without the volatility of public markets.
        </h2>
      </section>

      {/* ── Vision / Mission + Fact Card ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid about-grid--2">
            <div className="about-vm">
              <div className="about-eyebrow">Vision</div>
              <h2 className="about-h2 about-h2--lg">
                A financial system where productive businesses can access capital — and ordinary investors can share in their growth.
              </h2>
              <div className="about-eyebrow" style={{ marginTop: 40 }}>Mission</div>
              <p className="about-body about-body--lead">
                We originate, underwrite, and service private credit facilities across energy, real estate, agri, and SME trade finance — then open them up to investors who want predictable, fixed returns backed by real assets.
              </p>
            </div>

            <div className="about-factcard">
              <div className="about-factrow">
                <span className="about-factrow__k">Assets Under Management</span>
                <span className="about-factrow__v">₦184.4B</span>
              </div>
              <div className="about-factrow">
                <span className="about-factrow__k">Active Investors</span>
                <span className="about-factrow__v">52,000+</span>
              </div>
              <div className="about-factrow">
                <span className="about-factrow__k">Average Yield</span>
                <span className="about-factrow__v">14.2%</span>
              </div>
              <div className="about-factrow">
                <span className="about-factrow__k">Cumulative Default Rate</span>
                <span className="about-factrow__v">&lt; 0.8%</span>
              </div>
              <div className="about-factrow">
                <span className="about-factrow__k">Active Deals</span>
                <span className="about-factrow__v">27</span>
              </div>
              <div className="about-factrow">
                <span className="about-factrow__k">Founded</span>
                <span className="about-factrow__v">2021</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Corporate Entities ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">Corporate Structure</div>
          <h2 className="about-h2">Four entities. One integrated platform.</h2>
          <div className="about-entities">
            {ENTITIES.map((e) => (
              <div key={e.name} className="about-entity">
                <div className="about-entity__name">{e.name}</div>
                <div className="about-entity__role">{e.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow + Products ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid about-grid--2">
            <div>
              <div className="about-eyebrow">How Capital Flows</div>
              <h2 className="about-h2">From wallet to borrower, and back.</h2>
              <ul className="about-flow">
                {FLOW.map((step, i) => (
                  <li key={i} className="about-flow__item">
                    <span className="about-flow__n">{String(i + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="about-eyebrow">Product Categories</div>
              <h2 className="about-h2">What we finance.</h2>
              <div className="about-products">
                {PRODUCTS.map((p) => (
                  <div key={p.name} className="about-product">
                    <div className="about-product__name">{p.name}</div>
                    <div className="about-product__body">{p.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pilot Card (Featured Deal) ── */}
      <section className="about-pilot">
        <div className="container">
          <div className="about-pilot__card">
            <div className="about-pilot__eyebrow">Featured Pilot</div>
            <h2 className="about-pilot__title">Lagos Solar Fund II</h2>
            <p className="about-pilot__sub">
              A 40MW distributed solar portfolio across Lagos and Ogun states, financed through a syndicated private credit facility. The fund has delivered consistent quarterly distributions to investors since inception.
            </p>
            <div className="about-pilot__grid">
              <div className="about-pilot__fact">
                <div className="about-pilot__fact-k">Target Yield</div>
                <div className="about-pilot__fact-v">14.5%</div>
              </div>
              <div className="about-pilot__fact">
                <div className="about-pilot__fact-k">Tenor</div>
                <div className="about-pilot__fact-v">18 Months</div>
              </div>
              <div className="about-pilot__fact">
                <div className="about-pilot__fact-k">Funded</div>
                <div className="about-pilot__fact-v">72%</div>
              </div>
              <div className="about-pilot__fact about-pilot__fact--wide">
                <div className="about-pilot__fact-k">Structure</div>
                <div className="about-pilot__fact-v" style={{ fontSize: 16, fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                  Senior-secured. Quarterly distributions. First-loss protection via 15% subordinated tranche held by the sponsor.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journey ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">The Investor Journey</div>
          <h2 className="about-h2">Six steps from sign-up to returns.</h2>
          <div className="about-journey">
            {JOURNEY.map((j) => (
              <div key={j.n} className="about-journey__step">
                <div className="about-journey__n">{j.n}</div>
                <div className="about-journey__title">{j.title}</div>
                <div className="about-journey__body">{j.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Due Diligence ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">Due Diligence</div>
          <h2 className="about-h2">How we vet every deal.</h2>
          <div className="about-grid about-grid--2 about-dd">
            <div className="about-dd__col">
              <div className="about-dd__title">Borrower Criteria</div>
              <ul className="about-checklist about-checklist--tall">
                <li>Minimum 3 years of audited financials</li>
                <li>Positive cash flow and adequate debt service coverage</li>
                <li>Collateral valued by independent appraisers</li>
                <li>Sponsor co-investment of at least 10%</li>
                <li>Clean credit and litigation history</li>
              </ul>
            </div>
            <div className="about-dd__col">
              <div className="about-dd__title">Deal Structure</div>
              <ul className="about-checklist about-checklist--tall">
                <li>Senior secured position with first priority</li>
                <li>Collateral coverage ratio of at least 1.5x</li>
                <li>Personal or corporate guarantees where applicable</li>
                <li>Reserve accounts for interest and principal</li>
                <li>Quarterly covenant testing</li>
              </ul>
            </div>
          </div>
          <p className="about-body about-dd__footnote" style={{ maxWidth: 760 }}>
            Our credit committee reviews every deal before it's listed. Post-investment, we monitor covenants, collect payments, and engage recovery teams where necessary.
          </p>
        </div>
      </section>

      {/* ── Chips ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">Sectors We Cover</div>
          <h2 className="about-h2">Diversified across the real economy.</h2>
          <div className="about-chips">
            {['Energy', 'Real Estate', 'Agri', 'SME Trade Finance', 'Logistics', 'Healthcare', 'Education', 'Fintech'].map((s) => (
              <span key={s} className="about-chip">{s}</span>
            ))}
            <span className="about-chip about-chip--solid">And more</span>
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">Compliance & Regulation</div>
          <h2 className="about-h2">Built to institutional standards.</h2>
          <div className="about-compliance">
            {COMPLIANCE.map((c) => (
              <div key={c.label} className="about-comp">
                <div className="about-comp__label">{c.label}</div>
                <div className="about-comp__body">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-eyebrow">Roadmap</div>
          <h2 className="about-h2">Where we're going next.</h2>
          <div className="about-roadmap">
            <div className="about-roadmap__row">
              <div className="about-roadmap__q">Q4 2026</div>
              <div className="about-roadmap__focus">Launch USD-denominated private credit products for diaspora investors.</div>
            </div>
            <div className="about-roadmap__row">
              <div className="about-roadmap__q">Q1 2027</div>
              <div className="about-roadmap__focus">Expand into Ghana and Kenya. Roll out secondary market for deal units.</div>
            </div>
            <div className="about-roadmap__row">
              <div className="about-roadmap__q">Q2 2027</div>
              <div className="about-roadmap__focus">Institutional API for allocators. Launch BraveVest Card for cashback on deals.</div>
            </div>
            <div className="about-roadmap__row">
              <div className="about-roadmap__q">Q3 2027</div>
              <div className="about-roadmap__focus">Pilot tokenized real estate notes with partner custodian.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__card">
            <div className="about-cta__mesh" />
            <div className="about-cta__eyebrow">Get Started</div>
            <h2 className="about-cta__title">Ready to put your capital to work?</h2>
            <p className="about-cta__sub">Browse live deals or talk to our team about private mandates.</p>
            <div className="about-cta__actions">
              <Link to="/register" className="btn btn--primary">Create Account</Link>
              <Link to="/marketplace" className="btn btn--outline">View Markets</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}