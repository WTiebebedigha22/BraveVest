import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import './About.css';
import { useSEO } from '@/hooks/useSEO';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Content pulled from BraveVest Marketplace brand document.
   All copy is verbatim or lightly tightened from the source.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const corporateStructure = [
  { entity: 'Bravelion Holdings',        role: 'Mother company and corporate group owner.' },
  { entity: 'Bravelion Capital',         role: 'Proposed investment arm for structuring, coordinating and administering opportunities.' },
  { entity: 'BraveVest Marketplace',     role: 'Platform brand where investors access verified opportunities.' },
  { entity: 'Bravelion Estates & Development', role: 'Originator, sponsor or executor of property and development opportunities.' },
];

const productCategories = [
  { name: 'BraveVest Projects',  blurb: 'Project-backed opportunities across construction milestones, estate infrastructure, site clearing, road works and materials procurement.' },
  { name: 'BraveVest Property',  blurb: 'Real estate-backed opportunities: residential, commercial, mixed-use, acquisition, renovation and buy-build-sell.' },
  { name: 'BraveVest Income',    blurb: 'Income-generating assets: rentals, short-lets, shops, warehouses, offices, student and staff housing.' },
  { name: 'BraveVest Notes',     blurb: 'Short-term structured products tied to projects, assets or business transactions.' },
  { name: 'BraveVest BuildFund', blurb: 'Construction and infrastructure funding from foundation to finishing stages.' },
  { name: 'BraveVest LandBank',  blurb: 'Land acquisition, title processing, survey, layout, allocation and appreciation opportunities.' },
  { name: 'BraveVest Credit',    blurb: 'Credit-backed opportunities: SME, salary-backed, asset-backed, invoice-backed and trade finance.' },
  { name: 'BraveVest Prime',     blurb: 'Premium private opportunities for selected investors â€” larger deals, co-investments, institutional-style offers.' },
  { name: 'BraveVest Circle',    blurb: 'Private investment community with early access, briefings, site inspections and priority allocation.' },
  { name: 'BraveVest CoFund',    blurb: 'Group investment structure for cooperatives, associations, families, churches and diaspora groups.' },
];

const marketSteps = [
  'Opportunity identification',
  'Document collection',
  'Due diligence',
  'Financial analysis',
  'Risk assessment',
  'Investment committee review',
  'Legal documentation',
  'Platform listing',
  'Investor subscription',
  'Monitoring and reporting',
  'Return distribution',
];

const investorJourney = [
  { title: 'Access',   body: 'Investor visits BraveVest Marketplace and reviews available opportunities.' },
  { title: 'Review',   body: 'Check product summary, amount required, minimum investment, tenure, projected return, risk rating and repayment source.' },
  { title: 'Onboard',  body: 'Complete KYC, bank details, next of kin, source-of-funds declaration, risk acknowledgement and agreement acceptance.' },
  { title: 'Subscribe',body: 'Select an opportunity and purchase investment units or fund a credit/project opportunity.' },
  { title: 'Track',    body: 'Receive email, dashboard, WhatsApp, PDF, photo, video and financial updates.' },
  { title: 'Receive',  body: 'Returns are distributed according to the documented product terms.' },
];

const dueDiligenceProperty = [
  'Project sponsor verification',
  'Land / title review',
  'Budget review',
  'Project timeline',
  'Use-of-funds statement',
  'Site inspection',
  'Cost validation',
  'Exit plan',
  'Return source confirmation',
  'Risk rating',
];

const dueDiligenceCredit = [
  'Borrower identity verification',
  'BVN / NIN verification',
  'Bank statement review',
  'Income / cashflow review',
  'Credit bureau check',
  'Guarantor check where applicable',
  'Collateral or asset review',
  'Repayment capacity assessment',
  'Loan purpose validation',
  'Risk rating',
];

const riskAreas = [
  'Project execution risk',
  'Cost overrun risk',
  'Market risk',
  'Borrower default risk',
  'Liquidity risk',
  'Documentation risk',
  'Regulatory risk',
  'Data protection risk',
  'Operational risk',
  'Reputation risk',
];

