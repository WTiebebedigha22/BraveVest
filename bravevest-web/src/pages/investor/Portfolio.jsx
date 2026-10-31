import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, PieChart, ArrowRight, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

export default function Portfolio() {
  const { format } = useCurrency();
  const [data, setData] = useState({ items: [], totalInvested: 0, currentValue: 0, totalReturns: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/api/investments/portfolio')
      .then(r => {
        const d = r.data?.data || {};
        setData({
          items: d.items || [],
          totalInvested: d.totalInvested || 0,
          currentValue: d.currentValue || 0,
          totalReturns: d.totalReturns || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return data.items;
    return data.items.filter(it => (it.status || '').toLowerCase() === filter);
  }, [data.items, filter]);

  const totalReturnPct = data.totalInvested > 0
    ? ((data.currentValue - data.totalInvested) / data.totalInvested) * 100
    : 0;

  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA', paddingBottom: '64px' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Holdings</span>
              <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', margin: '8px 0 4px' }}>Portfolio</h1>
              <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>Your deployed capital across all opportunities.</p>
            </div>
            <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
              <TrendingUp size={16} /> New Investment
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', paddingTop: '32px' }}>

        {/* Summary Cards */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>

          {/* Total Invested */}
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(246,165,0,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={18} color="#F6A500" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Invested</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111' }}>
              {loading ? '—' : format(data.totalInvested)}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
              {data.items.length} active holding{data.items.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Current Value */}
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(46,139,139,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={18} color="#2E8B8B" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Value</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111' }}>
              {loading ? '—' : format(data.currentValue)}
            </div>
            {!loading && data.totalInvested > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginTop: '8px', color: totalReturnPct >= 0 ? '#0ECB81' : '#F6465D', fontWeight: '500' }}>
                {totalReturnPct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}% overall
              </div>
            )}
          </div>

          {/* Total Returns */}
          <div style={{ padding: '28px', background: 'linear-gradient(135deg, #111 0%, #1A1A1A 100%)', borderRadius: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #F6A500, transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(246,165,0,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#F6A500" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Returns</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {loading ? '—' : format(data.totalReturns)}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Cumulative yield earned</div>
          </div>
        </div>

        {/* Holdings Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: 0 }}>Holdings</h3>
            <span style={{ background: '#F5F5F5', color: '#666', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
              {data.items.length}
            </span>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'matured', label: 'Matured' },
              { id: 'pending', label: 'Pending' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: filter === f.id ? 'rgba(246,165,0,0.1)' : '#F5F5F5',
                  color: filter === f.id ? '#F6A500' : '#666',
                  fontFamily: 'inherit',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>Loading portfolio…</div>
          ) : data.items.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <PieChart size={40} color="#CCC" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>No active investments</h4>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Start investing to build your portfolio. Browse live opportunities in the Marketplace.
              </p>
              <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                Browse Opportunities <ArrowRight size={14} />
              </Link>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <Filter size={32} color="#CCC" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>No {filter} holdings</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>Try a different filter.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Project', 'Status', 'Invested', 'Current Value', 'Return'].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 2 ? 'right' : 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #EAEAEA' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((it) => {
                  const ret = it.amount > 0 ? ((it.currentValue - it.amount) / it.amount) * 100 : 0;
                  const isPositive = ret >= 0;
                  const status = (it.status || 'active').toLowerCase();
                  const statusMeta = {
                    active: { color: '#0ECB81', bg: 'rgba(14,203,129,0.1)' },
                    matured: { color: '#2E8B8B', bg: 'rgba(46,139,139,0.1)' },
                    pending: { color: '#F6A500', bg: 'rgba(246,165,0,0.1)' },
                    defaulted: { color: '#F6465D', bg: 'rgba(246,70,93,0.1)' },
                  }[status] || { color: '#888', bg: '#F5F5F5' };

                  return (
                    <tr key={it.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{it.projectTitle || 'Investment'}</div>
                        {it.projectCategory && (
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{it.projectCategory}</div>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: statusMeta.bg, color: statusMeta.color, borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusMeta.color }} />
                          {it.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111', textAlign: 'right', fontWeight: '500' }}>
                        {format(it.amount)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111', textAlign: 'right', fontWeight: '600' }}>
                        {format(it.currentValue)}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600', color: isPositive ? '#0ECB81' : '#F6465D' }}>
                          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {isPositive ? '+' : ''}{ret.toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}