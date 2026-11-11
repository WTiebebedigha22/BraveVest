import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.kd { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-line:#E4E4E9; --by-text:var(--text-main); --by-mute:var(--bv-text-muted); --by-yellow:var(--bv-accent); --by-amber:#C27C00; --by-green:var(--bv-success); --by-red:#D6334B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; min-height:60vh; padding:40px 20px 96px; }
.kd * { box-sizing:border-box; }
.kd-inner { max-width:800px; margin:0 auto; }
.kd-back { display:inline-flex; align-items:center; gap:6px; color:var(--by-mute); text-decoration:none; font-size:14px; font-weight:600; margin-bottom:20px; }
.kd-back:hover { color:var(--by-amber); }
.kd h1 { font-size:clamp(26px,4vw,36px); font-weight:800; letter-spacing:-0.03em; margin:0 0 24px; }

.kd-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; margin-bottom:16px; }
.kd-card h2 { font-size:17px; font-weight:800; letter-spacing:-0.01em; margin:0 0 16px; }
.kd-dl { display:grid; grid-template-columns:auto 1fr; margin:0; font-size:15px; }
.kd-dl dt, .kd-dl dd { padding:14px 0; border-top:1px solid var(--by-line); margin:0; }
.kd-dl dt:first-of-type, .kd-dl dt:first-of-type + dd { border-top:0; padding-top:0; }
.kd-dl dt { color:var(--by-mute); font-weight:600; padding-right:32px; }
.kd-dl dd { font-weight:600; word-break:break-word; }
.kd-dl .mono { font-family:ui-monospace,Menlo,monospace; font-size:14px; }

.kd-lbl { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:20px; }
.kd-lbl textarea { width:100%; padding:12px 14px; background: var(--bv-bg-elevated); border:1px solid var(--by-line); border-radius:8px; font-family:inherit; font-size:15px; line-height:1.5; color:var(--by-text); resize:vertical; outline:none; transition:border-color .15s; }
.kd-lbl textarea::placeholder { color:#B4B4BE; }
.kd-lbl textarea:focus { border-color:var(--by-yellow); }
.kd-actions { display:flex; gap:12px; flex-wrap:wrap; }
.kd-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:48px; padding:0 24px; border-radius:8px; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s, border-color .15s; }
.kd-btn--ok { background:var(--by-green); color: var(--bv-bg-elevated); border:0; }
.kd-btn--ok:hover:not(:disabled) { background:#0B8A4F; }
.kd-btn--no { background: var(--bv-bg-elevated); color:var(--by-red); border:1px solid rgba(214,51,75,.4); }
.kd-btn--no:hover:not(:disabled) { background:rgba(214,51,75,.06); border-color:var(--by-red); }
.kd-btn:disabled { opacity:.6; cursor:not-allowed; }
.kd-btn:focus-visible, .kd-lbl textarea:focus-visible, .kd-back:focus-visible { outline:2px solid #121214; outline-offset:2px; }

.kd-err { display:flex; gap:8px; align-items:flex-start; padding:12px; background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); border-radius:8px; color:var(--by-red); font-size:13px; line-height:1.5; margin-bottom:20px; }
.kd-err svg { flex:none; margin-top:1px; }
.kd-state { padding:64px 0; display:flex; align-items:center; gap:12px; color:var(--by-mute); }
.kd-spin { animation:kd-spin 1s linear infinite; }
@keyframes kd-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .kd-spin { animation:none; } }
@media (max-width:480px) { .kd-card { padding:20px; } .kd-dl { grid-template-columns:1fr; } .kd-dl dt { border-top:1px solid var(--by-line); padding:14px 0 2px; } .kd-dl dd { border-top:0; padding:0 0 12px; } }
`;

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
        const result = await apiFetch(`/admin/kyc/${id}`);
        if (!cancelled) setData(result);
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
      // apiFetch throws on non-2xx, so no manual res.ok check is needed.
      await apiFetch(`/admin/kyc/${id}/${action}`, {
        method: 'POST',
        body: { reason: reason.trim() || undefined },
      });
      navigate('/admin/kyc', { replace: true });
    } catch (e) {
      setError(e?.message || 'Action failed.');
    } finally {
      setActing('');
    }
  }

  const shell = (children) => (
    <PortalLayout theme='light'>
      <style>{CSS}</style>
      <div className='kd'>
        <div className='kd-inner'>{children}</div>
      </div>
    </PortalLayout>
  );

  const back = (
    <Link to='/admin/kyc' className='kd-back'><ArrowLeft size={14} /> Back to KYC queue</Link>
  );

  if (loading) {
    return shell(
      <div className='kd-state' role='status'>
        <Loader2 size={20} className='kd-spin' /> Loading KYC…
      </div>
    );
  }

  if (error && !data) {
    return shell(
      <>
        {back}
        <div role='alert' className='kd-err'><AlertCircle size={16} /> {error}</div>
      </>
    );
  }

  const k = data?.submission ?? data;

  return shell(
    <>
      {back}
      <h1>{k?.name || 'KYC Submission'}</h1>

      {error && <div role='alert' className='kd-err'><AlertCircle size={16} /> {error}</div>}

      <section className='kd-card'>
        <dl className='kd-dl'>
          <dt>Email</dt><dd>{k?.email}</dd>
          <dt>ID type</dt><dd>{k?.idType || 'NIN'}</dd>
          <dt>ID number</dt><dd className='mono'>{k?.idNumber || '—'}</dd>
          <dt>Submitted</dt><dd>{k?.submittedAt || '—'}</dd>
        </dl>
      </section>

      <section className='kd-card'>
        <h2>Review decision</h2>
        <label className='kd-lbl'>
          Reason (required for rejection)
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder='Optional note (required if rejecting)…'
          />
        </label>
        <div className='kd-actions'>
          <button type='button' className='kd-btn kd-btn--ok' onClick={() => act('approve')} disabled={!!acting}>
            {acting === 'approve' ? <Loader2 size={16} className='kd-spin' /> : <CheckCircle size={16} />}
            {acting === 'approve' ? 'Approving…' : 'Approve'}
          </button>
          <button type='button' className='kd-btn kd-btn--no' onClick={() => act('reject')} disabled={!!acting}>
            {acting === 'reject' ? <Loader2 size={16} className='kd-spin' /> : <XCircle size={16} />}
            {acting === 'reject' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      </section>
    </>
  );
}