import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Calculator } from 'lucide-react';
import { projectsApi } from '@/api/projects';
import { investmentsApi, paymentsApi } from '@/api/investments';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';

export default function ProjectDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { format } = useCurrency();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvest, setShowInvest] = useState(false);
  const [amount, setAmount] = useState('');
  const [riskAck, setRiskAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    projectsApi.get(slug)
      .then(r => setProject(r.data?.data || r.data || r))
      .catch(() => nav('/marketplace'))
      .finally(() => setLoading(false));
  }, [slug, nav]);

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>;
  if (!project) return null;

  const min = Number(project.minInvestment || project.minimumAmount || 0);
  const amountNum = Number(amount) || 0;
  const expectedReturn = amountNum * (Number(project.expectedReturnPct || project.targetReturn || 0) / 100);
  const totalReturn = amountNum + expectedReturn;

  async function submit() {
    if (!user) { nav('/login'); return; }
    if (amountNum < min) { setError('Minimum investment is ' + format(min)); return; }
    if (!riskAck) { setError('You must acknowledge the risk disclosure'); return; }
    setSubmitting(true);
    setError('');
    try {
      const investment = await investmentsApi.create({
        projectId: project.id,
        amount: amountNum,
      });
      const payment = await paymentsApi.initialize({
        amount: amountNum,
        purpose: 'investment',
        investmentId: investment.id || investment.investmentId,
        callbackUrl: window.location.origin + '/#/payment/callback',
      });
      const url = payment.authorization_url || payment.authorizationUrl;
      if (url) {
        window.location.href = url;
      } else {
        setError('Payment initialization failed');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Could not create investment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: 'var(--bybit-black)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px' }}>
        <Link to="/marketplace" style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Back to markets
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main content */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="pill pill--orange" style={{ marginBottom: '12px' }}>{project.category}</span>
              <h1 style={{ margin: '12px 0', fontSize: '28px' }}>{project.title}</h1>
              <p style={{ color: 'var(--bybit-text-muted)', fontSize: '14px' }}>{project.summary}</p>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '16px' }}>About this opportunity</h3>
              <p style={{ color: 'var(--bybit-text-muted)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                {project.description || 'Full details coming soon.'}
              </p>
            </div>

            <div className="card">
              <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '12px' }}>Risk Disclosure</h3>
              <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                This is a private credit investment. Your capital is at risk. Past performance does not guarantee future returns.
                Read the full <Link to="/risk-disclosure" style={{ color: 'var(--bybit-orange)' }}>risk disclosure</Link> before investing.
              </p>
            </div>
          </div>

          {/* Investment card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div className="data-label">Target Return</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--bybit-orange)', marginTop: '4px' }}>
                  {Number(project.expectedReturnPct || project.targetReturn || 0).toFixed(1)}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>per annum</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--bybit-border)', marginBottom: '16px' }}>
                <div>
                  <div className="data-label">Minimum</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{format(min)}</div>
                </div>
                <div>
                  <div className="data-label">Tenor</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{project.tenorMonths || project.durationMonths}mo</div>
                </div>
                <div>
                  <div className="data-label">Target</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{format(project.targetAmount)}</div>
                </div>
                <div>
                  <div className="data-label">Funded</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
                    {Math.round((Number(project.raisedAmount || 0) / Number(project.targetAmount || 1)) * 100)}%
                  </div>
                </div>
              </div>

              <button onClick={() => setShowInvest(true)} className="btn btn--primary" style={{ width: '100%' }}>
                Invest Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invest modal */}
      {showInvest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>Invest in {project.title}</h2>
            <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              Minimum investment: {format(min)}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={String(min)}
                style={{ fontSize: '24px', fontWeight: '600' }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {[min, min * 2, min * 5, min * 10].map(v => (
                  <button key={v} type="button" onClick={() => setAmount(String(v))} className="pill" style={{ cursor: 'pointer', background: 'transparent' }}>
                    {format(v)}
                  </button>
                ))}
              </div>
            </div>

            {amountNum > 0 && (
              <div className="card" style={{ background: 'var(--bybit-surface-2)', marginBottom: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--bybit-text-muted)' }}>Expected Return</span>
                  <span style={{ color: 'var(--bybit-green)' }}>{format(expectedReturn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: '1px solid var(--bybit-border)' }}>
                  <span style={{ color: 'var(--bybit-text-muted)' }}>Total at Maturity</span>
                  <span style={{ fontWeight: '600' }}>{format(totalReturn)}</span>
                </div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--bybit-text-muted)', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" checked={riskAck} onChange={(e) => setRiskAck(e.target.checked)} style={{ marginTop: '2px', width: 'auto' }} />
              <span>I acknowledge that this is a private credit investment and my capital is at risk.</span>
            </label>

            {error && <div style={{ color: 'var(--bybit-red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowInvest(false); setError(''); }} className="btn btn--outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={submit} disabled={submitting || !riskAck || amountNum < min} className="btn btn--primary" style={{ flex: 1 }}>
                {submitting ? 'Processing…' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
