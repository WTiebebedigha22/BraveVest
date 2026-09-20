export function formatNaira(value) {
  const n = Number(value || 0);
  return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatPct(v) {
  return Number(v || 0).toFixed(1) + '%';
}
