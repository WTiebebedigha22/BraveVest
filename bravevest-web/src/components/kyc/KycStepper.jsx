export default function KycStepper({ current = 1 }) {
  const steps = ['Personal', 'Identity', 'Address', 'Bank', 'Review'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: done ? 'var(--bv-success)' : active ? '#B3D941' : 'var(--bv-surface)',
              color: done || active ? 'var(--bv-surface)' : 'var(--bv-text-muted)',
              fontSize: 12, fontWeight: 700,
            }}>
              {done ? '✓' : n}
            </div>
            <span style={{
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? 'var(--bv-text)' : done ? 'var(--bv-success)' : 'var(--bv-text-muted)',
            }}>{label}</span>
            {i < steps.length - 1 && (
              <div style={{ width: 24, height: 1, backgroundColor: done ? 'var(--bv-success)' : 'var(--bv-border)', margin: '0 4px' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
