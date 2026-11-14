import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  FileText,
  Target,
  Gift,
  Users,
  UserCircle,
  Calendar,
  BarChart3,
  Shield,
  FolderOpen,
  Settings,
  Inbox,
  PieChart,
  ArrowLeftRight,
  LogOut,
  X,
  Plus,
  FileCheck,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/* ── Sidebar always-dark palette ─────────────────── */
const COLORS = {
  bg: '#151A21',
  text: '#F0F3F6',
  muted: '#848E9C',
  border: '#2B313A',
  accent: '#F0B90B',
  accentSoft: 'rgba(240,185,11,0.10)',
  negative: '#FF4D4F',
  adminTint: 'rgba(240,185,11,0.05)',
  adminBorder: 'rgba(240,185,11,0.18)',
};

// ── Investor nav ───────────────────────────────────────────
const INVESTOR_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  {
    to: '/opportunities/new',
    label: 'Submissions',
    icon: FileText,
    matchPaths: ['/opportunities/new', '/opportunities/mine'],
    children: [
      { to: '/opportunities/new', label: 'New Submission', icon: Plus },
      { to: '/opportunities/mine', label: 'My Submissions', icon: FileCheck },
    ],
  },
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

// ── Admin nav ──────────────────────────────────────────────
const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: BarChart3 },
  { to: '/admin/submissions', label: 'Submissions', icon: FileText },
  { to: '/admin/investors', label: 'Investors', icon: Users },
  { to: '/admin/kyc', label: 'KYC Queue', icon: Shield },
  {
    to: '/admin/projects',
    label: 'Projects',
    icon: FolderOpen,
    matchPaths: ['/admin/projects', '/admin/projects/pending'],
    children: [
      { to: '/admin/projects', label: 'All Projects', icon: FolderOpen },
      { to: '/admin/projects/pending', label: 'Pending Review', icon: Clock },
    ],
  },
  { to: '/admin/investments', label: 'Investments', icon: TrendingUp },
  { to: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/funding/review', label: 'Funding Review', icon: Inbox },
  {
    to: '/admin/insights',
    label: 'Insights',
    icon: FileText,
    matchPaths: ['/admin/insights', '/admin/insights/new'],
    children: [
      { to: '/admin/insights', label: 'All Insights', icon: FileText },
      { to: '/admin/insights/new', label: 'New Insight', icon: Plus },
    ],
  },
  // ── Personal (admin as a user) ────────────────────────
  { to: '/wallet', label: 'My Wallet', icon: Wallet },
  { to: '/statement', label: 'My Statement', icon: FileText },
  // ──────────────────────────────────────────────────────
  { to: '/admin/contact', label: 'Contact Inbox', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const isAdmin =
    user?.isAdmin === true ||
    user?.role === 'ADMIN' ||
    user?.roles?.includes('ADMIN') ||
    user?.roles?.includes('SUPER_ADMIN');
  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.role === 'SUPER_ADMIN';

  const links = isAdmin ? ADMIN_LINKS : INVESTOR_LINKS;

  // ── Dropdown open/closed state ─────────────────────────
  const [openGroups, setOpenGroups] = useState({});
  useEffect(() => {
    const next = {};
    links.forEach((item) => {
      if (!item.children) return;
      const matches = (item.matchPaths || [item.to]).some((p) =>
        p === '/admin/insights' || p === '/admin/projects'
          ? location.pathname.startsWith(p)
          : location.pathname === p || location.pathname.startsWith(p + '/')
      );
      if (matches) next[item.to] = true;
    });
    setOpenGroups((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function toggleGroup(key) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleLogout() {
    if (logout) logout();
    if (onClose) onClose();
    nav('/', { replace: true });
  }

  const content = (
    <>
      {/* Brand with ADMIN / SUPER ADMIN badge */}
      <div style={{ padding: '4px 12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {user?.image ? (
          <img
            src={user.image}
            alt={user.firstName || 'User'}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${COLORS.accent}`,
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: COLORS.accent,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
              boxShadow: isAdmin ? '0 0 0 2px rgba(240,185,11,0.30)' : 'none',
            }}
          >
            {((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'U'}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.text,
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'BraveVest'}
            </span>
            {isAdmin && (
              <span
                style={{
                  padding: '1px 6px',
                  background: COLORS.accent,
                  color: '#000',
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                {isSuperAdmin ? 'Super' : 'Admin'}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10,
              fontWeight: 600,
              color: COLORS.muted,
              lineHeight: 1.2,
            }}
          >
            {user?.username ? (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{typeof user.username === 'string' ? user.username : user.username.handle || ''}
              </span>
            ) : (
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
                UID: {(user?.id || '').slice(0, 8) || '—'}
              </span>
            )}

            <span style={{ color: COLORS.border }}>·</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                color: isAdmin
                  ? COLORS.accent
                  : user?.kycStatus === 'APPROVED' || user?.kyc?.status === 'APPROVED'
                    ? COLORS.accent
                    : COLORS.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {isAdmin ? (
                isSuperAdmin ? 'Super Admin' : 'Admin'
              ) : user?.kycStatus === 'APPROVED' || user?.kyc?.status === 'APPROVED' ? (
                <>
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </>
              ) : (
                'Unverified'
              )}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.muted,
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav aria-label="Dashboard navigation" style={{ flex: 1, overflowY: 'auto' }}>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {links.map((item) => {
            const { to, label, icon: Icon, children } = item;
            const hasChildren = Array.isArray(children) && children.length > 0;
            const isOpen = !!openGroups[to];

            const matchesGroup =
              hasChildren &&
              (item.matchPaths || [to]).some((p) =>
                p === '/admin/insights' || p === '/admin/projects'
                  ? location.pathname.startsWith(p)
                  : location.pathname === p || location.pathname.startsWith(p + '/')
              );

            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/admin' || to === '/dashboard'}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: isActive || matchesGroup ? 600 : 500,
                    color: isActive || matchesGroup ? COLORS.text : COLORS.muted,
                    background: isActive || matchesGroup ? COLORS.accentSoft : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        color={isActive || matchesGroup ? COLORS.accent : COLORS.muted}
                        aria-hidden="true"
                      />
                      <span style={{ flex: 1 }}>{label}</span>

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={isOpen ? 'Collapse' : 'Expand'}
                          aria-expanded={isOpen}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleGroup(to);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 2,
                            marginLeft: 4,
                            cursor: 'pointer',
                            color: COLORS.muted,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s',
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>
                      )}
                    </>
                  )}
                </NavLink>

                {hasChildren && isOpen && (
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: '2px 0 2px 0',
                      padding: '0 0 0 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    {children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            end
                            onClick={onClose}
                            style={({ isActive }) => ({
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 10px',
                              borderRadius: 6,
                              fontSize: 13,
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? COLORS.text : COLORS.muted,
                              background: isActive ? COLORS.accentSoft : 'transparent',
                              textDecoration: 'none',
                              transition: 'background 0.15s, color 0.15s',
                            })}
                          >
                            {({ isActive }) => (
                              <>
                                <ChildIcon
                                  size={14}
                                  color={isActive ? COLORS.accent : COLORS.muted}
                                  aria-hidden="true"
                                />
                                <span>{child.label}</span>
                              </>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 12 }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.muted,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.negative;
            e.currentTarget.style.background = 'rgba(255,77,79,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.muted;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={18} aria-hidden="true" />
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
    colorScheme: 'dark',
  };

  return (
    <>
      <aside aria-label="Dashboard navigation" className="bv-sidebar" style={sidebarStyle}>
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
            aria-label="Dashboard navigation"
            className="bv-sidebar bv-sidebar--mobile"
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