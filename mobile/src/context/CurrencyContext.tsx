import React, { createContext, useContext, useState } from 'react';
import { Currency } from '@/theme/tokens';

const RATES: Record<Currency, number> = { NGN: 1, ZAR: 0.012, USD: 0.00065, GBP: 0.00051, EUR: 0.00060 };
type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; convert: (ngn: number) => number };
const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const convert = (ngn: number) => ngn * RATES[currency];
  return <CurrencyCtx.Provider value={{ currency, setCurrency, convert }}>{children}</CurrencyCtx.Provider>;
}
export function useCurrency() {
  const v = useContext(CurrencyCtx);
  if (!v) throw new Error('useCurrency must be used within CurrencyProvider');
  return v;
}
