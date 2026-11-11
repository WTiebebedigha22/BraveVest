import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Download, TrendingUp, Award, Wallet,
  Calendar, Loader2, AlertCircle, Share2, Copy, CheckCircle,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import PortalLayout from '@/components/layout/PortalLayout';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function YearInReview() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch('/investor/year-in-review?year=' + year);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load year in review.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [year]);

  async function exportCard() {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: 'var(--bv-bg)',
        scale: 2,
        useCORS: true,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bravevest-year-in-review-' + year + '.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      setError('Could not export. Make sure html2canvas is installed.');
    } finally {
      setExporting(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  if (loading) {
    return (
      <PortalLayout theme='dark'>
        <div style={{ padding: 96, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading your year in review…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PortalLayout>
    );
  }

  if (error && !data) {
    return (
      <PortalLayout theme='dark'>
        <div style={{ padding: 48, maxWidth: 480, margin: '0 auto' }}>
          <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12 }}>
            <AlertCircle size={20} /> {error}
          </div>
        </div>
      </PortalLayout>
    );
  }

  const isEmpty = !data.totalInvested && !data.totalReturns && data.investmentsCount === 0;
  const maxMonthly = Math.max(1, ...data.monthlyInvestments.map((m) => m.amount));

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Year in Review
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
                Your {year} portfolio summary, ready to share.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={copyLink}
                className='bv-pill bv-pill--ghost'
                style={{ padding: '10px 16px' }}
              >
                {copied ? <CheckCircle size={14} /> : <Share2 size={14} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={exportCard}
                disabled={exporting || isEmpty}
                className='bv-pill bv-pill--primary'
                style={{ padding: '10px 16px', opacity: exporting || isEmpty ? 0.6 : 1 }}
              >
                {exporting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
                {exporting ? 'Exporting…' : 'Download card'}
              </button>
            </div>
          </div>

          {error && (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12, marginBottom: 24 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div style={{ padding: 64, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
              <Sparkles size={48} color='var(--bv-accent)' style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
                Your story starts here
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15, maxWidth: 400, margin: '0 auto 24px' }}>
                No investments in {year} yet. Make your first investment to start building your Year in Review.
              </p>
              <Link to='/marketplace' className='bv-pill bv-pill--primary'>
                Browse opportunities
              </Link>
            </div>
          )}

          {/* Shareable card */}
          {!isEmpty && (
            <>
              <div
                ref={cardRef}
                style={{
                  padding: 'clamp(24px, 5vw, 48px)',
                  background: 'linear-gradient(135deg, var(--bv-bg) 0%, var(--bv-bg-elevated) 100%)',
                  borderRadius: 24,
                  border: '1px solid #262626',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: 32,
                }}
              >
                {/* Glow background */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(246,165,0,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bv-accent)', color: 'var(--bv-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>B</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bv-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BraveVest</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Year in Review</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, color: 'var(--bv-bg-elevated)', lineHeight: 1, letterSpacing: '-0.03em' }}>{year}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Your year</div>
                  </div>
                </div>

                {/* Name */}
                <div style={{ position: 'relative', marginBottom: 40 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>This year belongs to</div>
                  <div style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: 'var(--bv-bg-elevated)', letterSpacing: '-0.02em', fontFamily: 'Playfair Display, Georgia, serif' }}>
                    {user?.firstName || data.user?.firstName || 'Investor'} {user?.lastName || data.user?.lastName || ''}
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, marginBottom: 32 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Total invested</div>
                    <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'var(--bv-bg-elevated)', lineHeight: 1 }}>{format(data.totalInvested)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Returns earned</div>
                    <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#0ECB81', lineHeight: 1 }}>{format(data.totalReturns)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Investments</div>
                    <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'var(--bv-bg-elevated)', lineHeight: 1 }}>{data.investmentsCount}</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid #262626', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    bravevest.com
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--bv-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Bravelion Holdings
                  </div>
                </div>
              </div>

              {/* Best deal highlight */}
              {data.bestDeal && (
                <div style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Award size={20} color='var(--bv-accent)' />
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Your best performing deal</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>{data.bestDeal.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{data.bestDeal.category} · {data.bestDeal.yield}% annual yield</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0ECB81' }}>
                      {format(data.bestDeal.amount)}
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly breakdown */}
              <div style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Calendar size={20} color='var(--bv-accent)' />
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Investments by month</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, alignItems: 'end', height: 120 }}>
                  {data.monthlyInvestments.map((m) => {
                    const heightPct = (m.amount / maxMonthly) * 100;
                    return (
                      <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 4 }}>
                        <div style={{ width: '100%', height: (heightPct || 4) + '%', background: m.amount > 0 ? 'var(--bv-accent)' : 'var(--border)', borderRadius: 3, minHeight: 4, transition: 'height 0.3s' }} title={m.amount > 0 ? format(m.amount) : ''} />
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>{MONTH_NAMES[m.month - 1]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wallet activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Total deposits', value: format(data.totalDeposits), color: 'var(--positive)' },
                  { label: 'Total withdrawals', value: format(data.totalWithdrawals), color: 'var(--negative)' },
                  { label: 'Wallet volume', value: format(data.walletVolume), color: 'var(--text)' },
                  { label: 'Current balance', value: format(data.currentBalance), color: 'var(--accent)' },
                ].map((s) => (
                  <div key={s.label} style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </section>
    </PortalLayout>
  );
}
