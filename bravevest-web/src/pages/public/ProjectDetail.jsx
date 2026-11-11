import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, Shield, Calendar, Wallet, CheckCircle, Info, Percent } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import PageShell from '@/components/shared/PageShell';

export default function ProjectDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { format } = useCurrency();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [investErr, setInvestErr] = useState('');
  const [investOk, setInvestOk] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/projects/' + slug);
        if (!cancelled) setProject(data);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load project.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const minAmount = Number((project && project.minInvestment) || 5000);
  const target = Number((project && project.targetAmount) || 0);
  const raised = Number((project && project.raisedAmount) || 0);
  const funded = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const annualRate = Number((project && project.expectedReturnPct) || 0);
  const tenor = Number((project && project.tenorMonths) || 12);
  const risk = (project && project.riskLevel) || 'B';
  const amountNum = Number(amount) || 0;
  const projectedReturn = amountNum * (1 + (annualRate / 100) * (tenor / 12));
  const projectedEarnings = projectedReturn - amountNum;

  async function invest(e) {
    e.preventDefault();
    setInvestErr(''); setInvestOk('');
    if (!user) { nav('/login?redirect=/marketplace/' + slug); return; }
    if (amountNum < minAmount) return setInvestErr('Minimum investment is ' + format(minAmount) + '.');
    setSubmitting(true);
    try {
      await apiFetch('/investments', { method: 'POST', body: { projectId: project.id, amount: amountNum } });
      setInvestOk('Investment of ' + format(amountNum) + ' placed successfully.');
      setAmount('');
      const fresh = await apiFetch('/projects/' + slug).catch(() => null);
      if (fresh) setProject(fresh);
    } catch (err) {
      setInvestErr(err && err.message ? err.message : 'Could not place investment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div style={{ padding: 96, display: 'flex', gap: 12, color: 'var(--bv-text-muted)' }}>
          <Loader2 size={20} /> Loading project…
        </div>
      </PageShell>
    );
  }
  if (error || !project) {
    return (
      <PageShell>
        <div style={{ padding: '48px 20px' }}>
          <div style={{
            maxWidth: 480, margin: '0 auto', padding: 16,
            background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)',
            borderRadius: 12, color: 'var(--bv-danger)',
            display: 'flex', gap: 12,
          }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load project</div>
              <div style={{ fontSize: 13 }}>{error || 'Project not found.'}</div>
              <Link to='/marketplace' style={{ display: 'inline-block', marginTop: 12, color: 'var(--bv-danger)', fontWeight: 600, fontSize: 13 }}>← Back to marketplace</Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell ticker>
      <section style={{ padding: '24px 20px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link to='/marketplace' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--bv-text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to marketplace
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }} className='project-detail-grid'>
            <style>{'@media (min-width: 900px) { .project-detail-grid { grid-template-columns: minmax(0, 1fr) 380px !important; } }'}</style>
            <main>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bv-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{project.category || 'Investment'}</div>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2, color: 'var(--bv-text)' }}>{project.title || project.name}</h1>
                <p style={{ fontSize: 15, color: 'var(--bv-text-muted)', margin: 0, lineHeight: 1.6 }}>{project.summary || project.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bv-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Percent size={14} /> Annual Yield</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-success)' }}>{annualRate}%</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bv-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Calendar size={14} /> Tenor</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-text)' }}>{tenor} mo</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bv-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Shield size={14} /> Risk</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-warning)' }}>{risk}</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bv-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Wallet size={14} /> Min</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--bv-text)' }}>{format(minAmount)}</div>
                </div>
              </div>
              {target > 0 && (
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bv-text-muted)' }}>Funding progress</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--bv-text)' }}>{funded}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bv-surface)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: funded + '%', background: 'var(--bv-accent)', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>
                    <strong style={{ color: 'var(--bv-text)' }}>{format(raised)}</strong> raised of {format(target)} target
                  </div>
                </div>
              )}
              <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Info size={16} color='var(--bv-text-muted)' />
                  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--bv-text)' }}>About this opportunity</h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--bv-text-muted)', lineHeight: 1.7, margin: 0 }}>{project.description}</p>
              </div>
              <div className='bv-card-lift' style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Info size={16} color='var(--bv-text-muted)' />
                  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--bv-text)' }}>Risk disclosure</h2>
                </div>
                <p style={{ fontSize: 13, color: 'var(--bv-text-muted)', lineHeight: 1.6, margin: 0 }}>All investments carry risk. Returns are projections, not guarantees. Your capital is at risk. Read the full disclosure before investing.</p>
              </div>
            </main>
            <aside>
              <div className='bv-card-lift' style={{ position: 'sticky', top: 88, padding: 24, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: 'var(--bv-text)' }}>Invest in this project</h2>
                {investErr && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', borderRadius: 8, color: 'var(--bv-danger)', fontSize: 13, marginBottom: 16 }}><AlertCircle size={16} /> {investErr}</div>}
                {investOk && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'color-mix(in srgb, var(--bv-success) 10%, transparent)', borderRadius: 8, color: 'var(--bv-success)', fontSize: 13, marginBottom: 16 }}><CheckCircle size={16} /> {investOk}</div>}
                <form onSubmit={invest}>
                  <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16, color: 'var(--bv-text)' }}>
                    Investment amount (₦)
                    <input type='number' min={minAmount} step='1000' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(minAmount)} required style={{ padding: '12px 14px', background: 'var(--bv-bg)', border: '1px solid var(--bv-border)', borderRadius: 8, fontSize: 16, color: 'var(--bv-text)', outline: 'none' }} />
                    <span style={{ fontSize: 12, color: 'var(--bv-text-muted)', fontWeight: 400 }}>Minimum {format(minAmount)}</span>
                  </label>
                  {amountNum > 0 && (
                    <div style={{ padding: 16, background: 'var(--bv-surface)', border: '1px solid var(--bv-border)', borderRadius: 8, marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--bv-text)' }}>
                        <span style={{ color: 'var(--bv-text-muted)' }}>You invest</span>
                        <strong>{format(amountNum)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                        <span style={{ color: 'var(--bv-text-muted)' }}>Projected earnings</span>
                        <strong style={{ color: 'var(--bv-success)' }}>+{format(projectedEarnings)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--bv-border)', fontSize: 14, color: 'var(--bv-text)' }}>
                        <span style={{ fontWeight: 600 }}>Total at maturity</span>
                        <strong>{format(projectedReturn)}</strong>
                      </div>
                    </div>
                  )}
                  <button
  type="submit"
  disabled={submitting}
  style={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'var(--bv-accent)',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    cursor: submitting ? 'not-allowed' : 'pointer',
    opacity: submitting ? 0.6 : 1,
    transition: 'background 0.2s ease',
    fontFamily: 'inherit',
  }}
  onMouseEnter={(e) => {
    if (!submitting) e.currentTarget.style.background = 'var(--bv-accent-hover)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'var(--bv-accent)';
  }}
>
  {submitting && <Loader2 size={16} className="animate-spin" />}
  {submitting ? 'Placing…' : user ? 'Invest now' : 'Sign in to invest'}
</button>
                </form>
                <p style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--bv-border)', fontSize: 12, color: 'var(--bv-text-muted)', lineHeight: 1.6 }}>
                  Projected returns: {format(projectedEarnings)} over {tenor} months. Not a guarantee. Capital at risk.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}