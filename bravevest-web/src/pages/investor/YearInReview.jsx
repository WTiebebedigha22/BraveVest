import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { investmentsApi } from '@/api/investments';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';

export default function YearInReview() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    investmentsApi.portfolio().then(setSummary).catch(() => setSummary(null)).finally(() => setLoading(false));
  }, []);

  function share() {
    const text = 'My ' + year + ' BraveVest year: ' + format(summary?.currentValue || 0) + ' portfolio value, ' + format(summary?.totalReturns || 0) + ' in returns.';
    if (navigator.share) navigator.share({ title: 'BraveVest Year in Review', text });
    else { navigator.clipboard.writeText(text); alert('Copied to clipboard'); }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div>;

  return (
    <div style={{ padding: '32px 0', minHeight: '100vh' }}>
      <div className="container container--narrow">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ textAlign: 'center' }}>Year in Review</span>
          <h1 style={{ margin: '16px 0 12px', fontSize: '36px' }}>{year}</h1>
          <p style={{ color: 'var(--bybit-text-muted)', fontSize: '15px' }}>
            {user?.firstName || 'Your'} year on BraveVest
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <div className="data-label">Portfolio Value</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '12px', color: 'var(--bybit-orange)' }}>
              {format(summary?.currentValue || 0)}
            </div>
          </div>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <div className="data-label">Total Returns</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '12px', color: 'var(--bybit-green)' }}>
              {format(summary?.totalReturns || 0)}
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <div className="data-label">Capital Deployed</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '12px' }}>
              {format(summary?.totalInvested || 0)}
            </div>
          </div>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <div className="data-label">Active Holdings</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '12px' }}>
              {summary?.items?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={share} className="btn btn--primary">
            <Share2 size={14} /> Share Your Year
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--bybit-text-muted)', fontSize: '12px', marginTop: '32px' }}>
          Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
}
