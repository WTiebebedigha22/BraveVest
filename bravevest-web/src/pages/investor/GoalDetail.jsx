import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { goalsApi } from '@/api/goals';
import { useCurrency } from '@/context/CurrencyContext';

export default function GoalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { format } = useCurrency();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    goalsApi.get(id).then(setGoal).catch(() => nav('/goals')).finally(() => setLoading(false));
  }, [id, nav]);

  async function remove() {
    if (!confirm('Delete this goal?')) return;
    try { await goalsApi.remove(id); nav('/goals'); } catch { alert('Delete failed'); }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>;
  if (!goal) return null;

  const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
  const remaining = Math.max(0, Number(goal.targetAmount || 0) - Number(goal.currentAmount || 0));

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container container--narrow">
        <Link to="/goals" style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Back to goals
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>{goal.name}</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>
              Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : '—'}
            </p>
          </div>
          <button onClick={remove} className="btn btn--ghost" style={{ color: 'var(--bybit-red)' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>

        <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div className="data-label">Saved</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px' }}>{format(goal.currentAmount || 0)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="data-label">Target</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px', color: 'var(--bybit-orange)' }}>{format(goal.targetAmount || 0)}</div>
            </div>
          </div>
          <div style={{ height: '10px', background: 'var(--bybit-surface-2)', borderRadius: '5px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: pct + '%', height: '100%', background: 'var(--bybit-orange)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--bybit-text-muted)' }}>
            <span>{pct}% complete</span>
            <span>{format(remaining)} remaining</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Status</h3>
          <p style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', lineHeight: '1.6' }}>
            {goal.status === 'ACHIEVED' ? 'Goal achieved. Congratulations!' :
             goal.status === 'ABANDONED' ? 'This goal was abandoned.' :
             'This goal is active. Contributions are tracked automatically from your investments.'}
          </p>
        </div>
      </div>
    </div>
  );
}
