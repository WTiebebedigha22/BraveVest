import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-amber:#C27C00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:900px; margin:0 auto; padding:0 20px; }
.by-page { padding:72px 0 96px; }
.by-eyebrow { font-size:13px; font-weight:600; color:var(--by-amber); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:12px; }
.by-page h1 { font-size:clamp(36px,5vw,56px); font-weight:800; letter-spacing:-0.03em; margin:0 0 12px; line-height:1.08; }
.by-page .by-lede { font-size:17px; color:var(--by-mute); line-height:1.6; margin:0 0 48px; }
.by-page h2 { font-size:22px; font-weight:700; letter-spacing:-0.02em; margin:40px 0 12px; color:var(--by-text); padding-top:16px; border-top:1px solid var(--by-line); }
.by-page h2:first-of-type { margin-top:0; padding-top:0; border-top:0; }
.by-page h3 { font-size:17px; font-weight:600; margin:24px 0 8px; color:var(--by-text); }
.by-page p { font-size:15.5px; line-height:1.75; color:var(--by-mute); margin:0 0 16px; }
.by-page strong { color:var(--by-text); font-weight:600; }
.by-page a { color:var(--by-amber); text-decoration:none; }
.by-page a:hover { text-decoration:underline; }
.by-page ul { padding-left:22px; margin:0 0 16px; }
.by-page li { font-size:15.5px; line-height:1.75; color:var(--by-mute); margin-bottom:8px; }
`;

export default function Terms() {
  return (
    <PageShell theme="light">
      <style>{CSS}</style>
      <div className="by">
        <section className="by-page">
          <div className="by-wrap">
            <div className="by-eyebrow">Legal</div>
            <h1>Terms of Service</h1>
            <p className="by-lede">
              These terms govern your use of BraveVest and the investment products we facilitate. By using the platform, you agree to them.
            </p>

            <h2>1. Eligibility</h2>
            <p>
              You must be at least 18 years old and a resident of Nigeria with valid KYC documentation to invest on BraveVest.
              Diaspora investors may access USD-denominated products subject to additional verification requirements.
            </p>

            <h2>2. Risk acknowledgment</h2>
            <p>
              <strong>All investments on BraveVest carry risk.</strong> Your capital is at risk. Returns shown on listings are
              projections based on the terms of the underlying credit facility, not guarantees. Past performance — including our
              zero-default record since 2023 — is not indicative of future results.
            </p>
            <p>
              By investing, you acknowledge that you have read and understood our{' '}
              <a href="#/risk-disclosure">Risk Disclosure</a>.
            </p>

            <h2>3. Account & KYC</h2>
            <p>
              You must complete KYC before you can invest or withdraw. We collect government ID, selfie for liveness verification,
              and proof of address. All information is processed under our{' '}
              <a href="#/privacy">Privacy Policy</a> and Nigeria's NDPR.
            </p>
            <p>
              You are responsible for keeping your credentials secure. Do not share your password, BVN, or 2FA codes with anyone.
            </p>

            <h2>4. Fees</h2>
            <ul>
              <li><strong>Origination fee:</strong> 1% of each investment, built into the yield you see.</li>
              <li><strong>Performance fee:</strong> 10% of returns above the target rate.</li>
              <li><strong>Deposit fee:</strong> ₦0 on bank transfers.</li>
              <li><strong>Withdrawal fee:</strong> ₦0 on Nigerian bank transfers.</li>
              <li><strong>Card deposits:</strong> 1.5% processing fee (charged by Paystack).</li>
            </ul>

            <h2>5. Investing</h2>
            <p>
              When you invest, your capital is locked for the tenor of the specific deal. Most deals do not support early withdrawal.
              A secondary market is planned for Q1 2027 but is not guaranteed.
            </p>
            <p>
              Returns are paid to your BraveVest wallet on the schedule specified in each deal (typically quarterly). You may
              withdraw these at any time to your KYC-verified bank account.
            </p>

            <h2>6. Withdrawals</h2>
            <p>
              Withdrawals are processed to your KYC-verified bank account within 1 business day. We cannot send withdrawals to
              accounts not on file. To change your bank account, contact support with documentation.
            </p>

            <h2>7. Defaults & recovery</h2>
            <p>
              All deals are collateralized. In the event of a borrower default, our recovery team works to liquidate collateral
              and recover investor capital. Recovery timelines vary by deal structure.
            </p>

            <h2>8. Account suspension</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms, engage in fraud, or are subject to
              regulatory action. In such cases, we will return your remaining balance to your verified bank account.
            </p>

            <h2>9. Disputes</h2>
            <p>
              Contact support@bravevest.com in the first instance. Unresolved disputes escalate to the Securities and Exchange
              Commission of Nigeria (SEC Nigeria).
            </p>

            <h2>10. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Material changes will be notified by email and via the platform at
              least 30 days before they take effect.
            </p>

            <h2>11. Governing law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes are subject to the exclusive
              jurisdiction of the Nigerian courts.
            </p>

            <p style={{ marginTop: 48, fontSize: 13, color: 'var(--by-mute)' }}>
              Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}. Questions?{' '}
              <a href="#/contact">Contact us</a>.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}