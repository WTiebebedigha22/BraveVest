import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bv-background)' }}>
      {/* Desktop Sidebar */}
      <div className="dash-sidebar-desktop" style={{ display: 'block' }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--bv-overlay)',
              zIndex: 90,
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 95,
            background: 'var(--bv-surface)',
          }}>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top bar */}
        <div
          className="dash-mobile-bar"
          style={{
            display: 'none',
            padding: '12px 16px',
            borderBottom: '1px solid var(--bv-border)',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bv-background)',
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bv-text)',
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard">
            <img
              src="/logo.png"
              alt="BraveVest"
              style={{
                height: '22px',
                filter: 'var(--bv-logo-filter)',
              }}
            />
          </Link>
          <ThemeToggle />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
