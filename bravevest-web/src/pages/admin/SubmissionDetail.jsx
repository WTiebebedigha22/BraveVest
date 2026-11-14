import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Loader2, AlertCircle, CheckCircle, XCircle, X,
  FileText, User, Calendar, Clock, Shield,
  ExternalLink, MessageSquare, Paperclip,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { riskCategory, riskColor } from '@/lib/format';
import AdminShell from '@/components/admin/AdminShell';

const inputStyle = {
  padding: '10px 14px',
  background: 'var(--bv-bg)',
  border: '1px solid var(--bv-border)',
  borderRadius: 8,
  color: 'var(--bv-text)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};

const fmt = (n) =>
  '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');
const fmtDay = (d) => (d ? new Date(d).toLocaleDateString() : '—');

function statusTone(status) {
  if (status === 'APPROVED')
    return { bg: 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-success)' };
  if (status === 'REJECTED')
    return { bg: 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-danger)' };
  if (status === 'UNDER_REVIEW')
    return { bg: 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))', fg: 'var(--bv-warning)' };
  return { bg: 'var(--bv-surface)', fg: 'var(--bv-text-muted)' };
}

export default function SubmissionDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalNote, setModalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/admin/submissions/' + id);
      const data = res?.data || res;
      if (!data || !data.id) throw new Error('Submission not found');
      setItem(data);
    } catch (e) {
      setError(e?.message || 'Failed to load submission');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function submitAction() {
    if (!modalAction || !item) return;
    setSubmitting(true);
    try {
      const path = '/admin/submissions/' + item.id + '/' + modalAction;
      const body =
        modalAction === 'reject' ? { reason: modalNote } : { note: modalNote };
      const res = await apiFetch(path, { method: 'PATCH', body });
      if (res && res.success === false) throw new Error(res.message || 'Failed');
      setModalAction(null);
      setModalNote('');
      await load();
    } catch (e) {
      alert(e?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  }

  const breadcrumbs = [
    { label: 'Submissions', to: '/admin/submissions' },
    { label: item?.title || 'Detail' },
  ];

  return (
    <>
      <AdminShell
        title={item?.title || 'Submission'}
        description={item?.reference ? 'Ref: ' + item.reference : ''}
        breadcrumbs={breadcrumbs}
        actions={
          item && ['SUBMITTED', 'UNDER_REVIEW'].includes(item.status) ? (
            <>
              <button
                onClick={() => { setModalAction('reject'); setModalNote(''); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 8,
                  background: 'transparent', color: 'var(--bv-danger)',
                  border: '1px solid var(--bv-danger)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                <XCircle size={14} /> Reject
              </button>
              <button
                onClick={() => { setModalAction('accept'); setModalNote(''); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 8,
                  background: 'var(--bv-success)', color: '#fff',
                  border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                <CheckCircle size={14} /> Accept
              </button>
            </>
          ) : null
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/admin/submissions"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--bv-text-muted)', textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Back to submissions
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading submission…
          </div>
        ) : error ? (
          <div style={{
            padding: 20,
            background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)',
            borderRadius: 12, color: 'var(--bv-danger)',
            display: 'flex', gap: 10,
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : item && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
              }}>
                <div style={{ padding: 16, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginBottom: 4 }}>Status</div>
                  {(() => {
                    const t = statusTone(item.status);
                    return (
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: t.bg, color: t.fg }}>
                        {item.status.replace('_', ' ')}
                      </span>
                    );
                  })()}
                </div>

                <div style={{ padding: 16, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginBottom: 4 }}>Risk</div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                    background: riskColor(item.riskLevel).bg,
                    color: riskColor(item.riskLevel).text,
                  }}>
                    {riskCategory(item.riskLevel)}
                  </span>
                </div>

                <div style={{ padding: 16, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginBottom: 4 }}>Amount Requested</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bv-text)' }}>
                    {fmt(item.amountRequested)}
                  </div>
                </div>

                <div style={{ padding: 16, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginBottom: 4 }}>Proposed Return</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bv-success)' }}>
                    {item.proposedReturnPct ? item.proposedReturnPct + '%' : '—'}
                  </div>
                </div>
              </div>

              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <FileText size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Summary</h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--bv-text-muted)', lineHeight: 1.7, margin: 0 }}>
                  {item.summary || 'No summary provided.'}
                </p>
              </div>

              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <MessageSquare size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Description</h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--bv-text-muted)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {item.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Paperclip size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>
                    Documents ({item.documents?.length || 0})
                  </h2>
                </div>
                {item.documents && item.documents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 12px', borderRadius: 8,
                          background: 'var(--bv-surface)', color: 'var(--bv-text)',
                          textDecoration: 'none', fontSize: 13,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FileText size={14} color="var(--bv-text-muted)" />
                          {doc.fileName || doc.kind || 'Document'}
                        </span>
                        <ExternalLink size={12} color="var(--bv-text-muted)" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>No documents attached.</div>
                )}
              </div>

              {item.managerNotes && (
                <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <MessageSquare size={16} color="var(--bv-text-muted)" />
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Manager Notes</h2>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--bv-text-muted)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {item.managerNotes}
                  </p>
                </div>
              )}

              {item.rejectionReason && (
                <div style={{
                  padding: 20,
                  background: 'color-mix(in srgb, var(--bv-danger) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)',
                  borderRadius: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <XCircle size={16} color="var(--bv-danger)" />
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--bv-danger)' }}>Rejection Reason</h2>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--bv-text)', margin: 0 }}>{item.rejectionReason}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <User size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Requester</h2>
                </div>

                {item.borrower ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--bv-accent)', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14,
                      }}>
                        {((item.borrower.firstName?.[0] || '') + (item.borrower.lastName?.[0] || '')).toUpperCase() || 'U'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--bv-text)' }}>
                          {item.borrower.firstName} {item.borrower.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                          {item.borrower.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', display: 'grid', gap: 6 }}>
                      {item.borrower.phone && (<div>📞 {item.borrower.phone}</div>)}
                      {item.borrower.kyc?.status && (
                        <div>
                          <Shield size={11} style={{ display: 'inline', marginRight: 4 }} />
                          KYC:{' '}
                          <strong style={{
                            color: item.borrower.kyc.status === 'APPROVED' ? 'var(--bv-success)'
                                 : item.borrower.kyc.status === 'REJECTED' ? 'var(--bv-danger)'
                                 : 'var(--bv-warning)',
                          }}>{item.borrower.kyc.status}</strong>
                        </div>
                      )}
                    </div>

                    {item.borrower.id && (
                      <Link
                        to={'/admin/investors/' + item.borrower.id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          marginTop: 12, fontSize: 12, fontWeight: 600,
                          color: 'var(--bv-accent)', textDecoration: 'none',
                        }}
                      >
                        View investor profile →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>No requester info</div>
                )}
              </div>

              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Clock size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Timeline</h2>
                </div>
                <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
                  <div>
                    <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Created</div>
                    <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmtDate(item.createdAt)}</div>
                  </div>
                  {item.submittedAt && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Submitted</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmtDate(item.submittedAt)}</div>
                    </div>
                  )}
                  {item.publishedAt && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Published</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmtDate(item.publishedAt)}</div>
                    </div>
                  )}
                  {item.fundingDeadline && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Deadline</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmtDay(item.fundingDeadline)}</div>
                    </div>
                  )}
                  {item.reviewedAt && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Reviewed</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmtDate(item.reviewedAt)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Calendar size={16} color="var(--bv-text-muted)" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--bv-text)' }}>Details</h2>
                </div>
                <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
                  {item.category && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Category</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{item.category.replace('_', ' ')}</div>
                    </div>
                  )}
                  {item.durationMonths && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Duration</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{item.durationMonths} months</div>
                    </div>
                  )}
                  {item.repaymentFrequency && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Repayment</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500, textTransform: 'capitalize' }}>{item.repaymentFrequency}</div>
                    </div>
                  )}
                  {item.minCommitment && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Min commitment</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmt(item.minCommitment)}</div>
                    </div>
                  )}
                  {item.maxCommitment && (
                    <div>
                      <div style={{ color: 'var(--bv-text-muted)', marginBottom: 2 }}>Max commitment</div>
                      <div style={{ color: 'var(--bv-text)', fontWeight: 500 }}>{fmt(item.maxCommitment)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {modalAction && item && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
            onClick={() => { setModalAction(null); setModalNote(''); }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 480,
                background: 'var(--bv-bg-elevated)',
                border: '1px solid var(--bv-border)', borderRadius: 16,
                padding: 24, color: 'var(--bv-text)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {modalAction === 'accept' ? 'Accept submission' : 'Reject submission'}
                </h2>
                <button
                  onClick={() => { setModalAction(null); setModalNote(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--bv-text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 13, color: 'var(--bv-text-muted)', marginBottom: 16 }}>
                <strong style={{ color: 'var(--bv-text)' }}>{item.title}</strong>
                {item.borrower && (' · ' + item.borrower.firstName + ' ' + item.borrower.lastName)}
              </div>

              <label style={{ display: 'grid', gap: 6, fontSize: 13, marginBottom: 16 }}>
                {modalAction === 'reject' ? 'Reason for rejection (required)' : 'Note (optional)'}
                <textarea
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setModalAction(null); setModalNote(''); }}
                  style={{
                    padding: '10px 16px', background: 'transparent',
                    border: '1px solid var(--bv-border)', color: 'var(--bv-text)',
                    borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitAction}
                  disabled={submitting || (modalAction === 'reject' && !modalNote.trim())}
                  style={{
                    padding: '10px 20px',
                    background: modalAction === 'reject' ? 'var(--bv-danger)' : 'var(--bv-success)',
                    color: '#fff', border: 'none', borderRadius: 8,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: 700, opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Saving…' : modalAction === 'reject' ? 'Reject' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}
