import LegalLayout from '@/components/shared/LegalLayout';

export default function Privacy() {
  const sections = [
    {
      id: 'overview',
      heading: '1. Overview',
      body: [
        'BraveVest Marketplace ("BraveVest", "we", "us") is committed to protecting your privacy. This Privacy Policy explains what personal information we collect, why we collect it, how we use it, and the rights you have over your data.',
        'We comply with the Nigeria Data Protection Act (NDPA) 2023 and applicable data protection regulations in the jurisdictions where we operate.',
      ],
    },
    {
      id: 'data-we-collect',
      heading: '2. Information We Collect',
      body: [
        'Identity information: name, date of birth, gender, nationality, and government-issued identification details provided during KYC.',
        'Contact information: email address, phone number, and residential address.',
        'Financial information: bank account details, investment history, transaction records, and payment method information.',
        'Technical information: IP address, device type, browser, and usage patterns collected automatically when you use the Platform.',
        'Communications: correspondence with our support team, recorded calls (with notice), and messages sent through the Platform.',
      ],
    },
    {
      id: 'how-we-use',
      heading: '3. How We Use Your Information',
      body: [
        'To verify your identity and comply with AML/KYC obligations under Nigerian law.',
        'To process investments, distributions, and withdrawals.',
        'To communicate with you about your account, transactions, and material platform changes.',
        'To detect and prevent fraud, money laundering, and other illegal activity.',
        'To improve the Platform, develop new features, and conduct internal analytics.',
        'To comply with legal and regulatory obligations, including responding to lawful requests from regulators and law enforcement.',
      ],
    },
    {
      id: 'sharing',
      heading: '4. When We Share Your Information',
      body: [
        'With payment processors (Paystack, Flutterwave) to process transactions.',
        'With KYC/identity verification providers (Smile Identity, VerifyMe) to verify your identity.',
        'With credit bureaus where relevant to credit-backed products.',
        'With regulators, auditors, and law enforcement when legally required.',
        'With service providers who process data on our behalf under contract (cloud hosting, email, analytics).',
        'In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction. We will notify you before this occurs.',
      ],
    },
    {
      id: 'retention',
      heading: '5. Data Retention',
      body: [
        'We retain your personal information for as long as your account is active and for a minimum of 7 years after account closure, as required by Nigerian anti-money-laundering regulations.',
        'Some data (e.g., transaction records) may be retained longer if required by other legal obligations.',
      ],
    },
    {
      id: 'security',
      heading: '6. Security',
      body: [
        'We use industry-standard security measures including: 256-bit SSL encryption in transit, encrypted storage at rest, restricted access controls, two-factor authentication for staff, and regular security audits.',
        'Payment card information is handled by PCI-DSS-compliant processors and never stored on our servers.',
        'While we take security seriously, no system is impenetrable. If we become aware of a data breach affecting your information, we will notify you and the relevant regulator as required by law.',
      ],
    },
    {
      id: 'your-rights',
      heading: '7. Your Rights',
      body: [
        'Under the NDPA and similar laws, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of data we are not legally required to retain; object to certain processing activities; and lodge a complaint with the Nigeria Data Protection Commission (NDPC).',
        'To exercise any of these rights, email privacy@bravevest.com. We will respond within 30 days.',
      ],
    },
    {
      id: 'cookies',
      heading: '8. Cookies and Tracking',
      body: [
        'We use essential cookies to keep you logged in and secure your session. These are required for the Platform to function.',
        'We use analytics cookies (Google Analytics) to understand how the Platform is used. These can be disabled in your browser settings.',
        'We do not use cookies for cross-site advertising or sell cookie data to third parties.',
      ],
    },
    {
      id: 'children',
      heading: '9. Children',
      body: [
        'The Platform is not intended for anyone under 18. We do not knowingly collect data from minors. If you believe we have collected such data, contact privacy@bravevest.com and we will delete it.',
      ],
    },
    {
      id: 'international',
      heading: '10. International Transfers',
      body: [
        'Your data is primarily stored in Nigeria and the European Union (Supabase infrastructure). Where we transfer data outside Nigeria, we ensure appropriate safeguards are in place under the NDPA.',
      ],
    },
    {
      id: 'changes',
      heading: '11. Changes to This Policy',
      body: [
        'We may update this Policy from time to time. Material changes will be communicated to you by email or through the Platform at least 14 days before they take effect.',
      ],
    },
    {
      id: 'contact',
      heading: '12. Contact Us',
      body: [
        'For privacy questions or to exercise your rights, contact our Data Protection Officer at privacy@bravevest.com.',
        'You may also write to us at: BraveVest Marketplace, c/o Bravelion Capital, Lagos, Nigeria.',
      ],
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
      lastUpdated="September 23, 2026"
      description="BraveVest Marketplace Privacy Policy — data we collect, how we use it, and your rights under the NDPA."
      canonical="/#/privacy"
      sections={sections}
    />
  );
}
