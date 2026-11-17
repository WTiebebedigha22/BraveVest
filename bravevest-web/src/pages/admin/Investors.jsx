import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Loader2, AlertCircle, ChevronRight,
  ShieldCheck, ShieldX, UserCircle2, RotateCcw,
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
  const [kycFilter, setKycFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      if (kycFilter) params.set('kycStatus', kycFilter);

      const queryString = params.toString();
      const res = await apiFetch('/admin/investors' + (queryString ? `?${queryString}` : ''));
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

  useEffect(() => {
    load();
  }, [statusFilter, kycFilter]);

  const hasActiveFilters = Boolean(search.trim() || statusFilter || kycFilter);

  function resetFilters() {
    setSearch('');
    setStatusFilter('');
    setKycFilter('');
  }

  // Filter and sort client-side as well so results update immediately even if the API ignores query params
  const filteredAndSortedItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fullName = (u) => `${u.firstName || ''} ${u.lastName || ''}`.trim().toLowerCase();
    const time = (u) => (u.createdAt ? new Date(u.createdAt).getTime() : 0);

    const filtered = items.filter((u) => {
      if (statusFilter && u.status !== statusFilter) return false;

      if (kycFilter) {
        const userKyc = u.kyc?.status || 'PENDING';
        if (kycFilter === 'PENDING') {
          if (userKyc === 'APPROVED' || userKyc === 'REJECTED') return false;
        } else if (userKyc !== kycFilter) {
          return false;
        }
      }

      if (q) {
        const haystack = `${fullName(u)} ${u.email || ''} ${u.phone || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => time(a) - time(b));
      case 'name-asc':
        return filtered.sort((a, b) => fullName(a).localeCompare(fullName(b)));
      case 'name-desc':
        return filtered.sort((a, b) => fullName(b).localeCompare(fullName(a)));
      case 'investments':
        return filtered.sort((a, b) => (b._count?.investments || 0) - (a._count?.investments || 0));
      case 'newest':
      default:
        return filtered.sort((a, b) => time(b) - time(a));
    }
  }, [items, search, statusFilter, kycFilter, sortBy]);

  return (
    <PortalLayout>
      <AdminShell
        title="Investors"
        description="All registered users with KYC and activity status"
      >
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
          marginBottom: 20, padding: 14,
          background: 'var(--bv-bg-elevated)',
          border: '1px solid var(--bv-border)', borderRadius: 12,
        }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
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

          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            style={inputStyle}
            aria-label="Filter by KYC status"
          >
            <option value="">All KYC</option>
            <option value="APPROVED">KYC: Verified</option>
            <option value="PENDING">KYC: Pending</option>
            <option value="REJECTED">KYC: Rejected</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
            aria-label="Filter by account status"
          >
            <option value="">All Account Statuses</option>
            <option value="ACTIVE">Status: Active</option>
            <option value="PENDING_VERIFICATION">Status: Pending Verification</option>
            <option value="SUSPENDED">Status: Suspended</option>
            <option value="DEACTIVATED">Status: Deactivated</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={inputStyle}
            aria-label="Sort investors"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="investments">Most investments</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                ...inputStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bv-surface)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
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
        ) : filteredAndSortedItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <UserCircle2 size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No investors found
            </div>
            <div style={{ fontSize: 13, color: 'var(--bv-text-muted)', marginBottom: hasActiveFilters ? 16 : 0 }}>
              Try adjusting your search, KYC, or status filters.
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  ...inputStyle,
                  background: 'var(--bv-surface)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 8 }}>
              Showing {filteredAndSortedItems.length} investor{filteredAndSortedItems.length === 1 ? '' : 's'}
            </div>
            <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '48px minmax(0, 2fr) 150px 150px 100px',
                gap: 16, padding: '10px 20px',
                borderBottom: '1px solid var(--bv-border)',
                fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
                textTransform: 'uppercase', color: 'var(--bv-text-muted)',
              }}>
                <div>#</div>
                <div>Investor</div>
                <div>KYC</div>
                <div>Status</div>
                <div />
              </div>
              {filteredAndSortedItems.map((u, index) => (
                <div key={u.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '48px minmax(0, 2fr) 150px 150px 100px',
                  alignItems: 'center', gap: 16, padding: '16px 20px',
                  borderBottom: '1px solid var(--bv-border-soft)',
                  color: 'var(--bv-text)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bv-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {index + 1}
                  </div>

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
          </>
        )}
      </AdminShell>
    </PortalLayout>
  );
}