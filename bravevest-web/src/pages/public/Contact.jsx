export default function Contact() {
  return (
    <div className="container" style={{ padding: '80px 28px', maxWidth: 700 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--gray-600)', marginBottom: 16 }}>
        Contact
      </div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 56 }}>Get in touch.</h1>
      <p style={{ color: 'var(--gray-600)', fontSize: 17, marginTop: 20 }}>
        Email us at <a href="mailto:hello@bravevest.com" style={{ textDecoration: 'underline' }}>hello@bravevest.com</a>.
      </p>
    </div>
  );
}