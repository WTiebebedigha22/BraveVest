import { createContext, useContext, useEffect, useState } from 'react';

export const CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', label: 'Naira',  locale: 'en-NG', rate: 1,       decimals: 0 },
  ZAR: { code: 'ZAR', symbol: 'R', label: 'Rand',   locale: 'en-ZA', rate: 0.012,   decimals: 0 },
  USD: { code: 'USD', symbol: '$', label: 'Dollar', locale: 'en-US', rate: 0.00065, decimals: 0 },
  GBP: { code: 'GBP', symbol: '£', label: 'Pound',  locale: 'en-GB', rate: 0.00051, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro',   locale: 'de-DE', rate: 0.00060, decimals: 0 },
};

const STORAGE_KEY = 'bv_currency';
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || 'NGN' : 'NGN'));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.setAttribute('data-currency', code);
  }, [code]);

  const currency = CURRENCIES[code] || CURRENCIES.NGN;
  const convert = (ngn) => Number(ngn || 0) * currency.rate;

  const format = (ngn, opts = {}) => {
    const v = convert(ngn);
    const d = opts.decimals ?? currency.decimals;
    return currency.symbol + v.toLocaleString(currency.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  };

  const formatCompact = (ngn) => {
    const v = convert(ngn);
    const abs = Math.abs(v);
    const s = currency.symbol;
    if (abs >= 1_000_000_000) return s + (v / 1_000_000_000).toFixed(1) + 'B';
    if (abs >= 1_000_000) return s + (v / 1_000_000).toFixed(1) + 'M';
    if (abs >= 1_000) return s + (v / 1_000).toFixed(1) + 'K';
    return s + v.toLocaleString(currency.locale);
  };

  return (
    <CurrencyContext.Provider value={{
      code, setCode, currency, convert, format, formatCompact,
      symbol: currency.symbol,
      symbolCode: currency.symbol + ' ' + currency.code,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be inside CurrencyProvider');
  return ctx;
}
