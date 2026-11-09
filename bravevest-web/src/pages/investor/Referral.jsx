import { useEffect, useState } from 'react';
import { Copy, CheckCircle2, Gift, AlertCircle, Loader2, Users, TrendingUp } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

export default function Referral() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState({ code: '', referrals: [], totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await apiFetch('/referrals/me');
        if (!cancelled) setData({
          code: json.code || (user && user.referralCode) || '',
          referrals: Array.isArray(json.referrals) ? json.referrals : [],
          totalEarned: json.totalEarned || 0,
        });
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load referral data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch (e) {
      setError('Could not copy — please copy manually.');
    }
  }

  const link = (typeof window !== 'undefined' ? window.location.origin : '') + '/#/register?ref=' + (data.code || (user && user.id) || '');

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Referral program
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
              Earn 1% of every investment made by people you refer.
            </p>
          </div>

          {error && (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12, marginBottom: 24 }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Loading referral data…
              <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            </div>
          ) : (
            <>
              {/* Code card */}
              <div className='bv-card-lift bv-fade-up' style={{ padding: 28, background: 'linear-gradient(135deg, var(--surface) 0%, rgba(246,165,0,0.05) 100%)', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
                  <Gift size={16} color='#F6A500' />
                  Your referral code
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                  <code style={{ padding: '12px 20px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 20, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text)' }}>
                    {data.code || '—'}
                  </code>
                  {data.code && (
                    <button onClick={() => copy(data.code, 'code')} className='bv-pill bv-pill--ghost'>
                      {copied === 'code' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      {copied === 'code' ? 'Copied!' : 'Copy code'}
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>Or share this link</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type='text' value={link} readOnly style={{ flex: '1 1 280px', padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)', outline: 'none' }} />
                  <button onClick={() => copy(link, 'link')} className='bv-pill bv-pill--primary'>
                    {copied === 'link' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied === 'link' ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className='bv-grid-2 bv-fade-up' style={{ marginBottom: 24 }}>
                <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <TrendingUp size={18} color='#0ECB81' />
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total earned</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0ECB81' }}>{format(data.totalEarned)}</div>
                </div>
                <div className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <Users size={18} color='#F6A500' />
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>People referred</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{data.referrals.length}</div>
                </div>
              </div>

              {/* Referred list */}
              <div className='bv-fade-up'>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px', color: 'var(--text)' }}>Your referrals</h2>
                {data.referrals.length === 0 ? (
                  <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text-muted)', fontSize: 14 }}>
                    No referrals yet. Share your code to start earning.
                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr>
                          {['Name', 'Joined', 'You earned'].map((h) => (
                            <th key={h} style={{ textAlign: h === 'You earned' ? 'right' : 'left', padding: '14px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.referrals.map((r) => (
                          <tr key={r.id} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '16px 20px', fontWeight: 500 }}>{r.name}</td>
                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: 13 }}>{r.joinedAt}</td>
                            <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#0ECB81' }}>{format(r.earned)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
