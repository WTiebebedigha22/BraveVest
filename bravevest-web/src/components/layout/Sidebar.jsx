import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.css';

const investorLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/investments', label: 'My Investments' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/documents', label: 'Documents' },
  { to: '/profile', label: 'Profile' },
  { to: '/year-in-review', label: 'Year in Review' },
  { to: '/referral', label: 'Referrals' },
];
const adminLinks = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/investors', label: 'Investors' },
  { to: '/admin/kyc', label: 'KYC Review' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/investments', label: 'Investments' },
  { to: '/admin/transactions', label: 'Transactions' },
  { to: '/admin/reports', label: 'Reports' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.role === 'ADMIN' ? adminLinks : investorLinks;

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar__brand">
        <span className="sidebar__mark" />
        BraveVest
      </Link>
      <div className="sidebar__section">
        <div className="sidebar__eyebrow">{user?.role === 'ADMIN' ? 'Admin' : 'Investor'}</div>
        <nav>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar__bottom">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{(user?.firstName || 'B')[0]}</div>
          <div>
            <div className="sidebar__user-name">{user?.firstName} {user?.lastName}</div>
            <div className="sidebar__user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}
