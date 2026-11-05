import './DashboardHero.css';

export default function DashboardHero({ portfolio, stats, wallet }) {
  const positive = (portfolio?.monthlyDelta ?? 0) >= 0;
  const fmt = (n) => `₦${(n ?? 0).toLocaleString('en-NG')}`;
  return (
    <section className="dashboard-hero">
      <div className="hero-metric">
        <p className="label">Total Portfolio Value</p>
        <h1 className="amount">{fmt(portfolio?.totalValue)}</h1>
        <p className={`delta ${positive ? 'positive' : 'negative'}`}>
          {positive ? '+' : '−'}{fmt(Math.abs(portfolio?.monthlyDelta ?? 0))} this month
          {portfolio?.deltaPercent != null && ` · ${portfolio.deltaPercent.toFixed(1)}%`}
        </p>
      </div>
      <div className="hero-secondary">
        <Stat label="Active Investments" value={stats?.activeInvestments ?? 0} />
        <Stat label="Wallet Balance" value={fmt(wallet?.balance)} />
        <Stat label="Open Opportunities" value={stats?.openProjects ?? 0} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
