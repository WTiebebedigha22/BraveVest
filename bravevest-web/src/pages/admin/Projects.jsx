import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Loader2, AlertCircle, ChevronRight, Plus, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { riskCategory, riskColor } from '@/lib/format';
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

const fmt = (n) => '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });

export default function AdminProjects() {
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
      const res = await apiFetch('/admin/projects?' + params.toString());
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  return (
    <PortalLayout>
      <AdminShell
        title="Projects"
        description="Manage marketplace projects"
        actions={
          <Link
            to="/admin/projects/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 8,
              background: 'var(--bv-accent)', color: '#000',
              textDecoration: 'none', fontWeight: 700, fontSize: 13,
            }}
          >
            <Plus size={14} /> New Project
          </Link>
        }
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
              placeholder="Search by title, slug, or summary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="DRAFT">Draft</option>
            <option value="FUNDED">Funded</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading projects…
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', display: 'flex', gap: 10 }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <FolderOpen size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No projects yet
            </div>
            <Link to="/admin/projects/new" style={{ color: 'var(--bv-accent)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Create the first project →
            </Link>
          </div>
        ) : (
          <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((p) => {
              const rc = riskColor(p.riskLevel);
              return (
                <div key={p.id} style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 2fr) 120px 130px 100px',
                  alignItems: 'center', gap: 16, padding: '16px 20px',
                  borderBottom: '1px solid var(--bv-border-soft)',
                  color: 'var(--bv-text)',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                      {p.category?.replace('_', ' ')} · {fmt(p.targetAmount)}
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.text }}>
                      {riskCategory(p.riskLevel)}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: p.status === 'OPEN' ? 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))' : 'var(--bv-surface)',
                      color: p.status === 'OPEN' ? 'var(--bv-success)' : 'var(--bv-text-muted)',
                    }}>
                      {p.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Link to={'/admin/projects/' + p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 6, background: 'var(--bv-surface)', color: 'var(--bv-text)', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                      Edit <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}
