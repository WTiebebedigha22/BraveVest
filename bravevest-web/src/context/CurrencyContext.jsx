import { createContext, useContext, useEffect, useState } from 'react';

/* ────────────────────────────────────────────────
   Currencies supported across the platform.
   Rates are illustrative for the marketing site —
   real conversion happens server-side at checkout.
   ──────────────────────────────────────────────── */

export const CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', label: 'Naira',   locale: 'en-NG', rate: 1,      decimals: 0 },
  ZAR: { code: 'ZAR', symbol: 'R',  label: 'Rand',    locale: 'en-ZA', rate: 0.012,  decimals: 0 },
  USD: { code: 'USD', symbol: '$',  label: 'Dollar',  locale: 'en-US', rate: 0.00065, decimals: 0 },
  GBP: { code: 'GBP', symbol: '£',  label: 'Pound',   locale: 'en-GB', rate: 0.00051, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€',  label: 'Euro',    locale: 'de-DE', rate: 0.00060, decimals: 0 },
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => localStorage.getItem('bv_currency') || 'NGN');

  useEffect(() => {
    localStorage.setItem('bv_currency', code);
  }, [code]);

  const currency = CURRENCIES[code] || CURRENCIES.NGN;

  const convert = (ngnAmount) => Number(ngnAmount || 0) * currency.rate;

  const format = (ngnAmount, opts = {}) => {
    const value = convert(ngnAmount);
    const decimals = opts.decimals ?? currency.decimals;
    const formatted = value.toLocaleString(currency.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${currency.symbol}${formatted}`;
  };

  /** Compact formatter for large numbers → "$78.2M", "₦4.2B" */
  const formatCompact = (ngnAmount) => {
    const value = convert(ngnAmount);
    const abs = Math.abs(value);
    const symbol = currency.symbol;
    if (abs >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000)     return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000)         return `${symbol}${(value / 1_000).toFixed(1)}K`;
    return `${symbol}${value.toLocaleString(currency.locale)}`;
  };

  return (
    <CurrencyContext.Provider value={{ code, setCode, currency, convert, format, formatCompact }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be inside CurrencyProvider');
  return ctx;
}
