import { useParams, Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import './HelpArticle.css';

const CONTENT = {
  'how-verification-works': {
    cat: 'Getting started',
    title: 'How does BraveVest verify projects?',
    body: [
      'Every project listed on BraveVest goes through a structured verification process before investors can fund it.',
      '1. Sponsor verification â€” we confirm the identity, track record, and financial capacity of the project sponsor or originator.',
      '2. Land/title review â€” for property and development projects, we review the title documents, survey plans, and any encumbrances.',
      '3. Budget review â€” the project budget, cost assumptions, and use-of-funds statement are checked against market rates.',
      '4. Timeline review â€” the development timeline is assessed for realism given the scope.',
      '5. Site inspection â€” for construction and development projects, we conduct a physical inspection or send a trusted partner.',
      '6. Investment committee review â€” the opportunity is approved by our investment committee before it goes live.',
      '7. Ongoing monitoring â€” after listing, we track progress against milestones and report to investors.',
      'If you have questions about a specific project, contact investor relations.',
    ],
  },
  'understanding-returns': {
    cat: 'Investing',
    title: 'Understanding your returns and payout schedule',
    body: [
      'Returns on BraveVest are calculated based on the expected annual return % and the tenor of the investment.',
      'Example: â‚¦1,000,000 invested in a 24-month project at 15% p.a. returns â‚¦300,000 in total (15% Ã— 2 years).',
      'Payout frequency depends on the product: monthly, quarterly, annually, or bullet (all at maturity).',
      'You can see the exact projected values for any project using the return calculator on the project page.',
      'Important: projected returns are estimates, not guarantees. Actual returns depend on project performance.',
    ],
  },
  'kyc-guide': {
    cat: 'Getting started',
    title: 'How to complete your KYC',
    body: [
      'BraveVest is required by Nigerian financial regulations to verify the identity of every investor.',
      'Step 1 â€” Personal details: date of birth, gender, nationality, occupation.',
      'Step 2 â€” Identity: upload a government-issued ID (NIN, BVN, passport, driver\'s license, or voter\'s card).',
      'Step 3 â€” Address: provide your residential address.',
      'Step 4 â€” Bank: provide the bank account where payouts should land.',
      'Step 5 â€” Review and submit: confirm your details and submit for review.',
      'Our compliance team reviews submissions within 24â€“48 hours. You will receive an email when your KYC is approved.',
    ],
  },
  'risk-explained': {
    cat: 'Investing',
    title: 'Understanding investment risk',
    body: [
      'All investments carry risk. BraveVest assigns each project a risk level (low, medium, or high) based on:',
      'Â· Project sponsor track record',
      'Â· Security or collateral backing the project',
      'Â· Repayment source certainty',
      'Â· Market conditions',
      'Â· Timeline feasibility',
      'Risk levels are shown on every project page. Investors must acknowledge risk before subscribing.',
      'Diversification is your best defense: spreading capital across categories and projects reduces overall risk.',
      'Read the full disclosure before investing.',
    ],
  },
  'project-default': {
    cat: 'Safety',
    title: 'What happens if a project defaults?',
    body: [
      'Project default is rare but possible. Our process when a project misses a payment or milestone:',
      '1. Early warning â€” we contact the operator and escalate to the investment committee.',
      '2. Cure period â€” the operator has a defined window to catch up or restructure.',
      '3. Enforcement â€” if cure fails, we activate the security (collateral, guarantees, or legal action).',
      '4. Recovery â€” funds recovered are distributed to investors proportionally after costs.',
      '5. Reporting â€” investors receive a written update at each stage.',
      'Timelines vary. Recovery can take weeks to months depending on the asset backing the project.',
    ],
  },
  'fees-explained': {
    cat: 'Money',
    title: 'All fees, explained',
    body: [
      'Transparent fees are core to BraveVest. Here is what we charge:',
      'Â· Structuring fee (1â€“3%): paid by the project sponsor, not the investor.',
      'Â· Platform administration fee (0.5â€“2%): covers onboarding, documentation, and reporting.',
      'Â· Project management fee (2â€“5%): paid by the sponsor for monitoring and execution oversight.',
      'Â· Performance fee (10â€“20%): only charged when a project exceeds agreed benchmarks.',
      'Â· Property management fee (5â€“10%): for rental or lease income products.',
      'Investors see the net return rate on each project page â€” all fees are already accounted for.',
    ],
  },
  'withdrawing': {
    cat: 'Money',
    title: 'How to withdraw your returns',
    body: [
      'Returns are automatically paid to the bank account on file for your account.',
      'For monthly or quarterly payouts, funds arrive on or within 3 business days of the scheduled payout date.',
      'For bullet payouts, funds arrive at maturity.',
      'To change your bank account, go to Profile â†’ Bank details and submit the update. Changes are verified within 24 hours.',
      'Withdrawal fees: none. Transfers are handled by our payment partner.',
    ],
  },
  'taxes': {
    cat: 'Money',
    title: 'Taxes on your returns',
    body: [
      'Returns from investments on BraveVest may be subject to Nigerian tax depending on your tax status and the product type.',
      'BraveVest provides an annual statement of returns you can use for tax filing.',
      'We do not withhold tax on returns for individual investors by default.',
      'For specific guidance, consult a tax adviser. BraveVest does not provide tax advice.',
    ],
  },
  'security': {
    cat: 'Safety',
    title: 'How we keep your account secure',
    body: [
      'Bank-grade security is standard across BraveVest:',
      'Â· 256-bit SSL encryption on every page',
      'Â· PCI-DSS compliant payment processors',
      'Â· Two-factor authentication (2FA) available on all accounts',
      'Â· Encrypted storage of sensitive data',
      'Â· Regular security audits',
      'To protect yourself: never share your password, verify URLs before logging in, and enable 2FA. BraveVest will never ask for your password by email or SMS.',
    ],
  },
  'co-investing': {
    cat: 'Advanced',
    title: 'Co-investing with groups',
    body: [
      'BraveVest CoFund lets cooperatives, families, associations, churches, and diaspora groups invest together.',
      'How it works:',
      'Â· A group representative creates a CoFund account',
      'Â· Members contribute via a shared portal',
      'Â· The group invests in selected projects under one profile',
      'Â· Returns are distributed to members proportionally',
      'CoFund accounts get: consolidated reporting, private briefings, and priority allocation on selected products.',
      'Contact investor relations to set up a CoFund.',
    ],
  },
  'prime-circle': {
    cat: 'Advanced',
    title: 'Prime & Circle explained',
    body: [
      'BraveVest Prime is our tier for high-ticket investors seeking premium opportunities: larger project deals, private co-investments, and institutional-style offers.',
      'BraveVest Circle is our private investment community: early access, private briefings, site inspections, and quarterly portfolio updates.',
      'Qualification is by invitation or by request. Reach out to investor relations to discuss eligibility.',
    ],
  },
  'dispute-resolution': {
    cat: 'Safety',
    title: 'Filing a complaint',
    body: [
      'If you have a complaint about a project, a payout, or the platform:',
      '1. Email complaints@bravevest.com with your name, account email, and description.',
      '2. You will receive an acknowledgement within 1 business day.',
      '3. We investigate and respond within 10 business days.',
      '4. If unresolved, the matter escalates to the investment committee.',
      '5. You may also contact the relevant regulator if you are not satisfied with our final response.',
      'We take every complaint seriously and log all reports for compliance review.',
    ],
  },
};

export default function HelpArticle() {
  const { slug } = useParams();
  const article = CONTENT[slug];

  useSEO({
    title: article ? article.title : 'Article not found',
    description: article ? article.body[0] : 'Help article on BraveVest.',
    canonical: `/#/help/${slug}`,
  });

  if (!article) {
    return (
      <div className="help-article container">
        <Link to="/help" className="help-article__back">â† All articles</Link>
        <h1>Article not found</h1>
        <p className="text-muted">The article you're looking for doesn't exist or was moved.</p>
      </div>
    );
  }

  return (
    <article className="help-article container">
      <Link to="/help" className="help-article__back">â† All articles</Link>
      <div className="help-article__cat">{article.cat}</div>
      <h1 className="help-article__title">{article.title}</h1>

      <div className="help-article__body">
        {article.body.map((p, i) => (
          <p key={i} className={p.startsWith('Â·') || /^\d\./.test(p) ? 'help-article__list-item' : ''}>
            {p}
          </p>
        ))}
      </div>

      <div className="help-article__foot">
        <div className="help-article__foot-title">Still need help?</div>
        <Link to="/contact" className="help-article__foot-link">Contact support â†’</Link>
      </div>
    </article>
  );
}