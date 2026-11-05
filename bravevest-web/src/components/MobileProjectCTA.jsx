import './MobileProjectCTA.css';

export default function MobileProjectCTA({ minAmount, onInvest }) {
  return (
    <div className="project-cta-mobile">
      <span className="min-amount">Min ₦{(minAmount ?? 5000).toLocaleString('en-NG')}</span>
      <button onClick={onInvest}>Invest →</button>
    </div>
  );
}
