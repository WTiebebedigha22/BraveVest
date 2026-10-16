import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { api, endpoints } from '@/api/client';
import { Currency } from '@/theme/tokens';

const SUPPORTED: Currency[] = ['NGN', 'ZAR', 'USD', 'GBP', 'EUR'];

// Placeholder rates. Overwritten the moment /api/currency/rates responds.
const FALLBACK: Record<Currency, number> = {
  NGN: 1,
  ZAR: 0.012,
  USD: 0.00065,
  GBP: 0.00051,
  EUR: 0.00060,
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (ngn: number) => number;
  format: (ngn: number, opts?: { compact?: boolean; decimals?: number; showCode?: boolean }) => string;
  rates: Record<Currency, number>;
  ready: boolean;
};

const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('NGN');
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get(endpoints.currency.rates)
      .then((r) => {
        if (!alive) return;
        const payload = r.data?.data ?? r.data;
        if (payload?.rates) {
          const next = { ...FALLBACK };
          for (const k of SUPPORTED) {
            if (payload.rates[k] != null) next[k] = Number(payload.rates[k]);
          }
          setRates(next);
        }
      })
      .catch(() => {})
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    if (SUPPORTED.includes(c)) setCurrencyState(c);
  }, []);

  const convert = useCallback((ngn: number) => {
    const n = Number(ngn) || 0;
    if (currency === 'NGN') return n;
    return n * (rates[currency] || 1);
  }, [currency, rates]);

  const format = useCallback((ngn: number, opts: { compact?: boolean; decimals?: number; showCode?: boolean } = {}) => {
    const value = convert(ngn);
    const { compact = false, decimals = 0, showCode = false } = opts;
    try {
      const formatted = new Intl.NumberFormat(undefined, {
        style: showCode ? 'decimal' : 'currency',
        currency: showCode ? undefined : currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        notation: compact ? 'compact' : 'standard',
      }).format(value);
      return showCode ? `${formatted} ${currency}` : formatted;
    } catch {
      return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: decimals })}`;
    }
  }, [currency, convert]);

  const value = useMemo(() => ({
    currency, setCurrency, convert, format, rates, ready,
  }), [currency, setCurrency, convert, format, rates, ready]);

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency() {
  const v = useContext(CurrencyCtx);
  if (!v) throw new Error('useCurrency must be used within CurrencyProvider');
  return v;
}