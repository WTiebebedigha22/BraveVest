import { Link } from 'react-router-dom';
import Currency from '@/components/shared/Currency';
import './GoalCard.css';

const GOAL_LABELS = {
  RENT: 'Rent', BUSINESS: 'Business', EDUCATION: 'Education',
  RETIREMENT: 'Retirement', PROPERTY: 'Property', EMERGENCY: 'Emergency', CUSTOM: 'Custom',
};

export default function GoalCard({ goal, onDelete }) {
  const target = Number(goal.targetAmount);
  const current = Number(goal.currentAmount);
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const monthsLeft = Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)));

  return (
    <div className="goalc">
      <div className="goalc__head">
        <div className="goalc__badge">{GOAL_LABELS[goal.type] || goal.type}</div>
        <button className="goalc__delete" onClick={() => onDelete?.(goal.id)} title="Delete goal">×</button>
      </div>
      <h3 className="goalc__title">{goal.name}</h3>
      <div className="goalc__amounts">
        <Currency value={current} />
        <span className="goalc__target">of <Currency value={target} /></span>
      </div>
      <div className="goalc__progress"><div className="goalc__progress-bar" style={{ width: pct + '%' }} /></div>
      <div className="goalc__meta">
        <span>{pct}% funded</span>
        <span>{monthsLeft} months left</span>
      </div>
      <Link to={'/goals/' + goal.id} className="goalc__cta">View recommendations →</Link>
    </div>
  );
}
