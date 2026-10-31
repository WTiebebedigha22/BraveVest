import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marketplaceApi } from '@/api/marketplace';
import { useCurrency } from '@/context/CurrencyContext';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [op, setOp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceApi.get(id)
      .then(setOp)
      .catch(() => setOp(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--slate)' }}>
        Loading…
      </div>
    );
  }

  if (!op) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Opportunity not found</h2>
        <Link to="/marketplace" className="btn btn--outline">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '16px' }}>
          <Link to="/marketplace" style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--slate)' }}>
            ← Back to Marketplace
          </Link>
        </div>

        <div className="asymmetric-grid" style={{ marginTop: '40px' }}>
          <div>
            <span className="eyebrow">{op.issuer || op.borrower}</span>
            <h1 style={{ marginBottom: '24px' }}>{op.title || op.name}</h1>
            <p className="lede" style={{ marginBottom: '48px' }}>
              {op.description || 'Detailed description unavailable.'}
            </p>

            <div className="divider" />

            <h3 style={{ marginBottom: '24px' }}>Structure</h3>
            <table className="fin-table">
              <tbody>
                <tr>
                  <td style={{ width: '40%', color: 'var(--slate)' }}>Instrument</td>
                  <td>{op.structure || 'Senior Secured Note'}</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--slate)' }}>Tenor</td>
                  <td>{op.tenor || '—'}</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--slate)' }}>Target Yield</td>
                  <td className="num positive">{op.yield ? `${op.yield}%` : '—'}</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--slate)' }}>Collateral</td>
                  <td>{op.collateral || 'See offering memorandum'}</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--slate)' }}>Minimum</td>
                  <td className="num">{op.minimum ? format(op.minimum) : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="card card--filled card--accent" style={{ marginBottom: '24px' }}>
              <div className="data-label">Available</div>
              <div className="data-value" style={{ marginTop: '12px', marginBottom: '24px' }}>
                {op.available ? format(op.available) : '—'}
              </div>
              <div className="data-label">Target Yield</div>
              <div className="data-value text-gold" style={{ marginTop: '12px' }}>
                {op.yield ? `${op.yield}%` : '—'}
              </div>
            </div>
            <Link to={`/invest/${op.id}`} className="btn btn--primary" style={{ width: '100%' }}>
              Invest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
