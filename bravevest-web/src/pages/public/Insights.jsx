import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import AdminEmpty from '@/components/admin/AdminEmpty';
import { insightsApi } from '@/api/insights';
import { useSEO } from '@/hooks/useSEO';
import './Insights.css';

export default function Insights() {
  useSEO({
    title: 'Insights',
    description: 'Market briefs, platform data, and educational content from BraveVest.',
    canonical: '/#/insights',
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsApi.list({ limit: 24 })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container insights">
      <header className="insights__head">
        <div className="insights__eyebrow">Insights</div>
        <h1 className="insights__title">Market briefs &amp; education.</h1>
        <p className="insights__sub">
          Weekly notes on Nigerian real estate, agriculture, energy, and how to think about investing.
        </p>
      </header>

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : items.length === 0 ? (
        <AdminEmpty
          title="No insights published yet"
          body="Insights will appear here as they're published."
        />
      ) : (
        <div className="insights__grid">
          {items.map((i) => (
            <Link key={i.id} to={'/insights/' + i.id} className="insights__card">
              {i.coverImage && <img src={i.coverImage} alt="" className="insights__img" />}
              <div className="insights__cat">{i.category}</div>
              <div className="insights__title">{i.title}</div>
              <p className="insights__summary">{i.summary}</p>
              <div className="insights__cta">Read →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
