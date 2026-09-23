import { useCurrency } from '@/context/CurrencyContext';
import './TopUpPills.css';

/**
 * Smart top-up amount suggestions based on the user's typical investment size.
 * Shows 3 pills that pre-fill an amount. Reduces decision fatigue.
 */
export default function TopUpPills({ average = 100000, onSelect }) {
  const { format } = useCurrency();

  // Generate 3 amounts around the user's average
  const amounts = [
    Math.round(average * 0.5),
    average,
    Math.round(average * 2),
  ].map((a) => Math.round(a / 1000) * 1000); // round to nearest ₦1,000

  return (
    <div className="topup">
      <div className="topup__label">Quick amounts</div>
      <div className="topup__pills">
        {amounts.map((a) => (
          <button key={a} className="topup__pill" onClick={() => onSelect?.(a)}>
            {format(a)}
          </button>
        ))}
      </div>
    </div>
  );
}
