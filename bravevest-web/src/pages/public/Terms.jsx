import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <div style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <section className="hero-split container" style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="hero-split__content" style={{ maxWidth: '780px' }}>
          <span className="eyebrow">Legal</span>
          <h1 style={{ margin: '16px 0 24px' }}>Terms of Service</h1>
          <p className="lede" style={{ marginBottom: '40px' }}>Effective date: January 2025. Please read these terms carefully before using the BraveVest platform.</p>
        </div>
      </section>
      <div className="container container--narrow" style={{ padding: '80px 24px' }}>
        
    <h2 style="margin-top: 32px; margin-bottom: 16px;">1. Acceptance of Terms</h2>
    <p style="margin-bottom: 24px;">By accessing or using BraveVest ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">2. Eligibility</h2>
    <p style="margin-bottom: 24px;">You must be at least 18 years old, legally able to enter binding contracts, and successfully complete KYC verification before conducting any financial transaction on the Platform.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">3. Nature of Platform</h2>
    <p style="margin-bottom: 24px;">BraveVest operates as a marketplace connecting investors with vetted borrowers. BraveVest is not a bank, a deposit-taking institution, or a licensed investment advisor. All investments carry risk, including the risk of total capital loss.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">4. Account Security</h2>
    <p style="margin-bottom: 24px;">You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted under your account is deemed to be your activity. You must notify us immediately of any unauthorized access.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">5. Investment Risk</h2>
    <p style="margin-bottom: 24px;">Investments on BraveVest are not insured by any government deposit insurance scheme. Past performance is not a guarantee of future results. You should only invest funds you can afford to have tied up for the full investment tenor.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">6. Fees and Charges</h2>
    <p style="margin-bottom: 24px;">A schedule of fees is disclosed at the point of each transaction. BraveVest reserves the right to modify fees with 30 days' prior notice to registered users.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">7. Termination</h2>
    <p style="margin-bottom: 24px;">BraveVest may suspend or terminate accounts that violate these terms, engage in fraud, or are flagged by our compliance systems. Balances remain accessible upon verification.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">8. Governing Law</h2>
    <p style="margin-bottom: 24px;">These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State.</p>

    <p style="margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--line); font-size: 13px; color: var(--slate);">For questions about these Terms, contact <a href="mailto:legal@bravevest.com" style="color: var(--gold);">legal@bravevest.com</a>.</p>
  
      </div>
    </div>
  );
}
