import './TrustBadges.css';

/**
 * Row of trust signals — shown on project detail pages.
 * Communicates regulatory + security posture like PiggyVest does.
 */
export default function TrustBadges({ size = 'md' }) {
  const badges = [
    { label: 'SEC Compliant', icon: 'shield' },
    { label: 'NDIC Insured', icon: 'lock' },
    { label: 'Title Verified', icon: 'check' },
    { label: 'PCI-DSS Payments', icon: 'card' },
  ];

  return (
    <div className={'trust trust--' + size}>
      {badges.map((b) => (
        <div key={b.label} className="trust__badge">
          <TrustIcon name={b.icon} />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function TrustIcon({ name }) {
  const common = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'shield') return <svg {...common}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /></svg>;
  if (name === 'lock') return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>;
  if (name === 'check') return <svg {...common}><path d="M4 12l5 5L20 6" /></svg>;
  return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></svg>;
}
