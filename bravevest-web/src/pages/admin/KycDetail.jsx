import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function KycDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch(`/admin/kyc/${id}`, { );
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load KYC submission.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function act(action) {
    setError('');
    if (action === 'reject' && !reason.trim()) {
      return setError('Please provide a reason for rejection.');
    }
    setActing(action);
    try {
      const result = await apiFetch(`/admin/kyc/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });.catch(() => ({}));
        throw new Error(d?.message || 'Action failed.');
      }
      navigate('/admin/kyc', { replace: true });
    } catch (e) {
      setError(e?.message || 'Action failed.');
    } finally {
      setActing('');
    }
  }

  if (loading) return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading KYC…
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
    </PortalLayout>
  );
  if (error && !data) return <div role="alert" style={{ padding: 24, color: COLORS.negative, display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>;

  const k = data?.submission ?? data;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto', color: COLORS.text }}>
      <Link to="/admin/kyc" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLORS.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to KYC queue
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>{k?.name || 'KYC Submission'}</h1>

      {error && (
        <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <section style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 20 }}>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, margin: 0, fontSize: 14 }}>
          <dt style={{ color: COLORS.muted, fontWeight: 500 }}>Email</dt><dd style={{ margin: 0 }}>{k?.email}</dd>
          <dt style={{ color: COLORS.muted, fontWeight: 500 }}>ID type</dt><dd style={{ margin: 0 }}>{k?.idType || 'NIN'}</dd>
          <dt style={{ color: COLORS.muted, fontWeight: 500 }}>ID number</dt><dd style={{ margin: 0, fontFamily: 'monospace' }}>{k?.idNumber || '—'}</dd>
          <dt style={{ color: COLORS.muted, fontWeight: 500 }}>Submitted</dt><dd style={{ margin: 0 }}>{k?.submittedAt || '—'}</dd>
        </dl>
      </section>

      <section style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>Review decision</h2>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          Reason (required for rejection)
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Optional note (required if rejecting)…"
            style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => act('approve')} disabled={!!acting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: COLORS.positive, color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.7 : 1 }}>
            {acting === 'approve' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
            {acting === 'approve' ? 'Approving…' : 'Approve'}
          </button>
          <button type="button" onClick={() => act('reject')} disabled={!!acting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: COLORS.surface, color: COLORS.negative, border: `1px solid ${COLORS.negative}`, borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.7 : 1 }}>
            {acting === 'reject' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={16} />}
            {acting === 'reject' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      </section>
    </div>
  );
}
