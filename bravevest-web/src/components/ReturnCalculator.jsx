import { useMemo, useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import './ReturnCalculator.css';

export default function ReturnCalculator({ project }) {
  const [principal, setPrincipal] = useState(project.minAmount);
  const [tenor, setTenor] = useState(project.defaultTenor || 12);

  const projected = useMemo(() => {
    const rate = (project.annualRate || 0) / 100;
    return principal * (1 + rate * (tenor / 12));
  }, [principal, tenor, project.annualRate]);

  const earnings = projected - principal;
  const savingsEquivalent = principal * 0.04 * (tenor / 12);

  const animatedProjected = useCountUp(projected);
  const animatedEarnings = useCountUp(earnings);

  const fmt = (n) => `₦${Math.round(n).toLocaleString('en-NG')}`;

  return (
    <div className="calculator">
      <div className="calc-inputs">
        <label>
          <span>You invest</span>
          <input
            type="range"
            min={project.minAmount}
            max={project.maxAmount}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
          />
          <strong>{fmt(principal)}</strong>
        </label>
        <label>
          <span>Tenor</span>
          <input
            type="range"
            min={3}
            max={36}
            step={3}
            value={tenor}
            onChange={(e) => setTenor(+e.target.value)}
          />
          <strong>{tenor} months</strong>
        </label>
      </div>

      <div className="calc-outputs" aria-live="polite">
        <div><span className="muted">You invest</span><strong>{fmt(principal)}</strong></div>
        <div><span className="muted">You earn</span><strong className="positive">{fmt(animatedEarnings)}</strong></div>
        <div><span className="muted">You receive</span><strong>{fmt(animatedProjected)}</strong></div>
      </div>

      <p className="comparison">
        A typical savings account would earn ~{fmt(savingsEquivalent)} over the same period.
      </p>
    </div>
  );
}
