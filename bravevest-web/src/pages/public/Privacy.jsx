import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <div style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <section className="hero-split container" style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="hero-split__content" style={{ maxWidth: '780px' }}>
          <span className="eyebrow">Legal</span>
          <h1 style={{ margin: '16px 0 24px' }}>Privacy Policy</h1>
          <p className="lede" style={{ marginBottom: '40px' }}>How BraveVest collects, uses, and protects your personal information under NDPA 2023.</p>
        </div>
      </section>
      <div className="container container--narrow" style={{ padding: '80px 24px' }}>
        
    <h2 style="margin-top: 32px; margin-bottom: 16px;">1. Information We Collect</h2>
    <p style="margin-bottom: 24px;">We collect identity data (name, DOB, ID numbers), contact data (email, phone), financial data (bank account, transaction history), and technical data (IP address, device information) to operate the Platform, comply with regulations, and prevent fraud.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">2. How We Use Your Data</h2>
    <p style="margin-bottom: 24px;">Your data is used to verify identity (KYC), process transactions, comply with anti-money-laundering laws, and communicate about your account. We do not sell your personal data to third parties.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">3. Data Sharing</h2>
    <p style="margin-bottom: 24px;">We share data with identity verification providers (Smile Identity, Sumsub), payment processors (Paystack), and regulatory bodies where legally required. All partners are contractually bound to protect your data.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">4. Data Retention</h2>
    <p style="margin-bottom: 24px;">We retain your data for 7 years after account closure, as required by CBN regulations. You may request deletion after this period.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">5. Your Rights (NDPA 2023)</h2>
    <p style="margin-bottom: 24px;">You have the right to access, correct, port, and request deletion of your data. You may also object to processing and lodge a complaint with the Nigeria Data Protection Commission. Requests can be made from your account settings.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">6. Security</h2>
    <p style="margin-bottom: 24px;">All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We run quarterly third-party security audits and maintain SOC 2-aligned controls.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">7. Contact</h2>
    <p style="margin-bottom: 24px;">For privacy requests, contact our Data Protection Officer at <a href="mailto:dpo@bravevest.com" style="color: var(--gold);">dpo@bravevest.com</a>.</p>
  
      </div>
    </div>
  );
}
