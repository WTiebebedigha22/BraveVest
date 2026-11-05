import './TrustStrip.css';

const items = [
  { icon: '🛡️', label: 'Bravelion Holdings' },
  { icon: '🔒', label: 'Paystack Secured' },
  { icon: '📄', label: 'SEC-aligned KYC' },
  { icon: '✅', label: '0 Defaults Since 2023' },
];

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust signals">
      {items.map((it) => (
        <div key={it.label} className="trust-item">
          <span aria-hidden="true">{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </section>
  );
}
