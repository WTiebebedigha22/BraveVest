import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { investmentsApi } from '@/api/investments';
import { useCurrency } from '@/context/CurrencyContext';

export default function InvestmentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { format } = useCurrency();
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.get(id)
      .then(r => setInv(r))
      .catch(() => nav('/investments'))
      .finally(() => setLoading(false));
  }, [id, nav]);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>;
  if (!inv) return null;

  const amount = Number(inv.amount || 0);
  const current = Number(inv.currentValue || amount);
  const ret = amount > 0 ? ((current - amount) / amount) * 100 : 0;
  const schedule = inv.repaymentSchedule || inv.installments || [];

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <Link to="/investments" style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Back to investments
        </Link>

        <div style={{ marginBottom: '24px' }}>
          <span className={'pill ' + (inv.status === 'ACTIVE' ? 'pill--green' : '')} style={{ marginBottom: '12px' }}>{inv.status}</span>
          <h1 style={{ margin: '12px 0', fontSize: '24px' }}>{inv.project?.title || inv.projectTitle || 'Investment'}</h1>
        </div>

        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="card">
            <div className="data-label">Invested</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>{format(amount)}</div>
          </div>
          <div className="card">
            <div className="data-label">Current Value</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>{format(current)}</div>
          </div>
          <div className="card">
            <div className="data-label">Return</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: ret >= 0 ? 'var(--bybit-green)' : 'var(--bybit-red)' }}>
              {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bybit-border)' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Repayment Schedule</h3>
          </div>
          {schedule.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>No repayment schedule yet.</div>
          ) : (
            <table className="fin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Principal</th>
                  <th style={{ textAlign: 'right' }}>Interest</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((inst, i) => (
                  <tr key={inst.id || i}>
                    <td>{inst.number || i + 1}</td>
                    <td>{inst.dueDate ? new Date(inst.dueDate).toLocaleDateString() : '—'}</td>
                    <td><span className={'pill ' + (inst.status === 'PAID' ? 'pill--green' : inst.status === 'OVERDUE' ? 'pill--red' : '')}>{inst.status || 'UPCOMING'}</span></td>
                    <td className="num">{format(inst.principal || 0)}</td>
                    <td className="num">{format(inst.interest || 0)}</td>
                    <td className="num positive">{format(inst.total || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
