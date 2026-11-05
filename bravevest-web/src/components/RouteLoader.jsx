export default function RouteLoader() {
  return (
    <div className="route-loader" aria-busy="true" aria-live="polite" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <span className="sr-only">Loading…</span>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#0d6e4f', borderRadius: '50%', animation: 'bv-spin 0.8s linear infinite' }} />
      <style>{`@keyframes bv-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
