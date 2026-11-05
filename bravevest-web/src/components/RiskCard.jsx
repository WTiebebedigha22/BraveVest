import './RiskCard.css';

export default function RiskCard({ project }) {
  const level = project.riskLevel ?? 3;
  const name = level <= 2 ? 'Low' : level <= 3 ? 'Medium' : 'High';
  const tone = level <= 2 ? 'low' : level <= 3 ? 'medium' : 'high';
  return (
    <div className="risk-card" aria-label="Risk profile">
      <p className="risk-label">RISK PROFILE</p>
      <div className="risk-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`bar ${i <= level ? 'filled' : ''} ${tone}`} />
        ))}
        <span className={`risk-name ${tone}`}>{name}</span>
      </div>
      <dl>
        <dt>Backed by</dt><dd>{project.backing || 'Registered property title'}</dd>
        <dt>Liquidity</dt><dd>Locked {project.tenor || 12} months</dd>
        <dt>Default history</dt><dd>0%</dd>
      </dl>
    </div>
  );
}
