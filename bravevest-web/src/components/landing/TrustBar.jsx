import './TrustBar.css';

export default function TrustBar() {
  const items = [
    { label: 'SEC-aligned', sub: 'Compliance framework' },
    { label: '256-bit SSL', sub: 'Bank-grade encryption' },
    { label: 'PCI-DSS', sub: 'Payment processors' },
    { label: 'NDPA 2023', sub: 'Data protection' },
  ];

  return (
    <section className="trustbar">
      <div className="container trustbar__inner">
        {items.map((i) => (
          <div key={i.label} className="trustbar__item">
            <div className="trustbar__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="trustbar__text">
              <div className="trustbar__label">{i.label}</div>
              <div className="trustbar__sub">{i.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
