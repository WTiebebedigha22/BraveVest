import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, PieChart, Wallet, Menu, LogOut,
  Compass, Settings, User
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Opportunities', icon: Compass },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    nav('/login', { replace: true });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy-900)' }}>
      {/* ── Desktop Sidebar ── */}
      <aside style={{
        width: '280px',
        background: 'var(--navy-950)',
        borderRight: '1px solid var(--line)',
        padding: '40px 24px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <Link to="/dashboard" style={{ marginBottom: '48px', display: 'block' }}>
          <img src="/logo.png" alt="BraveVest" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div className="data-label" style={{ marginBottom: '16px', fontSize: '10px' }}>Navigation</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: isActive ? 'var(--gold)' : 'var(--slate)',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: '400',
                textDecoration: 'none',
                transition: 'all 0.2s',
              })}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', marginTop: '24px' }}>
          <div className="data-label" style={{ marginBottom: '8px', fontSize: '10px' }}>Signed in as</div>
          <div style={{ fontSize: '13px', color: 'var(--ivory)', marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email || 'Investor'}
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--slate)', fontSize: '13px', padding: 0,
            }}
          >
            <LogOut size={16} strokeWidth={1.5} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Mobile top bar */}
        <div style={{
          display: 'none', // toggled by media query via inline style not possible; use CSS class
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} className="mobile-top-bar">
          <Link to="/dashboard">
            <img src="/logo.png" alt="BraveVest" style={{ height: '24px', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--ivory)', cursor: 'pointer' }}
          >
            <Menu size={22} />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
