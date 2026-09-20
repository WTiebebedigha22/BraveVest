import { useCurrency } from '@/context/CurrencyContext';

export default function Currency({ value, compact = false, className = '' }) {
  const { format, formatCompact } = useCurrency();
  return <span className={className}>{compact ? formatCompact(value) : format(value)}</span>;
}
