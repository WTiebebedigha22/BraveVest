import './StatsBar.css';
import { useCurrency } from '@/context/CurrencyContext';

const stats = [
  { value: '12,458+', label: 'Active Investors' },
  { value: '96+', label: 'Projects Funded' },
  { value: '18.6%', label: 'Average Returns' },
  { value: '{format(4.2)}B+', label: 'Total Invested' },
];

export default function StatsBar() {
  const { format } = useCurrency();

  return (
    <section className="stats">
      <div className="container stats__grid">
        {stats.map((s) => (
          <div key={s.label} className="stats__item">
            <div className="stats__value">{s.value}</div>
            <div className="stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
