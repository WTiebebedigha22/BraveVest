import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Wallet, FileText, Target,
  Gift, Users, UserCircle, Calendar, BarChart3, Shield,
  FolderOpen, Settings, Inbox, PieChart, ArrowLeftRight, LogOut, X,
  Plus, FileCheck, Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const COLORS = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#6B7280',
  border: '#EAEAEA',
  accent: '#F6A500',
  accentSoft: 'rgba(246,165,0,0.1)',
  negative: '#F6465D',
  adminTint: 'rgba(246,165,0,0.04)',
  adminBorder: 'rgba(246,165,0,0.15)',
};

const INVESTOR_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/opportunities/new', label: 'Submit Opportunity', icon: Plus },
  { to: '/opportunities/mine', label: 'My Submissions', icon: FileCheck },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/statement', label: 'Statement', icon: FileText },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/referral', label: 'Referral', icon: Gift },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Inbox },
  { to: '/year-in-review', label: 'Year in Review', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: BarChart3 },
  { to: '/admin/investors', label: 'Investors', icon: Users },
  { to: '/admin/kyc', label: 'KYC Queue', icon: Shield },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { to: '/admin/projects/pending', label: 'Pending Review', icon: Clock },
  { to: '/admin/investments', label: 'Investments', icon: TrendingUp },
  { to: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/funding/review', label: 'Funding Review', icon: Inbox },
  { to: '/admin/insights', label: 'Insights', icon: FileText },
  { to: '/admin/contact', label: 'Contact Inbox', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isAdmin = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';
  const links = isAdmin ? ADMIN_LINKS : INVESTOR_LINKS;

  function handleLogout() {
    if (logout) logout();
    if (onClose) onClose();
    nav('/', { replace: true });
  }

  const content = (
    <>
      {/* Brand with ADMIN badge */}
      <div style={{ padding: '4px 12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: COLORS.accent, color: '#FFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16,
          boxShadow: isAdmin ? '0 0 0 2px rgba(246,165,0,0.3)' : 'none',
        }}>B</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, letterSpacing: '-0.01em' }}>BraveVest</span>
            {isAdmin && (
              <span style={{
                padding: '2px 7px',
                background: COLORS.accent,
                color: '#0A0A0A',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1.4,
              }}>Admin</span>
            )}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: isAdmin ? COLORS.accent : COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 1 }}>
            {isAdmin ? 'Platform control' : 'Investor portal'}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label='Close menu' style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav aria-label='Dashboard navigation' style={{ flex: 1, overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const end = to === '/admin' || to === '/dashboard';
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? COLORS.text : COLORS.muted,
                    background: isActive ? COLORS.accentSoft : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} color={isActive ? COLORS.accent : COLORS.muted} aria-hidden='true' />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 12 }}>
        <button
          type='button'
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: COLORS.muted, background: 'transparent', border: 'none',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.negative; e.currentTarget.style.background = 'rgba(246,70,93,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.muted; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={18} aria-hidden='true' />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  const sidebarStyle = {
    width: 260,
    flexShrink: 0,
    background: isAdmin
      ? `linear-gradient(180deg, ${COLORS.adminTint} 0%, ${COLORS.bg} 40%)`
      : COLORS.bg,
    borderRight: `1px solid ${isAdmin ? COLORS.adminBorder : COLORS.border}`,
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
  };

  return (
    <>
      <aside aria-label='Dashboard navigation' className='bv-sidebar' style={sidebarStyle}>
        {content}
      </aside>

      {mobileOpen && (
        <>
          <div
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: '64px 0 0 0',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 95,
            }}
          />
          <aside
            aria-label='Dashboard navigation'
            className='bv-sidebar bv-sidebar--mobile'
            style={{
              ...sidebarStyle,
              position: 'fixed',
              top: 64,
              left: 0,
              bottom: 0,
              zIndex: 100,
            }}
          >
            {content}
          </aside>
        </>
      )}
    </>
  );
}
