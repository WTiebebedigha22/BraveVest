import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <div style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <section className="hero-split container" style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="hero-split__content" style={{ maxWidth: '780px' }}>
          <span className="eyebrow">Legal</span>
          <h1 style={{ margin: '16px 0 24px' }}>Risk Disclosure</h1>
          <p className="lede" style={{ marginBottom: '40px' }}>You should carefully consider the following risks before investing on BraveVest.</p>
        </div>
      </section>
      <div className="container container--narrow" style={{ padding: '80px 24px' }}>
        
    <h2 style="margin-top: 32px; margin-bottom: 16px;">1. Credit Risk</h2>
    <p style="margin-bottom: 24px;">Borrowers may fail to repay their obligations. While every borrower is underwritten and collateralized, default is possible. In the event of default, recovery efforts may take months or longer, and full recovery is not guaranteed.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">2. Liquidity Risk</h2>
    <p style="margin-bottom: 24px;">Investments are locked for the full tenor of the loan. There is no guarantee that a secondary market exists to exit early. You should only invest capital you can afford to lock up.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">3. Concentration Risk</h2>
    <p style="margin-bottom: 24px;">Investing a large portion of your portfolio in a single opportunity increases your exposure to that borrower's risk. We recommend diversifying across multiple opportunities and asset classes.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">4. Interest Rate Risk</h2>
    <p style="margin-bottom: 24px;">If market interest rates rise during your investment term, your fixed return may underperform relative to newer opportunities. This is a normal trade-off for fixed-income predictability.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">5. Platform Risk</h2>
    <p style="margin-bottom: 24px;">While BraveVest operates under strict regulatory and operational controls, no platform is immune to technical failure, cyber attack, or business disruption. Client funds are held separately and are not affected by BraveVest's operational status.</p>

    <h2 style="margin-top: 32px; margin-bottom: 16px;">6. Regulatory Risk</h2>
    <p style="margin-bottom: 24px;">Changes to financial regulations in Nigeria may affect the availability, structure, or tax treatment of investment products. BraveVest monitors regulatory changes and will communicate any material impact to investors.</p>

    <div style="margin-top: 48px; padding: 24px; border-left: 2px solid var(--danger); background: rgba(192, 54, 58, 0.05);">
      <p style="margin: 0; color: var(--ivory);">Past performance is not a reliable indicator of future results. Investments should only be made after careful consideration of your financial circumstances, risk tolerance, and investment objectives.</p>
    </div>
  
      </div>
    </div>
  );
}
