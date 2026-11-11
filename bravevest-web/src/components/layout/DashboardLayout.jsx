import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { ThemeLogo } from '@/components/shared/ThemeLogo';
import { useIsAdmin } from '@/AppEnhancements';

export default function DashboardLayout() {
  const isAdmin = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bv-background)' }}>
      <div className='dash-sidebar-desktop' style={{ display: 'block' }}>
        <Sidebar />
      </div>

      {mobileOpen && (
        <div>
          <div onClick={function() { setMobileOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'var(--bv-overlay)', zIndex: 90 }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 95, background: 'var(--bv-surface)' }}>
            <Sidebar onNavigate={function() { setMobileOpen(false); }} />
          </div>
        </div>
      )}

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className='dash-mobile-bar' style={{ display: 'none', padding: '12px 16px', borderBottom: '1px solid var(--bv-border)', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bv-background)' }}>
          <button onClick={function() { setMobileOpen(true); }} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '8px' }} aria-label='Open menu'>
            <Menu size={22} />
          </button>
          <Link to='/dashboard'>
            <ThemeLogo height={22} alt="BraveVest" />
          </Link>
          </div>
        <Outlet />
      </main>
    </div>
  );
}
