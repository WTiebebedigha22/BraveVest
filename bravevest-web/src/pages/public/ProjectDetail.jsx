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
    return <PageShell theme='dark'><div style={{ padding: 96, display: 'flex', gap: 12, color: 'var(--text-muted)' }}><Loader2 size={20} /> Loading project…</div></PageShell>;
  }
  if (error || !project) {
    return (
      <PageShell theme='dark'>
        <div style={{ padding: '48px 20px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load project</div>
              <div style={{ fontSize: 13 }}>{error || 'Project not found.'}</div>
              <Link to='/marketplace' style={{ display: 'inline-block', marginTop: 12, color: '#F6465D', fontWeight: 600, fontSize: 13 }}>← Back to marketplace</Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell theme='dark' ticker>
      <section style={{ padding: '24px 20px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link to='/marketplace' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to marketplace
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }} className='project-detail-grid'>
            <style>{'@media (min-width: 900px) { .project-detail-grid { grid-template-columns: minmax(0, 1fr) 380px !important; } }'}</style>
            <main>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bv-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{project.category || 'Investment'}</div>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>{project.title || project.name}</h1>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{project.summary || project.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Percent size={14} /> Annual Yield</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#0ECB81' }}>{annualRate}%</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Calendar size={14} /> Tenor</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{tenor} mo</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Shield size={14} /> Risk</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B' }}>{risk}</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}><Wallet size={14} /> Min</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{format(minAmount)}</div>
                </div>
              </div>
              {target > 0 && (
                <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Funding progress</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{funded}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-soft)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: funded + '%', background: 'var(--bv-accent)', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text)' }}>{format(raised)}</strong> raised of {format(target)} target</div>
                </div>
              )}
              <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Info size={16} color='var(--text-muted)' />
                  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>About this opportunity</h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{project.description}</p>
              </div>
              <div className='bv-card-lift' style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Info size={16} color='var(--text-muted)' />
                  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Risk disclosure</h2>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>All investments carry risk. Returns are projections, not guarantees. Your capital is at risk. Read the full disclosure before investing.</p>
              </div>
            </main>
            <aside>
              <div className='bv-card-lift' style={{ position: 'sticky', top: 88, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>Invest in this project</h2>
                {investErr && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.1)', borderRadius: 8, color: '#F6465D', fontSize: 13, marginBottom: 16 }}><AlertCircle size={16} /> {investErr}</div>}
                {investOk && <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(14,203,129,0.1)', borderRadius: 8, color: '#0ECB81', fontSize: 13, marginBottom: 16 }}><CheckCircle size={16} /> {investOk}</div>}
                <form onSubmit={invest}>
                  <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                    Investment amount (₦)
                    <input type='number' min={minAmount} step='1000' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(minAmount)} required style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 16, color: 'var(--text)', outline: 'none' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Minimum {format(minAmount)}</span>
                  </label>
                  {amountNum > 0 && (
                    <div style={{ padding: 16, background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>You invest</span>
                        <strong>{format(amountNum)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Projected earnings</span>
                        <strong style={{ color: '#0ECB81' }}>+{format(projectedEarnings)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 14 }}>
                        <span style={{ fontWeight: 600 }}>Total at maturity</span>
                        <strong>{format(projectedReturn)}</strong>
                      </div>
                    </div>
                  )}
                  <button type='submit' disabled={submitting} className='bv-pill bv-pill--primary' style={{ width: '100%', justifyContent: 'center' }}>
                    {submitting && <Loader2 size={16} />}
                    {submitting ? 'Placing…' : user ? 'Invest now' : 'Sign in to invest'}
                  </button>
                </form>
                <p style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
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
