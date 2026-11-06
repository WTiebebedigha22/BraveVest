export default function RouteLoader() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid var(--border, #262626)',
            borderTopColor: '#F6A500',
            animation: 'bv-spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: 14, color: 'var(--text-muted, #A1A1AA)' }}>Loading…</span>
      </div>
      <style>{'@keyframes bv-spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}