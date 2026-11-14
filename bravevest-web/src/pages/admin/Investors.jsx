import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Loader2, AlertCircle, ChevronRight,
  ShieldCheck, ShieldX, UserCircle2,
} from 'lucide-react';
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

export default function AdminInvestors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      const res = await apiFetch('/admin/investors?' + params.toString());
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  return (
    <PortalLayout>
      <AdminShell
        title="Investors"
        description="All registered users with KYC and activity status"
      >
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          marginBottom: 20, padding: 14,
          background: 'var(--bv-bg-elevated)',
          border: '1px solid var(--bv-border)', borderRadius: 12,
        }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} color="var(--bv-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING_VERIFICATION">Pending verification</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading investors…
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', display: 'flex', gap: 10 }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <UserCircle2 size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No investors found
            </div>
            <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>
              Try a different search or filter.
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((u) => (
              <div key={u.id} style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) 150px 130px 100px',
                alignItems: 'center', gap: 16, padding: '16px 20px',
                borderBottom: '1px solid var(--bv-border-soft)',
                color: 'var(--bv-text)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--bv-accent)', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, flexShrink: 0,
                  }}>
                    {((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase() || 'U'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.firstName} {u.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 12 }}>
                  {u.kyc?.status === 'APPROVED' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--bv-success)', fontWeight: 600 }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  ) : u.kyc?.status === 'REJECTED' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--bv-danger)', fontWeight: 600 }}>
                      <ShieldX size={12} /> Rejected
                    </span>
                  ) : (
                    <span style={{ color: 'var(--bv-warning)', fontWeight: 600 }}>Pending</span>
                  )}
                </div>

                <div>
                  <span style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: u.status === 'ACTIVE' ? 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))'
                              : u.status === 'SUSPENDED' ? 'color-mix(in srgb, var(--bv-danger) 15%, var(--bv-bg-elevated))'
                              : 'var(--bv-surface)',
                    color: u.status === 'ACTIVE' ? 'var(--bv-success)'
                          : u.status === 'SUSPENDED' ? 'var(--bv-danger)'
                          : 'var(--bv-text-muted)',
                  }}>
                    {u.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Link
                    to={'/admin/investors/' + u.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 6,
                      background: 'var(--bv-surface)', color: 'var(--bv-text)',
                      textDecoration: 'none', fontSize: 12, fontWeight: 600,
                    }}
                  >
                    View <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}
