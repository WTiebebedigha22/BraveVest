import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dash-page">
      {/* Header row */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Welcome back, Investor</p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="dash-card dash-card--hero">
        <div className="dash-card__head">
          <span className="dash-card__label">Total Portfolio</span>
          <span className="dash-badge dash-badge--up">
            <ArrowUpRight size={12} /> 12.4%
          </span>
        </div>
        <h2 className="dash-amount">₦0.00</h2>
        <p className="dash-card__foot">vs previous period</p>
      </div>

      {/* Stats row */}
      <div className="dash-grid">
        <div className="dash-card">
          <span className="dash-card__label">Total Invested</span>
          <h3 className="dash-amount-sm">₦0.00</h3>
        </div>
        <div className="dash-card">
          <span className="dash-card__label">Total Returns</span>
          <h3 className="dash-amount-sm dash-text-green">₦0.00</h3>
        </div>
      </div>

      {/* Activity list */}
      <div className="dash-card dash-card--list">
        <div className="dash-list-head">
          <h3 className="dash-list-title">Recent Activity</h3>
        </div>
        
        <div className="dash-empty">
          <p>You haven't committed to anything yet.</p>
          <Link to="/marketplace" className="btn btn--primary btn--sm">Browse opportunities</Link>
        </div>
      </div>

      {/* Floating action button (mobile) */}
      <button className="dash-fab">
        <Plus size={24} />
      </button>
    </div>
  );
}
