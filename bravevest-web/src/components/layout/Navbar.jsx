import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Button from '@/components/shared/Button';
import CurrencySwitcher from '@/components/shared/CurrencySwitcher';
import { useAuth } from '@/hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    function onClick(e) { if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null); }
    function onKey(e) { if (e.key === 'Escape') setOpenMenu(null); }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="navbar" ref={navRef}>
      <div className="container navbar__inner">
        <div className="navbar__left">
          <Link to="/" className="navbar__brand" onClick={() => setOpenMenu(null)}>
            <span className="navbar__mark" />
            <span className="navbar__wordmark">BraveVest</span>
          </Link>
          <div className="navbar__seg">
            <button className="navbar__seg-btn is-active">Individual</button>
            <button className="navbar__seg-btn">Business</button>
          </div>
        </div>

        <nav className="navbar__nav">
          <NavLink to="/marketplace" className="navbar__link">Marketplace</NavLink>
          <Dropdown label="Explore" open={openMenu === 'explore'} onOpen={() => setOpenMenu(openMenu === 'explore' ? null : 'explore')} items={[
            { to: '/how-it-works', label: 'How It Works', desc: 'The full investor journey' },
            { to: '/stories', label: 'Investor Stories', desc: 'Real outcomes' },
            { to: '/starter', label: 'Starter Pool', desc: 'Start from ₦5,000' },
            { to: '/insights', label: 'Insights', desc: 'Market briefs & education' },
          ]} />
          <Dropdown label="Resources" open={openMenu === 'resources'} onOpen={() => setOpenMenu(openMenu === 'resources' ? null : 'resources')} items={[
            { to: '/help', label: 'Help Center', desc: 'Guides and FAQs' },
            { to: '/about', label: 'About BraveVest', desc: 'Powered by Bravelion Capital' },
            { to: '/contact', label: 'Contact', desc: 'Get in touch' },
          ]} />
        </nav>

        <div className="navbar__right">
          <div className="navbar__right-desktop">
            <CurrencySwitcher />
            {user ? (
              <>
                <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar__link navbar__link--muted">Dashboard</Link>
                <Button onClick={logout} variant="secondary" size="sm">Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__link navbar__link--muted">Log in</Link>
                <Button as={Link} to="/register" variant="primary" size="sm">Apply Now</Button>
              </>
            )}
          </div>
          <button className={'navbar__burger ' + (mobileOpen ? 'is-open' : '')} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__drawer" onClick={() => setMobileOpen(false)}>
          <nav className="navbar__drawer-inner" onClick={(e) => e.stopPropagation()}>
            <NavLink to="/marketplace" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Marketplace</NavLink>
            <NavLink to="/how-it-works" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>How It Works</NavLink>
            <NavLink to="/stories" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Investor Stories</NavLink>
            <NavLink to="/insights" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Insights</NavLink>
            <NavLink to="/help" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Help Center</NavLink>
            <NavLink to="/about" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>About</NavLink>
            <div className="navbar__drawer-divider" />
            <div className="navbar__drawer-cur"><CurrencySwitcher /></div>
            {user ? (
              <>
                <NavLink to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                <Button onClick={logout} variant="primary" size="lg" className="navbar__drawer-cta">Sign out</Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>Log in</NavLink>
                <Button as={Link} to="/register" variant="primary" size="lg" className="navbar__drawer-cta" onClick={() => setMobileOpen(false)}>Apply Now</Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function Dropdown({ label, open, onOpen, items }) {
  return (
    <div className={'navbar__dropdown ' + (open ? 'is-open' : '')}>
      <button className="navbar__link navbar__link--caret" onClick={onOpen}>{label}</button>
      {open && (
        <div className="navbar__menu">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className="navbar__menu-item">
              <div className="navbar__menu-label">{item.label}</div>
              <div className="navbar__menu-desc">{item.desc}</div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
