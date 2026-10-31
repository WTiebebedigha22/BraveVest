import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <div style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <section className="hero-split container" style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="hero-split__content" style={{ maxWidth: '780px' }}>
          <span className="eyebrow">Legal</span>
          <h1 style={{ margin: '16px 0 24px' }}>Disclosures</h1>
          <p className="lede" style={{ marginBottom: '40px' }}>Regulatory and operational disclosures as required by Nigerian financial services law.</p>
        </div>
      </section>
      <div className="container container--narrow" style={{ padding: '80px 24px' }}>
        
    <h2 style="margin-top: 32px; margin-bottom: 16px;">Regulatory Status</h2>
    <p style="margin-bottom: 24px;">BraveVest operates as a technology platform. All lending and investment activity is conducted in partnership with licensed financial institutions. BraveVest does not itself hold, lend, or borrow funds.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">Deposit Protection</h2>
    <p style="margin-bottom: 24px;">Funds deposited through BraveVest are held by licensed payment providers (Paystack) and banking partners. Client funds are segregated and not commingled with operating capital.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">Investment Risk Disclosure</h2>
    <p style="margin-bottom: 24px;">All investments carry risk. Investors may lose some or all of their invested capital. Historic returns are not indicative of future performance. Diversification across multiple opportunities is advised to reduce concentration risk.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">Conflicts of Interest</h2>
    <p style="margin-bottom: 24px;">BraveVest earns fees from borrowers and, in some cases, from investors. Full fee schedules are disclosed on each opportunity page. Where BraveVest or its affiliates have a financial interest in a transaction, this is disclosed prior to investment.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">Complaints Handling</h2>
    <p style="margin-bottom: 24px;">Complaints should be sent to <a href="mailto:complaints@bravevest.com" style="color: var(--gold);">complaints@bravevest.com</a>. We respond within 5 business days. Unresolved complaints may be escalated to the SEC Nigeria or the CBN Consumer Protection Department.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">Data Protection</h2>
    <p style="margin-bottom: 24px;">BraveVest is registered with the Nigeria Data Protection Commission (NDPC). Our data handling practices comply with NDPA 2023 and international equivalents including GDPR.</p>
  
      </div>
    </div>
  );
}
