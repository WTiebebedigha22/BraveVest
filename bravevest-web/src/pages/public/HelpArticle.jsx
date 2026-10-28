import { useParams, Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import './HelpArticle.css';

// Content generator function to allow dynamic currency formatting
const getArticleContent = (format) => ({
  'how-verification-works': {
    cat: 'Getting started',
    title: 'How does BraveVest verify projects?',
    intro: 'Every project listed on BraveVest goes through a structured verification process before investors can fund it.',
    steps: [
      'Sponsor verification: We confirm the identity, track record, and financial capacity of the project sponsor or originator.',
      'Land/title review: For property and development projects, we review title documents, survey plans, and encumbrances.',
      'Budget review: Project budget, cost assumptions, and use-of-funds statements are checked against current market rates.',
      'Timeline review: Development timelines are assessed for realism given the scope.',
      'Site inspection: For construction projects, we conduct a physical inspection or engage a trusted partner.',
      'Investment committee review: The opportunity is evaluated and approved by our investment committee before listing.',
      'Ongoing monitoring: After listing, we track progress against key milestones and issue regular reports to investors.',
    ],
    outro: 'If you have questions about a specific project, feel free to contact investor relations.',
  },
  'understanding-returns': {
    cat: 'Investing',
    title: 'Understanding your returns and payout schedule',
    body: [
      'Returns on BraveVest are calculated based on the expected annual percentage return (%) and the tenor of the investment.',
      `Example: ${format(1000000)} invested in a 24-month project at 15% p.a. yields ${format(300000)} in total returns (15% × 2 years).`,
      'Payout frequency depends on the specific product: monthly, quarterly, annually, or bullet (all paid at maturity).',
      'You can calculate exact projected values for any project using the return calculator on the project detail page.',
      'Important Note: Projected returns are estimates based on financial modeling, not guarantees. Actual returns depend on project execution.',
    ],
  },
  'kyc-guide': {
    cat: 'Getting started',
    title: 'How to complete your KYC verification',
    intro: 'BraveVest is required by financial regulations to verify the identity of every investor before funding opportunities.',
    steps: [
      'Personal Details: Provide your full name, date of birth, gender, nationality, and occupation.',
      'Identity Document: Upload a valid government-issued ID (NIN, BVN, Passport, Driver\'s License, or Voter\'s Card).',
      'Residential Address: Submit your current proof of address.',
      'Bank Account: Connect the verified bank account where return payouts should land.',
      'Review & Submit: Confirm details and submit your verification profile.',
    ],
    outro: 'Our compliance team reviews submissions within 24–48 hours. You will receive an email once your KYC is approved.',
  },
  'risk-explained': {
    cat: 'Investing',
    title: 'Understanding investment risk ratings',
    intro: 'All financial investments carry degree of risk. BraveVest assigns every project a risk rating (Low, Medium, or High) evaluated against:',
    bullets: [
      'Project sponsor track record & capacity',
      'Security or collateral backing the asset',
      'Repayment source certainty & liquidity',
      'Prevailing macro-market conditions',
      'Timeline feasibility & execution dependencies',
    ],
    outro: 'Diversification is key: spreading capital across different product categories and projects reduces overall portfolio risk.',
  },
  'project-default': {
    cat: 'Safety',
    title: 'What happens if a project defaults?',
    intro: 'While project default is rare due to strict underwriting, we maintain a clear protocol when payments or milestones are missed:',
    steps: [
      'Early Warning: We contact the project operator and escalate the issue immediately to the investment committee.',
      'Cure Period: The operator is given a defined grace window to catch up or restructure repayments.',
      'Enforcement: If cure fails, we activate underlying security (collateral, corporate guarantees, or legal proceedings).',
      'Recovery & Distribution: Recovered funds are distributed proportionally back to investors after recovery costs.',
      'Transparent Updates: Investors receive written reports at each stage of the recovery process.',
    ],
  },
  'fees-explained': {
    cat: 'Money',
    title: 'All platform fees, explained transparently',
    intro: 'Transparent fee structures are core to BraveVest. Here is how fees work across our products:',
    bullets: [
      'Structuring Fee (1–3%): Paid directly by the project sponsor, never the investor.',
      'Platform Administration Fee (0.5–2%): Covers onboarding, documentation, and reporting.',
      'Project Management Fee (2–5%): Paid by the sponsor for ongoing execution oversight.',
      'Performance Fee (10–20%): Only triggered when a project exceeds agreed benchmark returns.',
      'Property Management Fee (5–10%): Applies specifically to rental or lease income products.',
    ],
    outro: 'Investors see net return rates on each project page—all platform fees are pre-factored into published returns.',
  },
  'withdrawing': {
    cat: 'Money',
    title: 'How to withdraw your returns',
    body: [
      'Returns are automatically disbursed directly to the verified bank account linked to your profile.',
      'For scheduled monthly or quarterly payouts, funds settle within 1–3 business days of the payout date.',
      'For bullet payouts, total principal and returns arrive directly upon project maturity.',
      'To update your receiving bank account, navigate to Profile → Bank Details. Account updates are verified within 24 hours.',
      'Zero Withdrawal Fees: Bank transfers are processed with no added platform fees.',
    ],
  },
  'taxes': {
    cat: 'Money',
    title: 'Taxes on your investment returns',
    body: [
      'Returns earned on BraveVest may be subject to local taxation depending on your individual tax residency and product type.',
      'BraveVest provides a downloadable annual statement of earnings from your dashboard for easy tax filing.',
      'We do not automatically withhold tax on returns for individual retail accounts by default.',
      'For personalized advice, please consult a certified tax professional. BraveVest does not provide tax or legal advice.',
    ],
  },
  'security': {
    cat: 'Safety',
    title: 'How we keep your account and funds secure',
    intro: 'Bank-grade security standards are embedded across the entire BraveVest architecture:',
    bullets: [
      '256-bit SSL encryption on all Web & API endpoints',
      'PCI-DSS compliant regulated payment partners',
      'Two-Factor Authentication (2FA) enforcement options',
      'Encrypted storage of sensitive personal data',
      'Routine third-party security audits and penetration testing',
    ],
    outro: 'Security tip: Never share your password or OTPs. BraveVest support will never request your login credentials via email or telephone.',
  },
  'co-investing': {
    cat: 'Advanced',
    title: 'Co-investing with groups & cooperatives',
    body: [
      'BraveVest CoFund enables cooperatives, families, associations, and diaspora groups to pool capital and invest together.',
      'Key Benefits for Groups:',
      '• Dedicated group dashboard and consolidated financial reporting',
      '• Multi-signatory controls and transparent member tracking',
      '• Priority access and custom deal allocation for institutional pool sizes',
      'Reach out to our investor relations team to onboard your group onto CoFund.',
    ],
  },
  'prime-circle': {
    cat: 'Advanced',
    title: 'BraveVest Prime & Circle membership',
    body: [
      'BraveVest Prime is tailored for high-ticket investors seeking premium private deals, institutional-style syndicates, and direct co-investments.',
      'BraveVest Circle is our private investor community offering early deal access, exclusive site inspections, quarterly executive roundtables, and direct developer Q&As.',
      'Membership is by invitation or qualification. Contact investor relations to discuss your portfolio eligibility.',
    ],
  },
  'dispute-resolution': {
    cat: 'Safety',
    title: 'Filing a complaint or dispute',
    intro: 'If you have concerns regarding a project, payout delay, or technical issue, follow our formal resolution process:',
    steps: [
      'Email complaints@bravevest.com with your registered email, account ID, and description of the issue.',
      'Our team issues a formal ticket confirmation within 1 business day.',
      'An internal investigation is conducted with a full response issued within 10 business days.',
      'If unresolved, the dispute escalates to the Investment Review Board for final binding arbitration.',
    ],
  },
});

export default function HelpArticle() {
  const { format } = useCurrency();
  const { slug } = useParams();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const articles = getArticleContent(format);
  const article = articles[slug];

  useSEO({
    title: article ? article.title : 'Article Not Found',
    description: article ? (article.intro || article.body?.[0]) : 'Help article on BraveVest.',
    canonical: `/help/${slug}`,
  });

  if (!article) {
    return (
      <div className="help-article container">
        <Link to="/help" className="help-article__back">← Back to Help Center</Link>
        <h1 className="help-article__title">Article not found</h1>
        <p className="text-muted">The article you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  // Related articles in the same category
  const relatedArticles = Object.entries(articles)
    .filter(([key, item]) => item.cat === article.cat && key !== slug)
    .slice(0, 3);

  return (
    <article className="help-article container">
      <Link to="/help" className="help-article__back">← Back to Help Center</Link>
      
      <div className="help-article__cat">{article.cat}</div>
      <h1 className="help-article__title">{article.title}</h1>

      <div className="help-article__body">
        {/* Intro text */}
        {article.intro && <p className="help-article__lead">{article.intro}</p>}

        {/* Paragraphs */}
        {article.body && article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {/* Bullet Lists */}
        {article.bullets && (
          <ul className="help-article__bullets">
            {article.bullets.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {/* Ordered Steps */}
        {article.steps && (
          <ol className="help-article__steps">
            {article.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        )}

        {/* Outro text */}
        {article.outro && <p className="help-article__outro">{article.outro}</p>}
      </div>

      {/* Helpful Feedback Widget */}
      <div className="help-article__feedback">
        {feedbackGiven ? (
          <span className="help-article__feedback-thanks">Thank you for your feedback!</span>
        ) : (
          <>
            <span>Was this article helpful?</span>
            <div className="help-article__feedback-btns">
              <button type="button" onClick={() => setFeedbackGiven(true)} className="help-article__btn-feedback">Yes</button>
              <button type="button" onClick={() => setFeedbackGiven(true)} className="help-article__btn-feedback">No</button>
            </div>
          </>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="help-article__related">
          <h3>Related in {article.cat}</h3>
          <ul>
            {relatedArticles.map(([key, item]) => (
              <li key={key}>
                <Link to={`/help/${key}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Support Prompt */}
      <div className="help-article__foot">
        <div className="help-article__foot-title">Still need assistance?</div>
        <Link to="/contact" className="help-article__foot-link">Contact Investor Support →</Link>
      </div>
    </article>
  );
}