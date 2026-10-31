export default function Contact() {
  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container container--narrow">
        <span className="eyebrow">Contact</span>
        <h1 style={{ marginBottom: '24px' }}>Speak with our team.</h1>
        <p className="lede" style={{ marginBottom: '64px' }}>
          For institutional inquiries, partnership discussions, or account support — reach out directly.
        </p>
        <div className="grid-2">
          <div className="card">
            <div className="data-label">Investor Relations</div>
            <div style={{ marginTop: '12px', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
              investors@bravevest.com
            </div>
          </div>
          <div className="card">
            <div className="data-label">Institutional Lending</div>
            <div style={{ marginTop: '12px', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
              borrowers@bravevest.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
