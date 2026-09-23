import LegalLayout from '@/components/shared/LegalLayout';

export default function Terms() {
  const sections = [
    {
      id: 'acceptance',
      heading: '1. Acceptance of Terms',
      body: [
        'These Terms of Service ("Terms") govern your access to and use of the BraveVest Marketplace platform ("Platform"), operated by BraveVest Marketplace, a subsidiary of Bravelion Capital, a Bravelion Holdings company.',
        'By registering an account, browsing the Platform, or investing in any opportunity listed on the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform.',
      ],
    },
    {
      id: 'eligibility',
      heading: '2. Eligibility',
      body: [
        'You must be at least 18 years old and legally capable of entering into binding contracts under Nigerian law to use the Platform.',
        'By registering, you confirm that the information you provide is accurate, complete, and truthful. Providing false information is grounds for immediate account termination and may constitute fraud under Nigerian law.',
        'You must complete Know Your Customer (KYC) verification before investing. We may decline to onboard any user at our sole discretion, in line with anti-money-laundering regulations.',
      ],
    },
    {
      id: 'nature-of-service',
      heading: '3. Nature of the Service',
      body: [
        'BraveVest is a marketplace that connects investors with verified investment opportunities curated by our investment committee. We are not a bank, a deposit-taking institution, or a fund manager.',
        'We do not guarantee returns on any investment listed on the Platform. All investments carry risk, including the risk of partial or total loss of capital.',
        'Every project is subject to our due diligence process, but verification is not a guarantee of performance, solvency, or repayment. You must conduct your own independent assessment before investing.',
      ],
    },
    {
      id: 'investment-process',
      heading: '4. Investment Process',
      body: [
        'When you commit to an investment, you agree to fund the committed amount within the timeframe specified at the point of investment.',
        'Funds are held in a designated escrow account until the investment milestone is reached or the offer period closes. If the offer does not close successfully, funds are returned to your wallet within 5 business days.',
        'Once your funds are deployed into a project, the investment becomes binding. Withdrawal before maturity is not permitted unless expressly stated in the project terms.',
      ],
    },
    {
      id: 'fees',
      heading: '5. Fees and Charges',
      body: [
        'The fees applicable to each opportunity are set out on the project page. These may include a structuring fee, platform administration fee, project management fee, and performance fee.',
        'All fees are disclosed before you commit to an investment. We do not charge hidden or retroactive fees.',
        'Bank transfer charges, payment gateway charges, and currency conversion costs (if applicable) are the responsibility of the investor.',
      ],
    },
    {
      id: 'payouts',
      heading: '6. Returns and Payouts',
      body: [
        'Returns are distributed according to the terms of each project. Payouts are typically made to the bank account on file for your account.',
        'If a project is delayed, defaults, or underperforms, we will communicate the situation to investors and pursue available recovery avenues. Recovery is not guaranteed.',
        'We are not liable for delays caused by payment processors, banking partners, or events outside our reasonable control.',
      ],
    },
    {
      id: 'taxes',
      heading: '7. Taxes',
      body: [
        'You are solely responsible for any taxes arising from your investments on the Platform. BraveVest does not withhold tax on returns for individual investors by default.',
        'We provide an annual statement of returns to assist with tax filing. For specific tax advice, consult a qualified tax adviser.',
      ],
    },
    {
      id: 'prohibited',
      heading: '8. Prohibited Activities',
      body: [
        'You may not use the Platform for money laundering, terrorist financing, or any activity prohibited under Nigerian law.',
        'You may not attempt to reverse-engineer the Platform, scrape data, or use automated systems to access it without our written consent.',
        'You may not impersonate another person or misrepresent your affiliation with any entity.',
      ],
    },
    {
      id: 'suspension',
      heading: '9. Suspension and Termination',
      body: [
        'We may suspend or terminate your account if we have reason to believe you have violated these Terms, provided false information, or engaged in fraudulent activity.',
        'Upon termination, your existing investments remain subject to their terms. Returns continue to be paid according to the project schedule.',
      ],
    },
    {
      id: 'liability',
      heading: '10. Limitation of Liability',
      body: [
        'To the maximum extent permitted by law, BraveVest Marketplace shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of the Platform.',
        'Our total liability to you for any claim related to the Platform shall not exceed the total amount of fees you have paid to us in the 12 months preceding the claim.',
        'Nothing in these Terms excludes liability for fraud, gross negligence, or any liability that cannot be excluded under Nigerian law.',
      ],
    },
    {
      id: 'changes',
      heading: '11. Changes to These Terms',
      body: [
        'We may update these Terms from time to time. Material changes will be communicated to you at least 14 days before they take effect.',
        'Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.',
      ],
    },
    {
      id: 'governing-law',
      heading: '12. Governing Law and Disputes',
      body: [
        'These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the Nigerian courts.',
        'Before initiating legal proceedings, we ask that you contact us at legal@bravevest.com so we can attempt to resolve the matter in good faith.',
      ],
    },
  ];

  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="The agreement between you and BraveVest Marketplace."
      lastUpdated="September 23, 2026"
      description="BraveVest Marketplace Terms of Service — eligibility, investment process, fees, payouts, and governing law."
      canonical="/#/terms"
      sections={sections}
    />
  );
}
