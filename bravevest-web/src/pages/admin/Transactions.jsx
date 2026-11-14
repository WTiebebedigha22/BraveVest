import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, ArrowLeftRight, Search } from 'lucide-react';
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

const fmt = (n) => '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (typeFilter) params.set('type', typeFilter);
      const res = await apiFetch('/admin/transactions?' + params.toString());
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res) ? res : [];
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [typeFilter]);

  return (
    <PortalLayout>
      <AdminShell
        title="Transactions"
        description="All platform transactions"
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
              placeholder="Search by reference, description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={inputStyle}>
            <option value="">All types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="INVESTMENT">Investment</option>
            <option value="RETURN">Return</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="REFUND">Refund</option>
            <option value="FEE">Fee</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--bv-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Loading transactions…
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: 'color-mix(in srgb, var(--bv-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--bv-danger) 25%, transparent)', borderRadius: 12, color: 'var(--bv-danger)', display: 'flex', gap: 10 }}>
            <AlertCircle size={18} /> {error}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'var(--bv-bg-elevated)', border: '1px dashed var(--bv-border)', borderRadius: 12 }}>
            <ArrowLeftRight size={28} color="var(--bv-text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bv-text)', marginBottom: 4 }}>
              No transactions
            </div>
            <div style={{ fontSize: 13, color: 'var(--bv-text-muted)' }}>
              Transactions will appear here as users deposit and invest.
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((t) => (
              <div key={t.id} style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) 120px 130px 140px',
                alignItems: 'center', gap: 16, padding: '16px 20px',
                borderBottom: '1px solid var(--bv-border-soft)',
                color: 'var(--bv-text)',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.description || t.reference}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--bv-text-muted)' }}>
                    {t.reference} · {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'var(--bv-surface)', color: 'var(--bv-text-muted)' }}>
                    {t.type}
                  </span>
                </div>
                <div>
                  <span style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: t.status === 'SUCCESS' ? 'color-mix(in srgb, var(--bv-success) 15%, var(--bv-bg-elevated))' : 'var(--bv-surface)',
                    color: t.status === 'SUCCESS' ? 'var(--bv-success)' : 'var(--bv-text-muted)',
                  }}>
                    {t.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--bv-text)' }}>
                  {fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    </PortalLayout>
  );
}
