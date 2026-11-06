import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertCircle, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

const STATUS = {
  PENDING_REVIEW: { label: 'Pending review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', Icon: Clock },
  OPEN: { label: 'Approved — live on marketplace', color: '#0ECB81', bg: 'rgba(14,203,129,0.1)', Icon: CheckCircle },
  CLOSED: { label: 'Rejected or closed', color: '#F6465D', bg: 'rgba(246,70,93,0.1)', Icon: XCircle },
  DRAFT: { label: 'Draft', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', Icon: Clock },
  FUNDED: { label: 'Funded', color: '#F6A500', bg: 'rgba(246,165,0,0.1)', Icon: CheckCircle },
};

export default function MySubmissions() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/projects/mine');
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load submissions.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
                My submissions
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 15 }}>
                Track status of opportunities you have submitted.
              </p>
            </div>
            <Link to='/opportunities/new' className='bv-pill bv-pill--primary'>
              <Plus size={16} /> New submission
            </Link>
          </div>

          {loading && <div style={{ padding: 48, color: 'var(--text-muted)' }}><Loader2 size={20} /> Loading…</div>}
          {error && <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D' }}>{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>No submissions yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
                Submit your first opportunity for admin review.
              </p>
              <Link to='/opportunities/new' className='bv-pill bv-pill--primary'>
                <Plus size={16} /> Submit an opportunity
              </Link>
            </div>
          )}
          {!loading && items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((p) => {
                const st = STATUS[p.status] || STATUS.PENDING_REVIEW;
                const Icon = st.Icon;
                return (
                  <div key={p.id} className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>{p.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>{p.summary}</p>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {p.category} · Target {format(p.targetAmount)} · {p.expectedReturnPct}% · {p.tenorMonths}mo
                        </div>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: st.bg, color: st.color, borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        <Icon size={14} />
                        {st.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
