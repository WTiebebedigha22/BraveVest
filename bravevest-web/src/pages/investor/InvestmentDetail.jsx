import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, TrendingUp, Calendar, Wallet, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

export default function InvestmentDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/investments/${id}`);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load investment.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <PortalLayout theme='dark'>
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading investment…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  if (error || !data) {
    return (
      <PortalLayout theme='dark'>
        <div style={{ padding: 48, maxWidth: 480, margin: '0 auto' }}>
          <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Investment not found</div>
              <div style={{ fontSize: 13 }}>{error || 'This investment may have been removed.'}</div>
              <Link to='/investments' style={{ display: 'inline-block', marginTop: 12, color: 'var(--negative)', fontWeight: 600, fontSize: 13 }}>
                ← Back to investments
              </Link>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const inv = data;
  const project = inv.project || {};
  const amount = Number(inv.amount || 0);
  const rate = Number(project.expectedReturnPct || 0);
  const tenor = Number(project.tenorMonths || 12);
  const projectedReturn = amount * (1 + (rate / 100) * (tenor / 12));
  const projectedEarnings = projectedReturn - amount;
  const createdDate = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link to='/investments' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to investments
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                {project.category || 'Investment'}
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {project.title || project.name || 'Investment'}
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
                Invested on {createdDate}
              </p>
            </div>
            <span style={{ padding: '6px 14px', background: inv.status === 'ACTIVE' ? 'rgba(14,203,129,0.1)' : 'rgba(107,114,128,0.1)', color: inv.status === 'ACTIVE' ? 'var(--positive)' : 'var(--text-muted)', borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {inv.status || 'ACTIVE'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, margin: '32px 0' }}>
            <DetailCard icon={<Wallet size={16} />} label='Amount invested' value={format(amount)} />
            <DetailCard icon={<TrendingUp size={16} />} label='Annual yield' value={rate + '%'} accent />
            <DetailCard icon={<Calendar size={16} />} label='Tenor' value={tenor + ' months'} />
            <DetailCard icon={<FileText size={16} />} label='Projected return' value={format(projectedReturn)} />
          </div>

          <div style={{ padding: 28, background: 'linear-gradient(135deg, var(--surface) 0%, rgba(14,203,129,0.05) 100%)', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Projected earnings at maturity
            </div>
            <div style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 800, color: 'var(--positive)', letterSpacing: '-0.02em' }}>
              +{format(projectedEarnings)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
              Based on {rate}% annual yield over {tenor} months. Returns are projections, not guarantees.
            </div>
          </div>

          <div style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: 'var(--text)' }}>
              About the project
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              {project.description || 'No description available.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/investments/${id}/log`} className='bv-pill bv-pill--ghost'>
              <FileText size={14} /> View payout log
            </Link>
            <Link to={`/marketplace/${project.slug || ''}`} className='bv-pill bv-pill--ghost'>
              <TrendingUp size={14} /> View project page
            </Link>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}

function DetailCard({ icon, label, value, accent }) {
  return (
    <div style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent ? 'var(--positive)' : 'var(--text)' }}>
        {value}
      </div>
    </div>
  );
}
