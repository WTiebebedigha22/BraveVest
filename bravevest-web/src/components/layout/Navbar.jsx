import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import CurrencySwitcher from '@/components/shared/CurrencySwitcher';
import { useAuth } from '@/hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={close}>
            <BraveMark />
            <span className="navbar__wordmark">BraveVest</span>
          </Link>
          <div className="navbar__seg">
            <button className="navbar__seg-btn is-active">Individual</button>
            <button className="navbar__seg-btn">Business</button>
          </div>
        </div>

        <nav className="navbar__nav">
          <NavLink to="/marketplace" className="navbar__link navbar__link--caret">Marketplace</NavLink>
          <NavLink to="/how-it-works" className="navbar__link">How It Works</NavLink>
          <NavLink to="/resources" className="navbar__link">Resources</NavLink>
          <NavLink to="/help" className="navbar__link">Help Center</NavLink>
          <NavLink to="/stories" className="navbar__link">Stories</NavLink>
          <NavLink to="/about" className="navbar__link">About</NavLink>
        </nav>

        <div className="navbar__right">
          <div className="navbar__right-desktop">
            <CurrencySwitcher />
            <a className="navbar__link navbar__link--underlined" href="#download">Download App</a>
            {user ? (
              <>
                <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar__link navbar__link--underlined">
                  Dashboard
                </Link>
                <Button onClick={logout} variant="primary" size="sm">Sign Out</Button>
              </>
            ) : (
              <Button as={Link} to="/register" variant="primary" size="sm">Apply Now</Button>
            )}
          </div>

          <button
            className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar__drawer" onClick={close}>
          <nav className="navbar__drawer-inner" onClick={(e) => e.stopPropagation()}>
            <NavLink to="/marketplace" className="navbar__drawer-link" onClick={close}>Marketplace</NavLink>
            <NavLink to="/how-it-works" className="navbar__drawer-link" onClick={close}>How It Works</NavLink>
            <NavLink to="/resources" className="navbar__drawer-link" onClick={close}>Resources</NavLink>
            <NavLink to="/about" className="navbar__drawer-link" onClick={close}>About</NavLink>
            <a href="#download" className="navbar__drawer-link" onClick={close}>Download App</a>

            <div className="navbar__drawer-divider" />

            <div className="navbar__drawer-cur">
              <CurrencySwitcher />
            </div>

            {user ? (
              <>
                <NavLink
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="navbar__drawer-link"
                  onClick={close}
                >
                  Dashboard
                </NavLink>
                <Button onClick={() => { logout(); close(); }} variant="primary" size="lg" className="navbar__drawer-cta">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navbar__drawer-link" onClick={close}>Login</NavLink>
                <Button as={Link} to="/register" variant="primary" size="lg" className="navbar__drawer-cta" onClick={close}>
                  Apply Now
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function BraveMark() {
  return (
    <span className="navbar__mark" aria-hidden>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <defs>
          <linearGradient id="bvg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3FB8C4" />
            <stop offset="100%" stopColor="#B3D941" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#bvg)" />
        <path d="M8 8l4 8 4-8" stroke="#0F0F10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
