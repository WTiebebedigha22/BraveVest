import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Loader2, AlertCircle, ChevronRight, CheckCircle, XCircle, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';
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

export default function AdminKycList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selected, setSelected] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalNote, setModalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await apiFetch('/admin/kyc?' + params.toString());
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load KYC queue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  function openModal(item, action) { setSelected(item); setModalAction(action); setModalNote(''); }

  async function submitAction() {
    if (!selected || !modalAction) return;
    setSubmitting(true);
    try {
      const path = '/admin/kyc/' + selected.id + '/' + modalAction;
      const body = modalAction === 'reject' ? { reason: modalNote } : {};
      const res = await apiFetch(path, { method: 'PATCH', body });
      if (res && res.success === false) throw new Error(res.message || 'Failed');
      setSelected(null);
      setModalAction(null);
      await load();
    } catch (e) {
      alert(e?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PortalLayout>
      <AdminShell
        title="KYC Queue"
        description="Review identity verifications and approve or reject"
      >
        <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading KYC queue…
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', display: 'flex', gap: 10 }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <Shield size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No KYC submissions to review
            </div>
            <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>You're all caught up.</div>
          </div>
        ) : (
          <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((k) => {
              const user = k.user || k.borrower || k;
              return (
                <div key={k.id} style={{
                  display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 140px 100px',
                  alignItems: 'center', gap: 16, padding: '16px 20px',
                  borderBottom: '1px solid var(--bv-border-soft)',
                  color: 'var(--bv-text)',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: k.status === 'APPROVED' ? 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))'
                                : k.status === 'REJECTED' ? 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))'
                                : 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))',
                      color: k.status === 'APPROVED' ? 'var(--bv-success)'
                            : k.status === 'REJECTED' ? 'var(--bv-danger)'
                            : 'var(--bv-warning)',
                    }}>
                      {k.status?.replace('_', ' ') || 'PENDING'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {['PENDING', 'UNDER_REVIEW'].includes(k.status) && (
                      <>
                        <button
                          onClick={() => openModal(k, 'approve')}
                          title="Approve"
                          style={{ padding: 6, border: '1px solid var(--bv-success)', background: 'transparent', color: 'var(--bv-success)', borderRadius: 6, cursor: 'pointer' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => openModal(k, 'reject')}
                          title="Reject"
                          style={{ padding: 6, border: '1px solid var(--bv-danger)', background: 'transparent', color: 'var(--bv-danger)', borderRadius: 6, cursor: 'pointer' }}
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <Link
                      to={'/admin/kyc/' + k.id}
                      style={{ padding: 6, border: '1px solid var(--bv-border)', background: 'transparent', color: 'var(--bv-text)', borderRadius: 6, display: 'inline-flex' }}
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selected && modalAction && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => { setSelected(null); setModalAction(null); }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 480, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 16, padding: 24, color: 'var(--bv-text)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {modalAction === 'approve' ? 'Approve KYC' : 'Reject KYC'}
                </h2>
                <button onClick={() => { setSelected(null); setModalAction(null); }} style={{ background: 'none', border: 'none', color: 'var(--bv-text-muted)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <label style={{ display: 'grid', gap: 6, fontSize: 13, marginBottom: 16 }}>
                {modalAction === 'reject' ? 'Reason for rejection (required)' : 'Note (optional)'}
                <textarea value={modalNote} onChange={(e) => setModalNote(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setSelected(null); setModalAction(null); }}
                  style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--bv-border)', color: 'var(--bv-text)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
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
                  {submitting ? 'Saving…' : modalAction === 'reject' ? 'Reject' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}
