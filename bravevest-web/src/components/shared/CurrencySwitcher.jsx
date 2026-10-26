import { useCurrency, CURRENCIES } from '@/context/CurrencyContext';

export default function CurrencySwitcher() {
  const { currency, setCurrency, currencies } = useCurrency();

  // Use the context's currencies array if available, else fall back to the exported map
  const options = Array.isArray(currencies) && currencies.length > 0
    ? currencies
    : Object.values(CURRENCIES || {});

  const active = CURRENCIES?.[currency];

  return (
    <div className="currency-switcher">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="currency-switcher__select"
        aria-label="Change currency"
      >
        {options.map((c) => {
          const info = typeof c === 'string' ? CURRENCIES?.[c] : c;
          if (!info) return null;
          return (
            <option key={info.code} value={info.code}>
              {info.symbol} {info.code}
            </option>
          );
        })}
      </select>
    </div>
  );
}