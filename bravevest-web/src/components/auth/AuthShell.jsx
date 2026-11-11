import './AuthShell.css';

const valueProps = [
  { icon: '🛡️', title: 'Verified opportunities', desc: 'Every listing vetted by Bravelion Capital.' },
  { icon: '📈', title: 'Real, transparent returns', desc: 'See projected earnings before you commit.' },
  { icon: '🔒', title: 'Bank-grade security', desc: 'KYC-protected accounts, Paystack-secured payments.' },
];

export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <a href="#/" className="auth-brand-logo">
          <span className="auth-brand-mark">B</span>
          <span className="auth-brand-name">BraveVest</span>
        </a>
        <h2 className="auth-brand-headline">Invest with clarity, not guesswork.</h2>
        <ul className="auth-brand-props">
          {valueProps.map((p) => (
            <li key={p.title}>
              <span className="auth-prop-icon" aria-hidden="true">{p.icon}</span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="auth-brand-foot">A Bravelion Holdings Company · SEC-aligned KYC</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </header>
          <div className="auth-form-body">{children}</div>
          {footer && <footer className="auth-footer bv-always-dark">{footer}</footer>}
        </div>
      </main>
    </div>
  );
}
