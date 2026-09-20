import Card from '@/components/shared/Card';
import Currency from '@/components/shared/Currency';
import './StatCard.css';

export default function StatCard({ label, value, currency, accent, hint }) {
  return (
    <Card className={`stat ${accent ? `stat--${accent}` : ''}`}>
      <div className="stat__label">{label}</div>
      <div className="stat__value">{currency ? <Currency value={value} /> : value}</div>
      {hint && <div className="stat__hint">{hint}</div>}
    </Card>
  );
}
