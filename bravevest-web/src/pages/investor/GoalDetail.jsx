import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Target, AlertCircle, Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: 'var(--bv-text-muted)',
  border: 'var(--bv-border)', accent: 'var(--bv-accent)', positive: '#0ECB81', negative: '#F6465D',
};

export default function GoalDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/goals/${id}`);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load goal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading goal…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  const goal = data?.goal ?? data;
  const contributions = data?.contributions ?? [];
  const progress = goal?.target > 0 ? Math.min(100, Math.round(((goal.saved || 0) / goal.target) * 100)) : 0;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 760, margin: '0 auto', color: COLORS.text }}>
      <Link to="/goals" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to goals
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Target size={24} color={COLORS.accent} /> {goal?.name || 'Goal'}
      </h1>

      <section aria-label="Goal progress" style={{ padding: 24, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{format(goal?.saved || 0)}</div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>of {format(goal?.target || 0)} target</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent }}>{progress}%</div>
        </div>
        <div style={{ height: 10, background: 'var(--bv-bg-elevated)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: COLORS.accent, transition: 'width 0.3s' }} />
        </div>
        {goal?.deadline && (
          <div style={{ marginTop: 12, fontSize: 13, color: COLORS.muted }}>Target date: {goal.deadline}</div>
        )}
      </section>

      <section aria-label="Contributions">
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Contributions</h2>
        {contributions.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
            No contributions yet.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contributions.map((c) => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.source || 'Deposit'}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{c.date}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.positive }}>+{format(c.amount)}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
