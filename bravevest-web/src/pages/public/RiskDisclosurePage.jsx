import LegalLayout from '@/components/shared/LegalLayout';

export default function RiskDisclosurePage() {
  const sections = [
    {
      id: 'overview',
      heading: '1. What You Need to Know',
      body: [
        'Investing on BraveVest involves risk. The information on this page is intended to help you understand what those risks are, so you can decide whether investing is appropriate for you.',
        'This page is a summary. It does not cover every risk. If anything here is unclear, do not invest until you have spoken to someone who can explain it in the context of your own circumstances.',
      ],
    },
    {
      id: 'capital-loss',
      heading: '2. Risk of Capital Loss',
      body: [
        'You can lose some or all of the money you invest. Unlike a bank deposit, investments on the Platform are not covered by any deposit insurance scheme.',
        'If a project sponsor fails to execute as planned, if market conditions change, or if a borrower defaults, you may not recover your capital.',
      ],
    },
    {
      id: 'project-execution',
      heading: '3. Project Execution Risk',
      body: [
        'Most projects on BraveVest involve construction, agriculture, or operational execution. Delays, cost overruns, and quality issues are common in these sectors.',
        'A project that is delayed may not pay returns on schedule. A project that is over budget may produce lower returns than projected.',
      ],
    },
    {
      id: 'borrower-default',
      heading: '4. Borrower Default Risk',
      body: [
        'Credit-backed opportunities depend on borrowers repaying their loans. If a borrower defaults, we pursue recovery through guarantees, collateral, and legal action — but recovery can take months and may not be complete.',
      ],
    },
    {
      id: 'market',
      heading: '5. Market Risk',
      body: [
        'Real estate values can fall. Agricultural commodity prices can fall. Rental yields can decline if the market weakens.',
        'Investment returns are not guaranteed and depend on market conditions that cannot be predicted.',
      ],
    },
    {
      id: 'liquidity',
      heading: '6. Liquidity Risk',
      body: [
        'Investments on BraveVest are illiquid. Once you invest, you generally cannot withdraw your capital until the project reaches its maturity date.',
        'There is no secondary market on the Platform for buying or selling investments.',
      ],
    },
    {
      id: 'concentration',
      heading: '7. Concentration Risk',
      body: [
        'If you invest a large portion of your portfolio in a single project, you are exposed to the specific risks of that project.',
        'Diversification across multiple projects, categories, and operators reduces concentration risk.',
      ],
    },
    {
      id: 'regulatory',
      heading: '8. Regulatory Risk',
      body: [
        'Regulations affecting investment platforms, tax treatment of returns, or specific sectors (real estate, energy, credit) can change. Changes may affect the returns on your investments or your ability to access the Platform.',
      ],
    },
    {
      id: 'operational',
      heading: '9. Operational Risk',
      body: [
        'While we take operational continuity seriously, the Platform may experience downtime, technical issues, or data loss. Where downtime affects payouts or transactions, we will resolve issues as quickly as possible and communicate transparently.',
      ],
    },
    {
      id: 'fraud',
      heading: '10. Fraud Risk',
      body: [
        'While every project undergoes verification, fraud is possible. If you suspect fraudulent activity on the Platform, report it immediately to security@bravevest.com.',
        'Never share your password, PIN, or OTP with anyone — including anyone claiming to be from BraveVest.',
      ],
    },
    {
      id: 'what-we-do',
      heading: '11. What We Do To Manage Risk',
      body: [
        'Sponsor verification before listing.',
        'Risk rating for every opportunity.',
        'Separate records for each project.',
        'Documented use of funds.',
        'Regular progress reporting.',
        'Credit assessment for borrowers.',
        'Legal agreements for every transaction.',
        'Data protection and audit controls.',
        'A formal complaints resolution process.',
      ],
    },
    {
      id: 'what-you-should-do',
      heading: '12. What You Should Do',
      body: [
        'Read every document on the project page before investing.',
        'Understand the repayment source — is it contractual or market-dependent?',
        'Diversify across projects and categories.',
        'Only invest money you can afford to lose.',
        'Do not invest under pressure or urgency.',
        'If something is unclear, ask. investors@bravevest.com',
      ],
    },
  ];

  return (
    <LegalLayout
      title="Risk Disclosure"
      subtitle="A full description of the risks involved in investing on BraveVest."
      lastUpdated="September 23, 2026"
      description="BraveVest Marketplace Risk Disclosure — capital loss, execution, default, liquidity, and other risks."
      canonical="/#/risk-disclosure"
      sections={sections}
    />
  );
}
