import { useState } from 'react';
import { Menu, Shield } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { useScrollFade } from '@/hooks/useScrollFade';

export default function PortalLayout({
  children,
  theme = 'dark',
  footer = true,
  ticker = false,
}) {
  useScrollFade();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';

  return (
    <div
      className={theme === 'dark' ? 'bv-dark' : 'bv-light'}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />

      {/* Admin mode banner */}
      {isAdmin && (
        <div style={{
          background: 'var(--bv-accent)',
          color: 'var(--bv-text)',
          padding: '8px 24px',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}>
          <Shield size={14} />
          <span>You are in <strong>Admin mode</strong> — actions here affect all users</span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'stretch', width: '100%' }}>
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Mobile menu bar */}
          <div className='bv-portal__mobile-bar' style={{ display: 'none' }}>
            <button
              type='button'
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 14px',
                background:  'var(--bg-soft, var(--bv-bg-elevated))',
                border: '1px solid var(--border, #262626)',
                borderRadius: 8,
                color: 'var(--text, var(--bv-bg-elevated))',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <Menu size={18} /> Menu
            </button>
          </div>

          <main style={{ flex: 1, minHeight: '400px' }}>{children}</main>
        </div>
      </div>

      {footer && <Footer />}

      <style>{`
        @media (max-width: 900px) {
          .bv-sidebar:not(.bv-sidebar--mobile) { display: none !important; }
          .bv-portal__mobile-bar { display: block !important; padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}
