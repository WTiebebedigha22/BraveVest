import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg: var(--bv-bg); --by-card: var(--bv-bg-elevated); --by-line: var(--bv-border); --by-text: var(--bv-text); --by-mute: var(--bv-text-muted); --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:900px; margin:0 auto; padding:0 20px; }
.by-page { padding:72px 0 96px; }
.by-eyebrow { font-size:13px; font-weight:600; color:var(--by-amber); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:12px; }
.by-page h1 { font-size:clamp(36px,5vw,56px); font-weight:800; letter-spacing:-0.03em; margin:0 0 12px; line-height:1.08; }
.by-page .by-lede { font-size:17px; color:var(--by-mute); line-height:1.6; margin:0 0 48px; }
.by-page h2 { font-size:22px; font-weight:700; letter-spacing:-0.02em; margin:40px 0 12px; color:var(--by-text); padding-top:16px; border-top:1px solid var(--by-line); }
.by-page h2:first-of-type { margin-top:0; padding-top:0; border-top:0; }
.by-page p { font-size:15.5px; line-height:1.75; color:var(--by-mute); margin:0 0 16px; }
.by-page strong { color:var(--by-text); font-weight:600; }
.by-page a { color:var(--by-amber); text-decoration:none; }
.by-page a:hover { text-decoration:underline; }
.by-page ul { padding-left:22px; margin:0 0 16px; }
.by-page li { font-size:15.5px; line-height:1.75; color:var(--by-mute); margin-bottom:8px; }
`;

export default function Privacy() {
  return (
    <PageShell theme="light">
      <style>{CSS}</style>
      <div className="by">
        <section className="by-page">
          <div className="by-wrap">
            <div className="by-eyebrow">Legal</div>
            <h1>Privacy Policy</h1>
            <p className="by-lede">
              How we collect, use, and protect your personal information, in line with the Nigeria Data Protection Regulation (NDPR).
            </p>

            <h2>1. What we collect</h2>
            <p>To provide the BraveVest platform, we collect:</p>
            <ul>
              <li><strong>Identity data:</strong> full name, date of birth, gender, photograph.</li>
              <li><strong>Contact data:</strong> email address, phone number, physical address.</li>
              <li><strong>KYC data:</strong> government ID number, uploaded documents, liveness selfie.</li>
              <li><strong>Banking data:</strong> bank name, account number, account holder name.</li>
              <li><strong>Transaction data:</strong> deposits, withdrawals, investments, payouts.</li>
              <li><strong>Technical data:</strong> IP address, device type, browser, login timestamps.</li>
            </ul>

            <h2>2. Why we collect it</h2>
            <ul>
              <li><strong>KYC & anti-money laundering:</strong> required by SEC Nigeria and CBN regulations.</li>
              <li><strong>Transaction processing:</strong> to deposit funds, place investments, and pay returns.</li>
              <li><strong>Fraud prevention:</strong> to detect suspicious activity and protect your account.</li>
              <li><strong>Tax reporting:</strong> to issue WHT credit notes as required by Nigerian law.</li>
              <li><strong>Customer support:</strong> to respond to your questions and resolve issues.</li>
            </ul>

            <h2>3. How we protect it</h2>
            <p>
              <strong>Encryption:</strong> all data is encrypted in transit (TLS 1.3) and at rest (AES-256).
            </p>
            <p>
              <strong>Access control:</strong> only authorized staff can access personal data, and only for specific purposes
              under audit logging.
            </p>
            <p>
              <strong>Custodian partners:</strong> funds are held with CBN-licensed custodians. Sensitive payment data is
              processed by Paystack under PCI-DSS compliance.
            </p>

            <h2>4. Who we share with</h2>
            <p>We share data only with:</p>
            <ul>
              <li><strong>Regulators:</strong> SEC Nigeria, CBN, FIRS — when legally required.</li>
              <li><strong>Payment processors:</strong> Paystack for payment processing.</li>
              <li><strong>KYC providers:</strong> licensed identity verification vendors.</li>
              <li><strong>Auditors:</strong> independent auditors under confidentiality agreements.</li>
            </ul>
            <p>
              <strong>We never sell your data.</strong> We do not share data with advertisers or third-party marketers.
            </p>

            <h2>5. How long we keep it</h2>
            <p>
              Transaction records are kept for 7 years (SEC requirement). KYC documents are kept for the duration of your account
              plus 5 years after closure. Marketing consent records are kept until you withdraw consent.
            </p>

            <h2>6. Your rights</h2>
            <p>Under the NDPR, you have the right to:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of your personal data.</li>
              <li><strong>Correction</strong> — correct inaccurate data.</li>
              <li><strong>Deletion</strong> — request deletion of data (subject to legal retention requirements).</li>
              <li><strong>Restriction</strong> — limit processing of your data.</li>
              <li><strong>Portability</strong> — receive your data in a structured format.</li>
              <li><strong>Objection</strong> — object to processing based on legitimate interest.</li>
            </ul>
            <p>
              To exercise any right, email <a href="mailto:privacy@bravevest.com">privacy@bravevest.com</a>. We respond within 30 days.
            </p>

            <h2>7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. Analytics cookies (with your consent) help us
              improve the platform. You can disable analytics cookies in your browser settings.
            </p>

            <h2>8. Children</h2>
            <p>
              BraveVest is not for anyone under 18. We do not knowingly collect data from minors. If you believe a minor has
              created an account, contact us immediately.
            </p>

            <h2>9. Data breaches</h2>
            <p>
              If a data breach occurs that affects your rights, we will notify you and the Nigeria Data Protection Commission
              within 72 hours.
            </p>

            <h2>10. Contact</h2>
            <p>
              Data Protection Officer: <a href="mailto:privacy@bravevest.com">privacy@bravevest.com</a>. General inquiries:{' '}
              <a href="mailto:support@bravevest.com">support@bravevest.com</a>.
            </p>

            <p style={{ marginTop: 48, fontSize: 13, color: 'var(--by-mute)' }}>
              Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}