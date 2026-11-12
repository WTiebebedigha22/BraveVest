// Risk category mapping — letter grade → Low / Medium / High
export function riskCategory(level) {
  if (!level) return 'Medium';
  const l = String(level).toUpperCase();
  if (l.includes('AAA') || l.includes('AA') || l === 'A' || l === 'A+') return 'Low';
  if (l.includes('BBB') || l === 'BB' || l === 'B+' || l === 'B') return 'Medium';
  if (l === 'C' || l.includes('CCC') || l.includes('CC') || l === 'D' || l.includes('HIGH')) return 'High';
  if (l.includes('LOW')) return 'Low';
  if (l.includes('MEDIUM') || l.includes('MID')) return 'Medium';
  return 'Medium';
}

export function riskColor(level) {
  const cat = riskCategory(level);
  if (cat === 'Low') return {
    bg: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))',
    text: 'var(--bv-success)',
  };
  if (cat === 'High') return {
    bg: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))',
    text: 'var(--bv-danger)',
  };
  return {
    bg: 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))',
    text: 'var(--bv-warning)',
  };
}
