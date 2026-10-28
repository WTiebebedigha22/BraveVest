import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';
import { LayoutDashboard, PieChart, Wallet, Menu, User, Settings, LogOut, FileText, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="dash-layout">
      {/* Desktop Sidebar */}
      <div className="dash-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="dash-main">
        {/* Top Header */}
        <header className="dash-mobile-header">
          <Link to="/" className="dash-mobile-logo">
            <img src="/logo.png" alt="BraveVest" style={{ height: 28, width: 'auto' }} />
          </Link>
          <div className="dash-mobile-actions">
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={20} />
            </button>
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
              <div className="mobile-dropdown">
                <Link to="/profile" className="mobile-dropdown__item" onClick={() => setMenuOpen(false)}>
                  <User size={16} /> Profile
                </Link>
                <Link to="/documents" className="mobile-dropdown__item" onClick={() => setMenuOpen(false)}>
                  <FileText size={16} /> Documents
                </Link>
                <Link to="/notifications" className="mobile-dropdown__item" onClick={() => setMenuOpen(false)}>
                  <Bell size={16} /> Notifications
                </Link>
                <Link to="/settings" className="mobile-dropdown__item" onClick={() => setMenuOpen(false)}>
                  <Settings size={16} /> Settings
                </Link>
                <div className="mobile-dropdown__divider" />
                <button className="mobile-dropdown__item text-danger" onClick={logout}>
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="dash-mobile-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active' : ''}>
          <PieChart size={20} />
          <span>Portfolio</span>
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => isActive ? 'active' : ''}>
          <Wallet size={20} />
          <span>Wallet</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
