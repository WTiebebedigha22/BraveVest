import { Link } from 'react-router-dom';

export default function PageShell({ title, subtitle, backTo, actions, children }) {
  return (
    <div style={{ padding: '32px 0', minHeight: '100vh', background: 'var(--bybit-black)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            {backTo && (
              <Link to={backTo} style={{ fontSize: '12px', color: 'var(--bybit-text-muted)', marginBottom: '8px', display: 'block' }}>
                ← Back
              </Link>
            )}
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
