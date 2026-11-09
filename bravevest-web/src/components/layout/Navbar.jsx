import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LINKS = [
  { to: '/marketplace', label: 'Markets' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

const navbarStyles = `
  .bv-navbar {
    position: sticky;
    top: 0;
    z-index: 60;
    background: rgba(11, 14, 17, 0.95);
    backdrop-filter: saturate(180%) blur(12px);
    -webkit-backdrop-filter: saturate(180%) blur(12px);
    border-bottom: 1px solid #1e2329;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .bv-navbar__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: 24px;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .bv-navbar__nav {
    display: none;
    gap: 12px;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
  }

  @media (min-width: 1025px) {
    .bv-navbar__nav {
      display: flex;
    }
  }

  .bv-navbar__link {
    font-size: 14px;
    color: #848e9c;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 6px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .bv-navbar__link:hover {
    background: #1e2329;
    color: #eaecef;
  }

  .bv-navbar__link.active {
    color: #f0b90b !important;
    background: #1e2329 !important;
    font-weight: 600;
  }

  .bv-navbar__right-desktop {
    display: none;
    align-items: center;
    gap: 10px;
  }

  @media (min-width: 1025px) {
    .bv-navbar__right-desktop {
      display: flex;
    }
  }

  .bv-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 18px;
    border-radius: 6px;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    font-family: inherit;
  }

  .bv-btn--primary {
    background-color: #f0b90b;
    color: #000;
  }

  .bv-btn--primary:hover {
    background-color: #fcd535;
  }

  .bv-btn--ghost {
    background: transparent;
    color: #eaecef;
    border: 1px solid #262930;
  }

  .bv-btn--ghost:hover {
    background-color: #1e2329;
    border-color: #363a45;
  }

  .bv-burger {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    gap: 5px;
    border: 1px solid #262930;
    border-radius: 6px;
    background: #181a20;
    cursor: pointer;
    padding: 0;
  }

  .bv-burger span {
    display: block;
    width: 18px;
    height: 2px;
    background: #eaecef;
    border-radius: 2px;
    transition: all 0.2s ease;
  }

  .bv-burger.is-active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .bv-burger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .bv-burger.is-active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (min-width: 1025px) {
    .bv-burger {
      display: none;
    }
  }

  .bv-drawer {
    position: fixed;
    inset: 64px 0 0 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 55;
    animation: bvFadeIn 0.15s ease forwards;
  }

  .bv-drawer-inner {
    background: #0b0e11;
    border-bottom: 1px solid #1e2329;
    padding: 20px 24px 28px;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
    animation: bvSlideDown 0.2s ease forwards;
  }

  .bv-drawer-link {
    display: block;
    padding: 14px 0;
    font-size: 15px;
    font-weight: 500;
    color: #eaecef;
    border-bottom: 1px solid #1e2329;
    text-decoration: none;
  }

  .bv-drawer-link:hover {
    color: #f0b90b;
  }

  .bv-profile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 98;
  }

  .bv-profile-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    background: #181a20;
    border-left: 1px solid #262930;
    z-index: 99;
    display: flex;
    flex-direction: column;
    padding: 24px;
    color: #fff;
  }

  .bv-profile-nav__item {
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    color: #848e9c;
    font-size: 14px;
    transition: all 0.15s ease;
  }

  .bv-profile-nav__item:hover {
    background: #1e2329;
    color: #fff;
  }

  @keyframes bvFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bvSlideDown {
    from { transform: translateY(-8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout?.();
    setSidebarOpen(false);
    setDrawerOpen(false);
    nav('/', { replace: true });
  }

  if (loading) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navbarStyles }} />

      <header className="bv-navbar">
        <div className="bv-navbar__inner">
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img
                src="/icons/logo-dark.png"
                alt="BraveVest"
                style={{ height: '30px', width: 'auto', display: 'block' }}
              />
            </Link>
          </div>

          <nav className="bv-navbar__nav">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `bv-navbar__link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="bv-navbar__right-desktop">
              {user ? (
                <>
                  <Link to="/deposit" className="bv-btn bv-btn--primary">
                    Deposit
                  </Link>
                  <button
                    onClick={() => nav('/wallet')}
                    className="bv-btn bv-btn--ghost"
                    style={{ gap: '8px' }}
                  >
                    <Wallet size={16} /> Assets
                  </button>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      background: '#f0b90b',
                      border: 'none',
                      color: '#000',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: 'inherit',
                    }}
                  >
                    {user.firstName?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      'U'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="bv-btn bv-btn--ghost">
                    Log In
                  </Link>
                  <Link to="/register" className="bv-btn bv-btn--primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              className={`bv-burger ${drawerOpen ? 'is-active' : ''}`}
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="bv-drawer" onClick={() => setDrawerOpen(false)}>
          <div className="bv-drawer-inner" onClick={(e) => e.stopPropagation()}>
            <nav>
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setDrawerOpen(false)}
                  className="bv-drawer-link"
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div style={{ height: '1px', background: '#1e2329', margin: '16px 0' }} />

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      setSidebarOpen(true);
                    }}
                    style={{
                      background: '#f0b90b',
                      border: 'none',
                      color: '#000',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {user.firstName?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      'U'}
                  </button>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#eaecef' }}>
                      {user.email}
                    </div>
                    <div style={{ fontSize: '12px', color: '#f0b90b' }}>
                      Tap avatar to open profile
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to="/deposit"
                    onClick={() => setDrawerOpen(false)}
                    className="bv-btn bv-btn--primary"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setDrawerOpen(false)}
                    className="bv-btn bv-btn--ghost"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Assets
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="bv-btn bv-btn--ghost"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setDrawerOpen(false)}
                  className="bv-btn bv-btn--primary"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {sidebarOpen && user && (
        <>
          <div className="bv-profile-overlay" onClick={() => setSidebarOpen(false)} />
          <div className="bv-profile-sidebar">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '20px',
                borderBottom: '1px solid #262930',
              }}
            >
              <div
                style={{
                  background: '#f0b90b',
                  color: '#000',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                {user.firstName?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#eaecef',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {user.email || 'user@bravevest.com'}
                </div>
                <div style={{ fontSize: '12px', color: '#f0b90b' }}>
                  {user.roles?.includes('ADMIN') ? 'Admin Account' : 'Main Account'}
                  <span style={{ color: '#888', marginLeft: '8px' }}>
                    UID: {user.id?.substring(0, 8) || '59197723'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
              <button
                className="bv-btn bv-btn--primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/deposit');
                }}
              >
                Deposit
              </button>
              <button
                className="bv-btn bv-btn--ghost"
                style={{ flex: 1 }}
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/withdraw');
                }}
              >
                Withdraw
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/dashboard');
                }}
              >
                Overview
              </div>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/wallet');
                }}
              >
                Wallet
              </div>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/notifications');
                }}
              >
                Notifications
              </div>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/referrals');
                }}
              >
                Referral Program
              </div>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/profile');
                }}
              >
                Profile
              </div>
              <div
                className="bv-profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/goals');
                }}
              >
                Goals
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid #262930' }}>
              <button
                className="bv-btn bv-btn--ghost"
                onClick={handleLogout}
                style={{ width: '100%', gap: '8px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
              >
                <LogOut size={16} color="#000" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
