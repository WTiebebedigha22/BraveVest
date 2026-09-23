import LegalLayout from '@/components/shared/LegalLayout';

export default function Disclosures() {
  const sections = [
    {
      id: 'no-investment-advice',
      heading: '1. No Investment Advice',
      body: [
        'BraveVest Marketplace is a platform for discovering and accessing investment opportunities. We are not an investment adviser, broker-dealer, or financial planner.',
        'Nothing on the Platform constitutes investment advice, a recommendation to buy or sell any security, or a solicitation to invest. The suitability of any investment depends on your individual financial situation, risk tolerance, and investment objectives.',
        'You should consult a licensed financial adviser before making material investment decisions.',
      ],
    },
    {
      id: 'risk-warning',
      heading: '2. Risk Warning',
      body: [
        'All investments carry risk. The value of your investment can go down as well as up. You may lose some or all of your invested capital.',
        'Past performance is not a reliable indicator of future results. Projected returns on the Platform are estimates based on the project sponsor\'s plan and are not guaranteed.',
        'Investments on BraveVest are typically illiquid. You may not be able to exit an investment before its maturity date.',
        'Do not invest money you cannot afford to lose. Do not borrow money to invest on the Platform.',
      ],
    },
    {
      id: 'regulatory',
      heading: '3. Regulatory Status',
      body: [
        'BraveVest Marketplace operates within the Bravelion group of companies. We are structured to comply with:',
        'Corporate Affairs Commission (CAC) registration and corporate governance requirements.',
        'Securities and Exchange Commission (SEC) rules applicable to investment and crowdfunding-related activities, where relevant.',
        'Federal Competition and Consumer Protection Commission (FCCPC) rules applicable to digital lending and consumer credit products, where relevant.',
        'Nigeria Data Protection Act (NDPA) 2023 and NDPC regulations.',
        'Applicable anti-money-laundering (AML) and counter-terrorist-financing (CTF) regulations.',
        'We do not represent that we hold any specific licence or registration beyond what is stated on this page. If you have specific questions about our regulatory status, contact legal@bravevest.com.',
      ],
    },
    {
      id: 'conflicts',
      heading: '4. Conflicts of Interest',
      body: [
        'Bravelion Estates & Development, a company within the Bravelion group, may originate or execute certain projects listed on BraveVest. When this occurs, we will clearly disclose the relationship on the project page.',
        'BraveVest earns fees from project sponsors (structuring, project management) and from investors (administration fees). These fee structures are disclosed on each project page.',
        'Our investment committee reviews all projects before listing, including any project where there is a related-party relationship. Related-party projects receive enhanced scrutiny.',
      ],
    },
    {
      id: 'no-guarantee',
      heading: '5. No Guarantee of Capital or Returns',
      body: [
        'BraveVest does not guarantee the return of your capital or the payment of any projected return.',
        'Project sponsors, not BraveVest, are responsible for executing the underlying project and generating returns.',
        'In the event of a default, we will use commercially reasonable efforts to pursue recovery through available channels (enforcement of security, legal action, restructuring). Recovery timelines and outcomes cannot be guaranteed.',
      ],
    },
    {
      id: 'fees-summary',
      heading: '6. Fee Summary',
      body: [
        'Project structuring fee: 1%–3% of raise amount (paid by the sponsor, not the investor).',
        'Platform administration fee: 0.5%–2% (varies by product).',
        'Project management fee: 2%–5% of project cost (paid by the sponsor).',
        'Performance fee: 10%–20% of excess profit where a project exceeds agreed benchmarks.',
        'Property management fee: 5%–10% of rental income for rental or lease income products.',
        'Loan origination and credit assessment fees: risk-based, disclosed at the point of investment for credit products.',
        'The net return rate shown on each project page already accounts for fees payable by investors.',
      ],
    },
    {
      id: 'tax',
      heading: '7. Tax Disclosure',
      body: [
        'BraveVest does not provide tax advice. Tax treatment of your investment returns depends on your personal circumstances and may change.',
        'We provide an annual statement of returns to assist you in meeting your tax obligations. You are responsible for declaring and paying any tax due.',
      ],
    },
    {
      id: 'complaints',
      heading: '8. Complaints and Dispute Resolution',
      body: [
        'If you have a complaint about any aspect of the Platform:',
        'Step 1: Email complaints@bravevest.com with your account email and a description of the issue.',
        'Step 2: You will receive an acknowledgement within 1 business day.',
        'Step 3: We investigate and provide a written response within 10 business days.',
        'Step 4: If the matter remains unresolved, it escalates to our Investment Committee and, where relevant, to the appropriate regulator.',
        'We maintain records of all complaints for compliance review.',
      ],
    },
    {
      id: 'regulatory-references',
      heading: '9. Regulatory References',
      body: [
        'Nigeria Data Protection Commission (NDPC): ndpc.gov.ng',
        'Securities and Exchange Commission (SEC) Nigeria: sec.gov.ng',
        'Federal Competition and Consumer Protection Commission (FCCPC): fccpc.gov.ng',
        'Financial Reporting Council of Nigeria: frcn.gov.ng',
      ],
    },
  ];

  return (
    <LegalLayout
      title="Disclosures"
      subtitle="Regulatory disclosures, fee transparency, and our commitments to investors."
      lastUpdated="September 23, 2026"
      description="BraveVest Marketplace legal disclosures — regulatory status, fees, risk warnings, and conflicts of interest."
      canonical="/#/disclosures"
      sections={sections}
    />
  );
}
