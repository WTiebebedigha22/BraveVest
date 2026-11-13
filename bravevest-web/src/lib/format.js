// Risk category mapping — letter grade → Low / Medium / High

// Risk category mapping — accepts both new ('Low'/'Medium'/'High')
// and legacy letter grades (A/AA/BBB/BB/B) for backward compat
export function riskCategory(level) {
  if (!level) return 'Medium';
  const l = String(level).trim().toLowerCase();
  if (l === 'low' || l === 'a' || l === 'aa') return 'Low';
  if (l === 'high' || l === 'bb' || l === 'b') return 'High';
  if (l === 'medium' || l === 'bbb') return 'Medium';
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
