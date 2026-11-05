export default function KycProgress({ current, total = 5 }) {
  return (
    <div className="kyc-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      <span className="kyc-progress-label">Step {current} of {total}</span>
      <ol className="kyc-progress-dots">
        {Array.from({ length: total }, (_, i) => i + 1).map(n => (
          <li key={n} className={`kyc-dot ${n < current ? 'done' : ''} ${n === current ? 'active' : ''}`}>
            {n}
          </li>
        ))}
      </ol>
    </div>
  );
}
