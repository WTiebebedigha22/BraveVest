import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, PieChart, Wallet, Menu, X, LogOut,
  Compass, User
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Opportunities', icon: Compass },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

const dashboardLayoutStyles = `
  .bv-dash-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0b0e11;
    color: #eaecef;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Desktop Sidebar */
  .bv-dash-sidebar {
    width: 260px;
    background: #181a20;
    border-right: 1px solid #262930;
    padding: 32px 20px;
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    z-index: 50;
  }

  /* Nav Links */
  .bv-dash-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #848e9c;
    border-left: 2px solid transparent;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 0 6px 6px 0;
    transition: all 0.15s ease;
  }

  .bv-dash-link:hover {
    color: #eaecef;
    background: rgba(255, 255, 255, 0.03);
  }

  .bv-dash-link.active {
    color: #f0b90b !important;
    border-left-color: #f0b90b !important;
    background: rgba(240, 185, 11, 0.08) !important;
    font-weight: 600;
  }

  /* Mobile Top Bar */
  .bv-dash-mobile-bar {
    display: none;
    padding: 14px 20px;
    background: #181a20;
    border-bottom: 1px solid #262930;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 40;
  }

  /* Mobile Drawer Overlay */
  .bv-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 90;
    animation: bvFadeIn 0.15s ease forwards;
  }

  /* Mobile Drawer Content */
  .bv-drawer-content {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    background: #181a20;
    border-right: 1px solid #262930;
    z-index: 95;
    padding: 24px;
    display: flex;
    flex-direction: column;
    animation: bvSlideRight 0.2s ease forwards;
  }

  /* Mobile Bottom Navigation Bar */
  .bv-mobile-bottom-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #181a20;
    border-top: 1px solid #262930;
    z-index: 45;
    justify-content: space-around;
    align-items: center;
  }

  .bv-mobile-bottom-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #848e9c;
    font-size: 11px;
    text-decoration: none;
    font-weight: 500;
  }

  .bv-mobile-bottom-link.active {
    color: #f0b90b;
  }

  @media (max-width: 900px) {
    .bv-dash-sidebar {
      display: none;
    }
    .bv-dash-mobile-bar {
      display: flex;
    }
    .bv-mobile-bottom-nav {
      display: flex;
    }
    .bv-dash-main {
      padding-bottom: 64px;
    }
  }

  @keyframes bvFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bvSlideRight {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    nav('/login', { replace: true });
  }

  return (
    <div className="bv-dash-layout">
      <style dangerouslySetInnerHTML={{ __html: dashboardLayoutStyles }} />

      {/* ── Desktop Sidebar ── */}
      <aside className="bv-dash-sidebar">
        <Link to="/" style={{ marginBottom: '40px', display: 'block' }}>
          <img
            src="/icons/logo-dark.png"
            alt="BraveVest"
            style={{ height: '28px', width: 'auto', display: 'block' }}
          />
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ marginBottom: '12px', fontSize: '11px', color: '#848e9c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '16px' }}>
            Navigation
          </div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `bv-dash-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid #262930', paddingTop: '20px', marginTop: '20px' }}>
          <div style={{ marginBottom: '6px', fontSize: '11px', color: '#848e9c', fontWeight: '600', textTransform: 'uppercase' }}>
            Signed in as
          </div>
          <div style={{ fontSize: '13px', color: '#eaecef', marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
            {user?.email || 'user@bravevest.com'}
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ff4d4f',
              fontSize: '13px',
              padding: 0,
              fontWeight: '600',
              fontFamily: 'inherit',
            }}
          >
            <LogOut size={16} strokeWidth={1.8} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Layout & Mobile Wrappers ── */}
      <main className="bv-dash-main" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Mobile Top Bar */}
        <div className="bv-dash-mobile-bar">
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/icons/logo-dark.png" alt="BraveVest" style={{ height: '24px', width: 'auto', display: 'block' }} />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#eaecef', cursor: 'pointer', padding: '4px' }}
            aria-label="Toggle drawer"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Slide-Over Drawer */}
        {menuOpen && (
          <>
            <div className="bv-drawer-overlay" onClick={() => setMenuOpen(false)} />
            <div className="bv-drawer-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src="/icons/logo-dark.png" alt="BraveVest" style={{ height: '26px', width: 'auto' }} />
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#848e9c', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => `bv-dash-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>

              <div style={{ borderTop: '1px solid #262930', paddingTop: '20px', marginTop: 'auto' }}>
                <div style={{ fontSize: '13px', color: '#eaecef', marginBottom: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || 'user@bravevest.com'}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4f',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </>
        )}

        {/* Page Content */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        {/* Mobile Bottom Fixed Navigation */}
        <div className="bv-mobile-bottom-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `bv-mobile-bottom-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </main>
    </div>
  );
}
