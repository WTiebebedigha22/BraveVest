import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import { useAuth } from '@/hooks/useAuth';
import { investmentsApi } from '@/api/investments';
import { formatNaira } from '@/utils/format';
import './YearInReview.css';

export default function YearInReview() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    investmentsApi.list({ limit: 200 })
      .then((d) => setInvestments(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const yStats = useMemo(() => {
    const yStart = new Date(year, 0, 1);
    const active = investments.filter((i) => ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(i.status));
    const thisYear = active.filter((i) => i.investedAt && new Date(i.investedAt) >= yStart);
    const totalInvested = active.reduce((s, i) => s + Number(i.amount), 0);
    const yearInvested = thisYear.reduce((s, i) => s + Number(i.amount), 0);
    const yearReturns = active.reduce((s, i) => s + Number(i.actualReturn || 0), 0);
    const expectedReturns = active.reduce((s, i) => s + Number(i.expectedReturn || 0), 0);
    const categories = {};
    for (const i of active) {
      const c = i.project?.category || 'OTHER';
      categories[c] = (categories[c] || 0) + Number(i.amount);
    }
    const topCat = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const avgTicket = active.length ? totalInvested / active.length : 0;
    return { active, thisYear, totalInvested, yearInvested, yearReturns, expectedReturns, topCat, avgTicket };
  }, [investments, year]);

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  function share() {
    if (navigator.share) {
      navigator.share({
        title: `My ${year} BraveVest Review`,
        text: `I invested ${formatNaira(yStats.totalInvested)} across ${yStats.active.length} projects on BraveVest in ${year}.`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      alert('Link copied to clipboard');
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Year in Review"
        title={`Your ${year} on BraveVest`}
        subtitle={`Hi ${user?.firstName || 'Investor'} — here's your year at a glance`}
        right={
          <>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>Print</Button>
            <Button variant="primary" size="sm" onClick={share}>Share</Button>
          </>
        }
      />

      {/* Hero metric */}
      <div className="yir-hero">
        <div className="yir-hero__mesh" aria-hidden />
        <div className="yir-hero__inner">
          <div className="yir-hero__eyebrow">You invested</div>
          <div className="yir-hero__value"><Currency value={yStats.totalInvested} /></div>
          <div className="yir-hero__sub">
            across <strong>{yStats.active.length}</strong> projects in {year}
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="yir-grid mb-4">
        <div className="yir-stat">
          <div className="yir-stat__label">Expected returns</div>
          <div className="yir-stat__value"><Currency value={yStats.expectedReturns} /></div>
          <div className="yir-stat__hint">If all projects complete as planned</div>
        </div>
        <div className="yir-stat">
          <div className="yir-stat__label">Total returns received</div>
          <div className="yir-stat__value yir-stat__value--green"><Currency value={yStats.yearReturns} /></div>
          <div className="yir-stat__hint">Already paid out</div>
        </div>
        <div className="yir-stat">
          <div className="yir-stat__label">Average ticket</div>
          <div className="yir-stat__value"><Currency value={yStats.avgTicket} compact /></div>
          <div className="yir-stat__hint">Per investment</div>
        </div>
        <div className="yir-stat">
          <div className="yir-stat__label">Favorite category</div>
          <div className="yir-stat__value" style={{ fontSize: 22 }}>
            {yStats.topCat ? yStats.topCat[0].replace(/_/g, ' ') : '—'}
          </div>
          <div className="yir-stat__hint">{yStats.topCat ? formatNaira(yStats.topCat[1], { compact: true }) : ''}</div>
        </div>
      </div>

      {/* Projects list */}
      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header title="Your projects" subtitle={`${yStats.active.length} active`} />
        <AdminCard.Body>
          {yStats.active.length === 0 ? (
            <div className="text-muted">No investments yet. <Link to="/marketplace">Browse the marketplace →</Link></div>
          ) : (
            <div className="yir-list">
              {yStats.active.map((i) => (
                <Link key={i.id} to={`/investments/${i.id}`} className="yir-list__row">
                  <div className="yir-list__info">
                    <div className="yir-list__title">{i.project?.title}</div>
                    <div className="yir-list__cat">{i.project?.category?.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="yir-list__right">
                    <Currency value={i.amount} />
                    <div className="yir-list__status">{i.status}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard.Body>
      </AdminCard>

      {/* Sharing footer */}
      <div className="yir-share">
        <div className="yir-share__title">Share your year with others</div>
        <p className="yir-share__body">
          Screenshot this page or use the share button above. Tag us on social media.
        </p>
        <Button variant="primary" size="lg" onClick={share}>Share my {year} review</Button>
      </div>
    </>
  );
}
