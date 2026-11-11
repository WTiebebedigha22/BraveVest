import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

const COLORS = {
  bg: '#FAFAFA', text: 'var(--bv-text)', muted: 'var(--bv-text-muted)', border: 'var(--bv-border)',
};

const ITEMS = [
  { icon: Shield, label: 'Bravelion Holdings' },
  { icon: Lock, label: 'Paystack Secured' },
  { icon: FileText, label: 'SEC-aligned KYC' },
  { icon: CheckCircle, label: '0 Defaults Since 2023' },
];

export default function TrustStrip() {
  return (
    <section aria-label="Trust signals" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg }}>
      {ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: COLORS.muted, fontWeight: 500 }}>
          <Icon size={16} aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
