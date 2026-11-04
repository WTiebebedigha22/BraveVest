import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard, Compass, PieChart, Wallet, FileText,
  Target, Users, Gift, Share2, Calendar, User,
  Shield, AlertCircle, DollarSign, Settings, MessageSquare, FolderKanban
} from 'lucide-react';

const investorGroups = [
  { label: 'Invest', links: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/marketplace', label: 'Marketplace', icon: Compass },
    { to: '/investments', label: 'My Investments', icon: PieChart },
    { to: '/portfolio', label: 'Portfolio', icon: PieChart },
    { to: '/commitments', label: 'Commitments', icon: Target },
  ]},
  { label: 'Money', links: [
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    { to: '/deposit', label: 'Deposit', icon: DollarSign },
    { to: '/withdraw', label: 'Withdraw', icon: DollarSign },
  ]},
  { label: 'Grow', links: [
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/groups', label: 'Group Savings', icon: Users },
    { to: '/referral', label: 'Referrals', icon: Share2 },
    { to: '/gifting', label: 'Gifting', icon: Gift },
  ]},
  { label: 'Account', links: [
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/year-in-review', label: 'Year in Review', icon: Calendar },
    { to: '/profile', label: 'Profile', icon: User },
  ]},
];

const adminGroups = [
  { label: 'Overview', links: [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/transactions', label: 'Transactions', icon: DollarSign },
  ]},
  { label: 'Operations', links: [
    { to: '/admin/kyc', label: 'KYC Review', icon: Shield },
    { to: '/admin/investors', label: 'Investors', icon: Users },
    { to: '/admin/funding/review', label: 'Funding Review', icon: AlertCircle },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  ]},
  { label: 'Finance', links: [
    { to: '/admin/investments', label: 'Investments', icon: PieChart },
  ]},
  { label: 'Content & Support', links: [
    { to: '/admin/insights', label: 'Insights', icon: FileText },
    { to: '/admin/contact', label: 'Contact Inbox', icon: MessageSquare },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]},
];

function getUserRoles(user) {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length) return user.roles;
  if (user.role) return [user.role];
  return [];
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const roles = getUserRoles(user);
  const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
  const groups = isAdmin ? adminGroups : investorGroups;

  function handleLinkClick() {
    if (onNavigate) onNavigate();
  }

  return (
    <aside
      className="sidebar"
      style={{
        width: '260px',
        background: 'var(--bv-surface)',
        borderRight: '1px solid var(--bv-border)',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <Link to="/" className="sidebar__brand" style={{ marginBottom: '24px', display: 'block', padding: '0 8px' }} onClick={handleLinkClick}>
        <img
          src="/logo.png"
          alt="BraveVest"
          style={{
            height: '24px',
            width: 'auto',
            filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </Link>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--bv-text-dim)',
              padding: '0 12px',
              marginBottom: '8px',
            }}>
              {group.label}
            </div>
            <nav>
              {group.links.map((l) => {
                const Icon = l.icon;
                const isActive = location.pathname === l.to || (l.end && location.pathname === l.to);
                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={handleLinkClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      marginBottom: '2px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: isActive ? 'var(--bv-orange)' : 'var(--bv-text-muted)',
                      background: isActive ? 'var(--bv-orange-soft)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--bv-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {Icon && <Icon size={16} strokeWidth={1.5} />}
                    <span>{l.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User block */}
      <div style={{
        borderTop: '1px solid var(--bv-border)',
        paddingTop: '16px',
        marginTop: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '0 8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bv-orange-soft)',
            color: 'var(--bv-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '13px',
            flexShrink: 0,
          }}>
            {(user?.firstName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--bv-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.email?.split('@')[0] || 'User')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--bv-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isAdmin ? 'Admin' : 'Investor'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--bv-text-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            borderRadius: '6px',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bv-hover)'; e.currentTarget.style.color = 'var(--bv-text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bv-text-muted)'; }}
        >
          <User size={16} strokeWidth={1.5} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
