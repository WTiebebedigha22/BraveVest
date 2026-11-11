import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { to: '/marketplace', label: 'Marketplace' },
      { to: '/how-it-works', label: 'How it works' },
      { to: '/about', label: 'About us' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/security', label: 'Security' },
      { to: '/support', label: 'Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/risk-disclosure', label: 'Risk Disclosure' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Sign in' },
      { to: '/register', label: 'Create account' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/wallet', label: 'Wallet' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#1A1A1A',
        borderTop: '1px solid #1A1A1A',
        color: 'var(--bv-bg-elevated)',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '56px 20px 32px',
        }}
      >
        {/* Top: brand + 4 link columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand — logo image */}
          <div>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginBottom: 16,
              }}
            >
              <img
                src="/icons/logo-dark.png"
                alt="BraveVest"
                style={{
                  height: 32,
                  width: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </Link>
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: '0 0 16px',
                maxWidth: 260,
              }}
            >
              Direct access to vetted Nigerian private credit, real estate, and SME opportunities.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'rgba(246,165,0,0.1)',
                border: '1px solid rgba(246,165,0,0.2)',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--bv-accent)',
              }}
            >
              <Shield size={12} />
              Bravelion Holdings Company
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--bv-accent)',
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      style={{
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            alignItems: 'center',
            paddingTop: 20,
            borderTop: '1px solid #1A1A1A',
            marginBottom: 20,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={14} color="var(--bv-accent)" />
            <a
              href="mailto:support@bravevest.com"
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              support@bravevest.com
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} color="var(--bv-accent)" />
            <span>Lagos, Nigeria</span>
          </div>
        </div>

        {/* Risk disclaimer */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: 20,
            opacity: 0.85,
          }}
        >
          <strong style={{ color: 'var(--bv-accent)' }}>Risk warning:</strong> All investments carry risk. Your
          capital is at risk. Returns are projections, not guarantees. Past performance is not
          indicative of future results. Read our{' '}
          <Link to="/risk-disclosure" style={{ color: 'var(--bv-accent)', textDecoration: 'none' }}>
            full risk disclosure
          </Link>{' '}
          before investing.
        </p>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 20,
            borderTop: '1px solid #1A1A1A',
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          <div>© {new Date().getFullYear()} BraveVest. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Terms
            </Link>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Privacy
            </Link>
            <Link to="/risk-disclosure" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Disclosures
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}