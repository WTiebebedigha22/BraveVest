import { Link } from 'react-router-dom';
import { useState } from 'react';
import './RiskDisclosure.css';

const LEVELS = {
  low: { label: 'Low', color: 'var(--bv-success-text, #3a7d44)', bg: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))', bar: 33 },
  medium: { label: 'Medium', color: 'var(--bv-warning-text, var(--bv-warning-text))', bg: 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))', bar: 66 },
  high: { label: 'High', color: 'var(--bv-danger)', bg: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))', bar: 100 },
};

export default function RiskDisclosure({ level = 'medium' }) {
  const [open, setOpen] = useState(false);
  const cfg = LEVELS[level] || LEVELS.medium;

  return (
    <div className="risk" style={{ '--risk-bg': cfg.bg, '--risk-fg': cfg.color }}>
      <button className="risk__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="risk__head-left">
          <span className="risk__badge">Risk level: {cfg.label}</span>
          <span className="risk__head-text">
            You could lose your invested capital. Read the full disclosure.
          </span>
        </div>
        <span className={`risk__caret ${open ? 'is-open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="risk__body">
          <div className="risk__bar">
            <div className="risk__bar-fill" style={{ width: cfg.bar + '%' }} />
          </div>
          <p className="risk__p">
            All investments carry risk. Past performance does not guarantee future results.
            Projected returns are estimates based on the operator's plan and are not guaranteed.
          </p>
          <p className="risk__p">
            Before investing, review the project documentation, the use-of-funds statement,
            the repayment source, and the exit plan. Only invest what you can afford to lose.
          </p>
          <p className="risk__p">
            If a project defaults or is delayed, you may not recover your capital. Returns
            depend on the operator's execution and market conditions.
          </p>
          <div className="risk__links">
            <Link to="/risk-disclosure">Full risk disclosure →</Link>
            <Link to="/terms">Terms of service →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