const compliance = [
  { label: 'CAC',                body: 'Registration and corporate governance.' },
  { label: 'SEC',                body: 'Compliance for investment and crowdfunding-related activities.' },
  { label: 'FCCPC',              body: 'Compliance for digital lending and consumer credit products.' },
  { label: 'Data Protection',    body: 'Data protection compliance and AML/KYC procedures.' },
  { label: 'Tax',                body: 'Tax compliance across all entities.' },
  { label: 'Investor Disclosure',body: 'Investor disclosure and complaints handling.' },
];

const governance = [
  'Bravelion Holdings Board',
  'Bravelion Capital Management',
  'BraveVest Marketplace Management',
  'Investment Committee',
  'Product / Project Teams',
  'Investor Relations and Reporting',
];

const leadershipRoles = [
  'Managing Director / Business Lead',
  'Investment Committee',
  'Finance Lead',
  'Legal and Compliance Adviser',
  'Project Manager',
  'Credit Risk Officer',
  'Investor Relations Officer',
];

const roadmap = [
  { q: 'Q1', focus: 'Brand setup, Bravelion Capital structure, BraveVest documentation, Projects 001, investor onboarding and pilot reporting.' },
  { q: 'Q2', focus: 'BraveVest Property, BuildFund, Circle, investor dashboard MVP and project pipeline expansion.' },
  { q: 'Q3', focus: 'BraveVest Credit, Notes, borrower onboarding, credit risk framework and payment tracking module.' },
  { q: 'Q4', focus: 'BraveVest Income, CoFund, Prime, cooperative partnerships and expanded dashboard and reporting tools.' },
];

const advantages = [
  'Bravelion brand backing',
  'Verified opportunity listing',
  'Multiple investment categories',
  'Real estate and project development foundation',
  'Structured due diligence',
  'Clear documentation',
  'Investor reporting',
  'Risk-based product design',
  'Combined property, project, income and credit offerings',
  'Scalable marketplace model',
];

