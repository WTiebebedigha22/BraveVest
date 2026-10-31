import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { api } from '@/api/client';
import { useCurrency } from '@/context/CurrencyContext';

const DEMO_COMMITMENTS = [
  { id: 1, project: 'Lagos Solar Fund II', amount: 500000, expectedReturn: 72500, startDate: '2026-05-15', maturity: '2027-11-15', status: 'active', apy: 14.5 },
  { id: 2, project: 'Abuja Real Estate Note', amount: 1000000, expectedReturn: 240000, startDate: '2026-03-01', maturity: '2028-03-01', status: 'active', apy: 12.0 },
  { id: 3, project: 'Ogun Agri Cooperative', amount: 100000, expectedReturn: 14000, startDate: '2026-06-10', maturity: '2027-06-10', status: 'active', apy: 14.0 },
  { id: 4, project: 'SME Trade Finance', amount: 50000, expectedReturn: 4125, startDate: '2026-09-01', maturity: '2027-03-01', status: 'matured', apy: 16.5 },
];

export default function Commitments() {
  const { format } = useCurrency();
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/investments/commitments')
      .then(r => {
        const data = r.data?.data?.items || r.data?.items || [];
        setCommitments(data.length > 0 ? data : DEMO_COMMITMENTS);
      })
      .catch(() => setCommitments(DEMO_COMMITMENTS))
      .finally(() => setLoading(false));
  }, []);

  const totalCommitted = commitments.reduce((s, c) => s + c.amount, 0);
  const totalExpected = commitments.reduce((s, c) => s + (c.expectedReturn || 0), 0);
  const active = commitments.filter(c => c.status === 'active').length;

  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA', paddingBottom: '64px' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Holdings</span>
              <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111', margin: '8px 0 4px' }}>Commitments</h1>
              <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>All your capital commitments across BraveVest deals.</p>
            </div>
            <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
              New Commitment <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', paddingTop: '32px' }}>

        {/* Summary Cards */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Total Committed</div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111' }}>
              {loading ? '—' : format(totalCommitted)}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Across {active} active commitment{active !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ padding: '28px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Expected Returns</div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0ECB81' }}>
              {loading ? '—' : format(totalExpected)}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>At full maturity</div>
          </div>
          <div style={{ padding: '28px', background: 'linear-gradient(135deg, #111 0%, #1A1A1A 100%)', borderRadius: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #F6A500, transparent)' }} />
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Next Payout</div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {loading ? '—' : format(18500)}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Due in 14 days</div>
          </div>
        </div>

        {/* Commitments Table */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #EAEAEA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: 0 }}>Active Commitments</h3>
            <span style={{ fontSize: '12px', color: '#666' }}>{commitments.length} total</span>
          </div>
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>Loading commitments…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Project', 'Status', 'Committed', 'APY', 'Start Date', 'Maturity'].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 2 ? 'right' : 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #EAEAEA' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commitments.map((c) => {
                  const isActive = c.status === 'active';
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{c.project}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {isActive ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(14,203,129,0.1)', color: '#0ECB81', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            <Clock size={10} /> Active
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#F5F5F5', color: '#666', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            <CheckCircle size={10} /> Matured
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111', textAlign: 'right' }}>
                        {format(c.amount)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#0ECB81', textAlign: 'right' }}>
                        {c.apy}%
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#666', textAlign: 'right' }}>
                        {new Date(c.startDate).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#666', textAlign: 'right' }}>
                        {new Date(c.maturity).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
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
