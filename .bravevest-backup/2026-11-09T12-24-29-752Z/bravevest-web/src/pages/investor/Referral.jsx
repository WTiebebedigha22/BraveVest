import { useEffect, useMemo, useState } from 'react';
import { Copy, CheckCircle, Gift, AlertCircle, Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};
const PAGE_SIZE = 10;

export default function Referral() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState({ code: '', referrals: [], totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [page, setPage] = useState(1);

  const referralLink = `${window.location.origin}/#/register?ref=${data.code || user?.id || ''}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch('/referrals/me');
        if (!cancelled) setData({
          code: json.code || user?.referralCode || '',
          referrals: Array.isArray(json.referrals) ? json.referrals : [],
          totalEarned: json.totalEarned ?? 0,
        });
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load referral data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.referralCode]);

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setError('Could not copy — please copy manually.');
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.referrals.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = data.referrals.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading referrals…
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </PortalLayout>
  );
  }
  if (error) {
    return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Referral</h1>
      <p style={{ margin: '0 0 24px', color: COLORS.muted, fontSize: 14 }}>
        Earn 1% of every investment made by people you refer.
      </p>

      <section aria-label="Referral code" style={{ padding: 24, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.muted, fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
          <Gift size={16} />
          Your referral code
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <code style={{ padding: '10px 16px', background: '#FAFAFA', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>
            {data.code || '—'}
          </code>
          {data.code && (
            <button type="button" onClick={() => copy(data.code, 'code')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: copied === 'code' ? COLORS.positive : COLORS.text }}>
              {copied === 'code' ? <><CheckCircle size={14} /> Copied</> : <><Copy size={14} /> Copy code</>}
            </button>
          )}
        </div>

        <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.muted, marginBottom: 6 }}>Or share this link</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" value={referralLink} readOnly
            style={{ flex: '1 1 280px', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, background: '#FAFAFA', color: COLORS.muted }} />
          <button type="button" onClick={() => copy(referralLink, 'link')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: COLORS.accent, color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            {copied === 'link' ? <><CheckCircle size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}
          </button>
        </div>
      </section>

      <section aria-label="Referral stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 6 }}>Total earned</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.positive }}>{format(data.totalEarned)}</div>
        </div>
        <div style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 6 }}>
            <Users size={14} /> People referred
          </div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{data.referrals.length}</div>
        </div>
      </section>

      <section aria-label="Referred investors">
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>Your referrals</h2>
        {pageItems.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
            No referrals yet. Share your code to start earning.
          </div>
        ) : (
          <>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['Name', 'Joined', 'You earned'].map((h) => (
                      <th key={h} style={{ textAlign: h === 'You earned' ? 'right' : 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((r) => (
                    <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '14px 16px', color: COLORS.muted, fontSize: 13 }}>{r.joinedAt}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: COLORS.positive }}>{format(r.earned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} aria-label="Previous page"
                  style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage <= 1 ? 'not-allowed' : 'pointer', opacity: safePage <= 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 13, color: COLORS.muted }}>Page {safePage} of {totalPages}</span>
                <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} aria-label="Next page"
                  style={{ padding: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: safePage >= totalPages ? 'not-allowed' : 'pointer', opacity: safePage >= totalPages ? 0.4 : 1 }}>
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
