import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.css';

const investorGroups = [
  { label: 'Invest', links: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/investments', label: 'My Investments' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/wallet', label: 'Wallet' },
    { to: '/goals', label: 'Goals' },
  ]},
  { label: 'Grow', links: [
    { to: '/groups', label: 'Group Savings' },
    { to: '/referral', label: 'Referrals' },
    { to: '/gifting', label: 'Gifting' },
  ]},
  { label: 'Account', links: [
    { to: '/year-in-review', label: 'Year in Review' },
    { to: '/profile', label: 'Profile' },
  ]},
];

const adminGroups = [
  { label: 'Overview', links: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/reports', label: 'Reports' },
  ]},
  { label: 'Operations', links: [
    { to: '/admin/investors', label: 'Investors' },
    { to: '/admin/kyc', label: 'KYC Review' },
    { to: '/admin/projects', label: 'Projects' },
  ]},
  { label: 'Finance', links: [
    { to: '/admin/investments', label: 'Investments' },
    { to: '/admin/transactions', label: 'Transactions' },
  ]},
  { label: 'Content', links: [
    { to: '/admin/insights', label: 'Insights' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const groups = user?.role === 'ADMIN' ? adminGroups : investorGroups;

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar__brand">
        <span className="sidebar__mark" />
        BraveVest
      </Link>
      <div className="sidebar__scroll">
        {groups.map((group) => (
          <div key={group.label} className="sidebar__group">
            <div className="sidebar__eyebrow">{group.label}</div>
            <nav>
              {group.links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === '/admin' || l.to === '/dashboard'} className={({ isActive }) => 'sidebar__link ' + (isActive ? 'is-active' : '')}>{l.label}</NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div className="sidebar__bottom">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{(user?.firstName || 'B')[0]}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.firstName} {user?.lastName}</div>
            <div className="sidebar__user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}
