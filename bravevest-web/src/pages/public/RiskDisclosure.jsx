import { AlertTriangle } from 'lucide-react';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg: var(--bv-bg); --by-card: var(--bv-bg-elevated); --by-line: var(--bv-border); --by-text: var(--bv-text); --by-mute: var(--bv-text-muted); --by-amber:#C27C00; --by-red:#C0392B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:900px; margin:0 auto; padding:0 20px; }
.by-page { padding:72px 0 96px; }
.by-warn-box { background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.2); border-radius:16px; padding:28px; margin-bottom:40px; display:flex; gap:16px; align-items:flex-start; }
.by-warn-ic { width:48px; height:48px; border-radius:10px; background:rgba(192,57,43,.12); color:var(--by-red); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.by-warn-box h2 { font-size:20px; font-weight:700; margin:0 0 8px; color:var(--by-red); letter-spacing:-0.01em; }
.by-warn-box p { font-size:15px; line-height:1.65; color:var(--by-text); margin:0; }
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
.by-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:24px 0; }
.by-risk-card { background:var(--by-card); border-radius:12px; padding:20px 24px; }
.by-risk-card h3 { font-size:16px; font-weight:700; margin:0 0 8px; color:var(--by-text); }
.by-risk-card p { font-size:14px; color:var(--by-mute); line-height:1.6; margin:0; }
@media (max-width:700px) { .by-grid2 { grid-template-columns:1fr; } .by-page { padding:48px 0 64px; } .by-warn-box { flex-direction:column; } }
`;

const RISKS = [
  { title: 'Capital risk', desc: 'You may lose some or all of your invested capital. Investments are not bank deposits and are not insured by any government agency.' },
  { title: 'Liquidity risk', desc: 'Most investments are locked for their full tenor. You may not be able to withdraw before maturity.' },
  { title: 'Credit risk', desc: 'Borrowers may fail to repay. Although all deals are collateralized, recovery depends on the collateral\'s realizable value.' },
  { title: 'Concentration risk', desc: 'Investing in a single deal concentrates your exposure. We recommend diversifying across 5–10 projects.' },
  { title: 'Project risk', desc: 'Specific projects may face delays, cost overruns, or operational issues that affect returns.' },
  { title: 'Market risk', desc: 'Broader economic conditions — inflation, currency, interest rates — can affect the value of your investment.' },
];

export default function RiskDisclosure() {
  return (
    <PageShell theme="light">
      <style>{CSS}</style>
      <div className="by">
        <section className="by-page">
          <div className="by-wrap">
            <div className="by-eyebrow">Legal</div>
            <h1>Risk Disclosure</h1>
            <p className="by-lede">
              Read this carefully before investing on BraveVest. Investing involves significant risks, including the possible loss of your entire capital.
            </p>

            <div className="by-warn-box">
              <div className="by-warn-ic"><AlertTriangle size={24} /></div>
              <div>
                <h2>Your capital is at risk</h2>
                <p>
                  Investments offered on BraveVest are <strong>not bank deposits</strong>. They are not insured by any government
                  agency. You may lose some or all of your invested capital. Returns shown are projections, not guarantees.
                </p>
              </div>
            </div>

            <h2>1. What you are investing in</h2>
            <p>
              BraveVest connects investors to vetted private credit and asset-backed opportunities. When you invest, you are
              lending your capital to a borrower (or acquiring a share of an underlying asset) for a fixed period. Your return
              comes from the borrower's repayment, not from trading, speculation, or market movements.
            </p>

            <h2>2. Key risks</h2>
            <div className="by-grid2">
              {RISKS.map((r) => (
                <div key={r.title} className="by-risk-card">
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>

            <h2>3. Collateral and recovery</h2>
            <p>
              All BraveVest deals are collateralized. First-loss protection is held by the sponsor for most deals (typically
              15–20%). If a borrower defaults, our recovery team works to liquidate collateral and recover investor capital.
            </p>
            <p>
              <strong>However:</strong> collateral values can decline. Liquidation can take months. Recovery is not guaranteed,
              and in a severe scenario you may not recover all of your principal.
            </p>

            <h2>4. Past performance</h2>
            <p>
              Our zero-default record since 2023 is a real achievement — but <strong>past performance is not indicative of
              future results</strong>. It does not mean no future borrower will ever default.
            </p>

            <h2>5. Liquidity</h2>
            <p>
              Most deals are locked for the full tenor. If you need to access your money before maturity, you cannot. A secondary
              market is planned for Q1 2027 but is not yet live and is not guaranteed.
            </p>

            <h2>6. Returns are not guaranteed</h2>
            <p>
              Yields shown on listings are <strong>projections based on the terms of the credit facility</strong>. Actual returns
              may be lower if:
            </p>
            <ul>
              <li>A borrower prepays or restructures.</li>
              <li>Projected project timelines slip.</li>
              <li>Operating costs exceed projections.</li>
              <li>Currency or macroeconomic conditions change.</li>
            </ul>

            <h2>7. Withholding tax</h2>
            <p>
              Interest income from BraveVest investments is subject to Nigerian Withholding Tax (10% for residents). This is
              deducted at source before returns reach your wallet. WHT is an advance against your annual income tax — it is not
              a final tax.
            </p>

            <h2>8. Regulatory status</h2>
            <p>
              BraveVest operates in alignment with SEC Nigeria guidelines. We partner only with CBN-licensed custodians. However,
              BraveVest investments are not the same as bank deposits or SEC-registered collective investment schemes. Read
              each deal's documentation carefully.
            </p>

            <h2>9. Diversification</h2>
            <p>
              We strongly recommend diversifying across 5–10 deals. Spreading your capital reduces concentration risk and
              improves your overall risk-adjusted return.
            </p>

            <h2>10. Do not invest money you need</h2>
            <p>
              Only invest money you can afford to lose or leave locked for the full tenor. Do not invest emergency savings, rent
              money, or borrowed funds. Consult an independent financial advisor if you are unsure whether an investment is
              suitable for you.
            </p>

            <p style={{ marginTop: 48, fontSize: 13, color: 'var(--by-mute)' }}>
              Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}. Questions?{' '}
              <a href="#/contact">Contact us</a> or read the <a href="#/terms">Terms of Service</a>.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}