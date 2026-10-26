import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/api/client';

export const CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira', locale: 'en-NG', decimals: 0, fallbackRate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', locale: 'en-US', decimals: 2, fallbackRate: 1 / 1550 },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', locale: 'en-GB', decimals: 2, fallbackRate: 1 / 1970 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', locale: 'de-DE', decimals: 2, fallbackRate: 1 / 1680 },
  ZAR: { code: 'ZAR', symbol: 'R', label: 'South African Rand', locale: 'en-ZA', decimals: 2, fallbackRate: 1 / 85 },
  KES: { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling', locale: 'en-KE', decimals: 2, fallbackRate: 1 / 12 },
  GHS: { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi', locale: 'en-GH', decimals: 2, fallbackRate: 1 / 105 },
};

const STORAGE_KEY = 'bv.currency';
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => {
    if (typeof window === 'undefined') return 'NGN';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && CURRENCIES[stored] ? stored : 'NGN';
  });
  const [rates, setRates] = useState({});

  // Fetch live rates from the backend
  useEffect(() => {
    let alive = true;
    api.get('/currency/rates')
      .then((r) => {
        if (!alive) return;
        const payload = r.data?.data ?? r.data;
        if (payload?.rates) setRates(payload.rates);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const currencyInfo = CURRENCIES[code] ?? CURRENCIES.NGN;

  const setCurrency = (next) => {
    if (!CURRENCIES[next]) return;
    setCode(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
  };

  const convert = (ngnAmount) => {
    const n = Number(ngnAmount) || 0;
    if (code === 'NGN') return n;
    const rate = rates[code] ?? currencyInfo.fallbackRate ?? 1;
    return n * rate;
  };

  const format = (ngnAmount, opts = {}) => {
    const value = convert(ngnAmount);
    const { compact = false, decimals, showCode = false } = opts;
    const dp = decimals ?? currencyInfo.decimals;
    try {
      if (showCode) {
        return `${value.toLocaleString(currencyInfo.locale, {
          minimumFractionDigits: dp,
          maximumFractionDigits: dp,
          notation: compact ? 'compact' : 'standard',
        })} ${code}`;
      }
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
        notation: compact ? 'compact' : 'standard',
      }).format(value);
    } catch {
      return `${currencyInfo.symbol}${value.toLocaleString(undefined, { maximumFractionDigits: dp })}`;
    }
  };

  // Fixed: Defined inside the provider so it can access 'format'
  const formatCompact = (ngnAmount) => format(ngnAmount, { compact: true });

  const value = useMemo(() => ({
    currency: code,                // string: 'NGN'
    currencyInfo,                  // object: { code, symbol, label, locale, decimals }
    currencies: Object.values(CURRENCIES),
    setCurrency,
    convert,
    format,
    formatCompact,
    rates,                         // object: { NGN: 1, USD: 0.000645, ... }
  }), [code, currencyInfo, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}