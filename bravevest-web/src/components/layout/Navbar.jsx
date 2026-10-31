import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LINKS = [
  { to: '/marketplace', label: 'Markets' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout?.();
    setSidebarOpen(false);
    nav('/', { replace: true });
  }

  // Do not flash unauthenticated state while loading
  if (loading) return null;

  return (
    <>
      <header className="navbar" style={{ background: '#000000', borderBottom: '1px solid #2A2A2A' }}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img
            src="/icons/logo-dark.png"
            alt="BraveVest"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />
        </Link>

        <nav className="navbar__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: isActive ? '600' : '500',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/wallet/deposit" className="btn btn--primary btn--sm" style={{ borderRadius: '20px' }}>Deposit</Link>
              <button onClick={() => nav('/wallet')} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit' }}>
                <Wallet size={18} /> Assets
              </button>
              <button onClick={() => setSidebarOpen(true)} style={{ background: '#F6A500', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
                {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Log In</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>

      {/* PROFILE SIDEBAR */}
      {sidebarOpen && user && (
        <>
          <div className="profile-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.firstName?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email || 'user@bravevest.com'}
                </div>
                <div style={{ fontSize: '12px', color: '#F6A500' }}>
                  {user.roles?.includes('ADMIN') ? 'Admin Account' : 'Main Account'}
                  <span style={{ color: '#888', marginLeft: '8px' }}>
                    UID: {user.id?.substring(0, 8) || '59197723'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/wallet/deposit');
                }}
              >
                Deposit
              </button>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/wallet/withdraw');
                }}
              >
                Withdraw
              </button>
            </div>

            <div className="profile-nav">
              <div
                className="profile-nav__item"
                onClick={() => {
                  setSidebarOpen(false);
                  nav('/dashboard');
                }}
              >
                Overview
              </div>
              <div className="profile-nav__item">Account</div>
              <div className="profile-nav__item">My Events</div>
              <div className="profile-nav__item">Referral Program</div>
              <div className="profile-nav__item">Preference Settings</div>
              <div className="profile-nav__item">API</div>
            </div>

            <div className="profile-footer">
              <button
                className="logout-btn"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
