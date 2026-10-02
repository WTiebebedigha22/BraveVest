const RATES = {
  NGN: { symbol: '₦', locale: 'en-NG', rate: 1 },
  ZAR: { symbol: 'R', locale: 'en-ZA', rate: 0.012 },
  USD: { symbol: '$', locale: 'en-US', rate: 0.00065 },
  GBP: { symbol: '£', locale: 'en-GB', rate: 0.00051 },
  EUR: { symbol: '€', locale: 'de-DE', rate: 0.00060 },
};

export function formatCurrency(amount, code = 'NGN', opts = {}) {
  const cfg = RATES[code] || RATES.NGN;
  const value = Number(amount || 0) * cfg.rate;
  if (opts.compact) {
    const abs = Math.abs(value);
    if (abs >= 1e9) return cfg.symbol + (value / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return cfg.symbol + (value / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return cfg.symbol + (value / 1e3).toFixed(1) + 'K';
  }
  return cfg.symbol + value.toLocaleString(cfg.locale, { maximumFractionDigits: opts.decimals ?? 0 });
}

export function formatNaira(v, opts = {}) { return formatCurrency(v, 'NGN', opts); }
export function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }
export function formatPct(v) { return Number(v || 0).toFixed(1) + '%'; }
export { RATES };
