import Reveal from '../../components/ui/Reveal';

const PILLARS = [
  {
    num: 'I.',
    title: 'Segregated Custody',
    body: 'All investor capital is held in segregated trust accounts with regulated banking partners. Client funds are never commingled with BraveVest operating capital.',
  },
  {
    num: 'II.',
    title: 'SEC & CBN Compliance',
    body: 'Our operations fall under the regulatory framework of the Securities and Exchange Commission and our CBN-licensed banking partners.',
  },
  {
    num: 'III.',
    title: 'Credit Committee Review',
    body: 'Every borrower and every asset is reviewed by an independent credit committee before listing. Due diligence includes audited financials, collateral verification, and site inspections.',
  },
  {
    num: 'IV.',
    title: 'Bank-Grade Encryption',
    body: 'All data at rest and in transit is protected with AES-256 encryption. Multi-factor authentication is required for all accounts.',
  },
];

export default function Security() {
  return (
    <div>
      <section className="hero" style={{ padding: '120px 0 100px' }}>
        <div className="container">
          <span className="eyebrow">Trust &amp; Compliance</span>
          <h1 className="hero__display" style={{ maxWidth: '960px' }}>
            Institutional<br />
            <em>safeguards.</em>
          </h1>
          <p className="hero__lede" style={{ marginTop: '32px' }}>
            Every layer of the BraveVest platform — from custody to credit review —
            is designed to meet institutional standards.
          </p>
        </div>
      </section>

      <section style={{ borderTop: 'none' }}>
        <div className="container">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} className="principle" delay={i * 80}>
              <div className="principle__num">{p.num}</div>
              <div className="principle__title">{p.title}</div>
              <p className="principle__body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
