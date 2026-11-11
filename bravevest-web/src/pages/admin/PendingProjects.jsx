import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';

export default function PendingProjects() {
  const { format } = useCurrency();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/projects/pending');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Could not load pending projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function act(id, action) {
    setActing(id + '-' + action);
    try {
      await apiFetch('/admin/projects/' + id + '/' + action, { method: 'POST', body: {} });
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e?.message || 'Action failed.');
    } finally {
      setActing('');
    }
  }

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Pending review
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: 15 }}>
            Opportunities submitted by investors. Approve to publish them on the marketplace, or reject.
          </p>

          {error && <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D', marginBottom: 24, display: 'flex', gap: 8 }}><AlertCircle size={18} /> {error}</div>}

          {loading ? (
            <div style={{ padding: 48, color: 'var(--text-muted)', display: 'flex', gap: 12 }}><Loader2 size={20} /> Loading pending projects…</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <CheckCircle size={40} color='#0ECB81' style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
                All caught up
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
                No projects waiting for review.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((p) => (
                <div key={p.id} className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>{p.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{p.summary}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, fontSize: 13 }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong>{p.category}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Target:</span> <strong>{format(p.targetAmount)}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Yield:</span> <strong>{p.expectedReturnPct}%</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Tenor:</span> <strong>{p.tenorMonths}mo</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Risk:</span> <strong>{p.riskLevel || '—'}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Submitted by:</span> <strong>{p.createdBy?.email || p.createdById?.slice(0, 8) || '—'}</strong></div>
                      </div>
                    </div>
                  </div>
                  <details style={{ marginBottom: 16 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                      View full description
                    </summary>
                    <div style={{ padding: 16, background: 'var(--bg-soft)', borderRadius: 8, marginTop: 12, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      {p.description}
                    </div>
                  </details>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => act(p.id, 'approve')}
                      disabled={acting === p.id + '-approve'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0ECB81', color: 'var(--bv-text)', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting === p.id + '-approve' ? 0.6 : 1 }}
                    >
                      {acting === p.id + '-approve' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                      Approve
                    </button>
                    <button
                      onClick={() => act(p.id, 'reject')}
                      disabled={acting === p.id + '-reject'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', border: '1px solid rgba(246,70,93,0.3)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting === p.id + '-reject' ? 0.6 : 1 }}
                    >
                      {acting === p.id + '-reject' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={16} />}
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </section>
    </PortalLayout>
  );
}