export default function About() {
  useSEO({
    title: 'About â€” Powered by Bravelion Capital',
    description: 'BraveVest Marketplace is a multi-opportunity investment platform powered by Bravelion Capital, a Bravelion Holdings company.',
    canonical: '/#/about',
  });
  return (
    <article className="about">
      {/* â”€â”€ Hero â”€â”€ */}
      <section className="about-hero">
        <div className="about-hero__mesh" aria-hidden />
        <div className="container about-hero__inner">
          <div className="about-hero__eyebrow">About BraveVest</div>
          <h1 className="about-hero__title">
            A multi-opportunity marketplace<br />
            for <em>verified</em> investment.
          </h1>
          <p className="about-hero__sub">
            BraveVest Marketplace is a multi-opportunity investment platform built to give
            individuals, groups, cooperatives, businesses and institutional investors access to
            verified opportunities across real estate, project finance, asset-backed investments,
            income-generating assets and credit-backed lending.
          </p>
          <div className="about-hero__meta">
            <span><strong>Powered by</strong> Bravelion Capital</span>
            <span className="about-hero__dot" />
            <span><strong>A company of</strong> Bravelion Holdings</span>
          </div>
          <div className="about-hero__cta">
            <Button as={Link} to="/register" variant="primary" size="lg">Create an account</Button>
            <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse opportunities</Button>
          </div>
        </div>
      </section>

      {/* â”€â”€ Core promise â”€â”€ */}
      <section className="about-promise container">
        <div className="about-promise__label">Core promise</div>
        <h2 className="about-promise__title">
          Verified opportunities. Structured access.<br />
          Transparent reporting. Shared growth.
        </h2>
      </section>

      {/* â”€â”€ Brand meaning â”€â”€ */}
      <section className="about-section container">
        <div className="about-grid about-grid--2">
          <div>
            <SectionEyebrow>Brand meaning</SectionEyebrow>
            <h2 className="about-h2">Courage to invest wisely.</h2>
            <p className="about-body">
              BraveVest combines the strength of the Bravelion identity with the idea of
              investment, bold participation, confidence, growth and structured wealth creation.
              It communicates courage to invest wisely, access to vetted opportunities and a
              marketplace of structured investment choices.
            </p>
          </div>
          <div className="about-factcard">
            <FactRow k="Platform"   v="BraveVest Marketplace" />
            <FactRow k="Tagline"    v="Access Verified Investment Opportunities" />
            <FactRow k="Brand flow" v="Powered by Bravelion Capital, A Bravelion Holdings Company" />
          </div>
        </div>
      </section>

      {/* â”€â”€ Vision & Mission â”€â”€ */}
      <section className="about-section container">
        <div className="about-grid about-grid--2">
          <div className="about-vm">
            <SectionEyebrow>Vision</SectionEyebrow>
            <h2 className="about-h2">A trusted African investment marketplace.</h2>
            <p className="about-body">
              To become a trusted African investment marketplace that connects capital to verified
              projects, real assets, businesses and income-generating opportunities.
            </p>
          </div>
          <div className="about-vm">
            <SectionEyebrow>Mission</SectionEyebrow>
            <h2 className="about-h2">Structured access. Professional selection.</h2>
            <p className="about-body">
              To provide investors with structured access to verified investment opportunities
              through transparent documentation, professional project selection, risk-based
              packaging and reliable investor reporting.
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ Corporate structure â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Corporate structure</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">The Bravelion group.</h2>

        <div className="about-entities">
          {corporateStructure.map((e) => (
            <div key={e.entity} className="about-entity">
              <div className="about-entity__name">{e.entity}</div>
              <p className="about-entity__role">{e.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Marketplace model â”€â”€ */}
      <section className="about-section container">
        <div className="about-grid about-grid--2">
          <div>
            <SectionEyebrow>Marketplace model</SectionEyebrow>
            <h2 className="about-h2">How opportunities flow.</h2>
            <p className="about-body">
              BraveVest operates as a structured investment access platform where investors can
              choose opportunities based on investment amount, tenure, expected return, risk
              profile, asset class, project type, repayment source, income model and investor
              preference.
            </p>
            <p className="about-body">
              Opportunities are reviewed, packaged and listed. Investors subscribe to units or
              fund selected opportunities. Progress, repayment and returns are tracked through
              reports and platform records.
            </p>
          </div>
          <ol className="about-flow">
            {marketSteps.map((s, i) => (
              <li key={s} className="about-flow__item">
                <span className="about-flow__n">{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* â”€â”€ Product categories â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Investment opportunities &amp; packages</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">Ten product families.</h2>
        <p className="about-body about-body--lead">
          Each package carries product terms, minimum investment, target raise, tenure, projected
          return, risk rating, backing / security, use of funds and reporting structure.
        </p>

        <div className="about-products">
          {productCategories.map((p) => (
            <div key={p.name} className="about-product">
              <div className="about-product__name">{p.name}</div>
              <p className="about-product__body">{p.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Pilot package â”€â”€ */}
      <section className="about-pilot container">
        <div className="about-pilot__card">
          <div className="about-pilot__eyebrow">First launch package</div>
          <h2 className="about-pilot__title">BraveVest Projects 001</h2>
          <p className="about-pilot__sub">
            The initial pilot product designed to validate the marketplace model, investor
            onboarding, project reporting structure and payout administration.
          </p>
          <div className="about-pilot__grid">
            <PilotFact k="Target raise"            v="â‚¦5,000,000" />
            <PilotFact k="Unit price"              v="â‚¦50,000" />
            <PilotFact k="Total units"             v="100" />
            <PilotFact k="Minimum investment"      v="â‚¦50,000" />
            <PilotFact k="Maximum per investor"    v="â‚¦500,000 â€“ â‚¦1,000,000" />
            <PilotFact k="Tenor"                   v="3 â€“ 6 months" />
            <PilotFact k="Projected return"        v="Up to 3% monthly equivalent" wide />
          </div>
        </div>
      </section>

      {/* â”€â”€ Investor journey â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Investor journey</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">From access to returns.</h2>

        <div className="about-journey">
          {investorJourney.map((s, i) => (
            <div key={s.title} className="about-journey__step">
              <div className="about-journey__n">{String(i + 1).padStart(2, '0')}</div>
              <div className="about-journey__title">{s.title}</div>
              <p className="about-journey__body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Due diligence â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Due diligence</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">What we check before we list.</h2>

        <div className="about-grid about-grid--2 about-dd">
          <div className="about-dd__col">
            <div className="about-dd__title">Property &amp; project opportunities</div>
            <ul className="about-checklist">
              {dueDiligenceProperty.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div className="about-dd__col">
            <div className="about-dd__title">Credit opportunities</div>
            <ul className="about-checklist">
              {dueDiligenceCredit.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* â”€â”€ Risk â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Risk management</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">Risk areas we name openly.</h2>
        <div className="about-chips">
          {riskAreas.map((r) => <span key={r} className="about-chip">{r}</span>)}
        </div>
        <p className="about-body about-body--lead about-dd__footnote">
          Every opportunity carries a risk rating. Investors acknowledge risk before subscribing.
          Separate records are kept for each opportunity, with clear use-of-funds documentation,
          regular reporting and legal agreements for every transaction.
        </p>
      </section>

      {/* â”€â”€ Compliance â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Compliance &amp; regulatory framework</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">Built inside the rules.</h2>
        <div className="about-compliance">
          {compliance.map((c) => (
            <div key={c.label} className="about-comp">
              <div className="about-comp__label">{c.label}</div>
              <p className="about-comp__body">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="about-body about-body--lead about-dd__footnote">
          The marketplace operates through internal legal review, external compliance advisory,
          proper documentation and, where required, registration, approval, partnership or
          licensing through the relevant regulators.
        </p>
      </section>

      {/* â”€â”€ Governance â”€â”€ */}
      <section className="about-section container">
        <div className="about-grid about-grid--2">
          <div>
            <SectionEyebrow>Governance structure</SectionEyebrow>
            <h2 className="about-h2">Layers of oversight.</h2>
            <ul className="about-checklist about-checklist--tall">
              {governance.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
          <div>
            <SectionEyebrow>Leadership roles</SectionEyebrow>
            <h2 className="about-h2">Who runs the platform.</h2>
            <ul className="about-checklist about-checklist--tall">
              {leadershipRoles.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* â”€â”€ Roadmap â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>First-year roadmap</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">From pilot to platform.</h2>

        <div className="about-roadmap">
          {roadmap.map((r) => (
            <div key={r.q} className="about-roadmap__row">
              <div className="about-roadmap__q">{r.q}</div>
              <div className="about-roadmap__focus">{r.focus}</div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Advantage â”€â”€ */}
      <section className="about-section container">
        <SectionEyebrow>Competitive advantage</SectionEyebrow>
        <h2 className="about-h2 about-h2--lg">Why BraveVest.</h2>
        <div className="about-chips">
          {advantages.map((a) => <span key={a} className="about-chip about-chip--solid">{a}</span>)}
        </div>
      </section>

      {/* â”€â”€ Closing CTA â”€â”€ */}
      <section className="about-cta container">
        <div className="about-cta__card">
          <div className="about-cta__mesh" aria-hidden />
          <div className="about-cta__eyebrow">Access Verified Investment Opportunities</div>
          <h2 className="about-cta__title">Ready to invest?</h2>
          <p className="about-cta__sub">
            BraveVest Marketplace Â· Powered by Bravelion Capital Â· A Bravelion Holdings Company
          </p>
          <div className="about-cta__actions">
            <Button as={Link} to="/register" variant="primary" size="lg">Create your account</Button>
            <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse opportunities</Button>
          </div>
        </div>
      </section>
    </article>
  );
}

/* â”€â”€ Small presentational helpers â”€â”€ */

function SectionEyebrow({ children }) {
  return <div className="about-eyebrow">{children}</div>;
}

function FactRow({ k, v }) {
  return (
    <div className="about-factrow">
      <span className="about-factrow__k">{k}</span>
      <span className="about-factrow__v">{v}</span>
    </div>
  );
}

function PilotFact({ k, v, wide }) {
  return (
    <div className={`about-pilot__fact ${wide ? 'about-pilot__fact--wide' : ''}`}>
      <div className="about-pilot__fact-k">{k}</div>
      <div className="about-pilot__fact-v">{v}</div>
    </div>
  );
}