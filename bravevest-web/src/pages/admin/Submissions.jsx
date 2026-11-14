import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, CheckCircle, XCircle, Search, ChevronRight,
  Loader2, AlertCircle, X,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { riskCategory, riskColor } from '@/lib/format';
import PortalLayout from '@/components/layout/PortalLayout';
import AdminShell from '@/components/admin/AdminShell';

const CATEGORIES = ['REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];
const RISKS = ['Low', 'Medium', 'High'];
const URGENCIES = ['Low', 'Medium', 'High'];
const STATUSES = [
  { value: 'SUBMITTED', label: 'New' },
  { value: 'UNDER_REVIEW', label: 'Reviewing' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'all', label: 'All' },
];

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

const fmt = (n) => '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });
const daysUntil = (d) => d ? Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24)) : null;

export default function AdminSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('SUBMITTED');
  const [category, setCategory] = useState('');
  const [risk, setRisk] = useState('');
  const [urgency, setUrgency] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalNote, setModalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      if (risk) params.set('risk', risk);
      if (urgency) params.set('urgency', urgency);
      if (search.trim()) params.set('q', search.trim());
      const res = await apiFetch('/admin/submissions?' + params.toString());
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [status, category, risk, urgency]);

  function openModal(item, action) { setSelected(item); setModalAction(action); setModalNote(''); }

  async function submitAction() {
    if (!selected || !modalAction) return;
    setSubmitting(true);
    try {
      const path = '/admin/submissions/' + selected.id + '/' + modalAction;
      const body = modalAction === 'reject' ? { reason: modalNote } : modalAction === 'accept' ? { note: modalNote } : {};
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
        title="Submissions"
        description="Review funding requests. Accept, reject, or mark as under review."
      >
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          marginBottom: 20, padding: 14,
          background: 'var(--bv-bg-elevated)',
          border: '1px solid var(--bv-border)', borderRadius: 12,
        }}>
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <Search size={16} color="var(--bv-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search submissions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} style={inputStyle}>
            <option value="">All risks</option>
            {RISKS.map((r) => <option key={r} value={r}>{r} risk</option>)}
          </select>
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={inputStyle}>
            <option value="">All urgency</option>
            {URGENCIES.map((u) => <option key={u} value={u}>{u} urgency</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading submissions…
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', display: 'flex', gap: 10 }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <FileText size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No submissions match your filters
            </div>
            <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>Try widening the filters.</div>
          </div>
        ) : (
          <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((item) => {
              const rc = riskColor(item.riskLevel);
              const days = daysUntil(item.fundingDeadline);
              return (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 2fr) 120px 110px 130px 100px',
                  alignItems: 'center', gap: 16, padding: '16px 20px',
                  borderBottom: '1px solid var(--bv-border-soft)',
                  color: 'var(--bv-text)',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span>{item.borrower?.firstName} {item.borrower?.lastName}</span>
                      <span>·</span>
                      <span>{fmt(item.amountRequested)}</span>
                      <span>·</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.text }}>
                      {riskCategory(item.riskLevel)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                    {item.urgency === 'High' && (
                      <span style={{ color: 'var(--bv-danger)', fontWeight: 600 }}>
                        {days !== null && days > 0 ? days + 'd left' : 'Due'}
                      </span>
                    )}
                    {item.urgency === 'Medium' && <span>{days}d left</span>}
                    {item.urgency === 'Low' && <span>Open</span>}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                      background: item.status === 'APPROVED' ? 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))'
                                : item.status === 'REJECTED' ? 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))'
                                : item.status === 'UNDER_REVIEW' ? 'color-mix(in srgb, var(--bv-warning) 15%, var(--bv-bg-elevated))'
                                : 'var(--bv-surface)',
                      color: item.status === 'APPROVED' ? 'var(--bv-success)'
                            : item.status === 'REJECTED' ? 'var(--bv-danger)'
                            : item.status === 'UNDER_REVIEW' ? 'var(--bv-warning)'
                            : 'var(--bv-text-muted)',
                    }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {['SUBMITTED', 'UNDER_REVIEW'].includes(item.status) && (
                      <>
                        <button
                          onClick={() => openModal(item, 'accept')}
                          title="Accept"
                          style={{ padding: 6, border: '1px solid var(--bv-success)', background: 'transparent', color: 'var(--bv-success)', borderRadius: 6, cursor: 'pointer' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => openModal(item, 'reject')}
                          title="Reject"
                          style={{ padding: 6, border: '1px solid var(--bv-danger)', background: 'transparent', color: 'var(--bv-danger)', borderRadius: 6, cursor: 'pointer' }}
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <Link
                      to={'/admin/submissions/' + item.id}
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
                  {modalAction === 'accept' ? 'Accept submission' : 'Reject submission'}
                </h2>
                <button onClick={() => { setSelected(null); setModalAction(null); }} style={{ background: 'none', border: 'none', color: 'var(--bv-text-muted)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 13, color: 'var(--bv-text-muted)', marginBottom: 16 }}>
                <strong style={{ color: 'var(--bv-text)' }}>{selected.title}</strong>
                {selected.borrower && (' · ' + selected.borrower.firstName + ' ' + selected.borrower.lastName)}
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
                  {submitting ? 'Saving…' : modalAction === 'reject' ? 'Reject' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}
