import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import { insightsApi } from '@/api/insights';
import { useSEO } from '@/hooks/useSEO';
import './InsightDetail.css';

export default function InsightDetail() {
  const { id } = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    insightsApi.get(id)
      .then(setInsight)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useSEO({
    title: insight ? insight.title : 'Insight',
    description: insight ? insight.summary : 'Insight on BraveVest',
    canonical: '/#/insights/' + id,
    type: 'article',
  });

  if (loading) return <div className="container text-center py-5"><Loader /></div>;
  if (notFound || !insight) {
    return (
      <div className="container text-center py-5">
        <h2>Insight not found</h2>
        <Link to="/insights" className="mt-3" style={{ display: 'inline-block', textDecoration: 'underline' }}>← All insights</Link>
      </div>
    );
  }

  const published = insight.publishedAt ? new Date(insight.publishedAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <article className="insd container">
      <Link to="/insights" className="insd__back">← All insights</Link>

      <header className="insd__head">
        <div className="insd__cat">{insight.category}</div>
        <h1 className="insd__title">{insight.title}</h1>
        {insight.summary && <p className="insd__summary">{insight.summary}</p>}
        {published && <div className="insd__date">{published}</div>}
      </header>

      {insight.coverImage && (
        <img src={insight.coverImage} alt="" className="insd__cover" />
      )}

      <div className="insd__body">
        {String(insight.body || '').split(/\n\n+/).map((para, i) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('## ')) {
            return <h2 key={i} className="insd__h2">{trimmed.replace(/^##\s+/, '')}</h2>;
          }
          if (trimmed.startsWith('# ')) {
            return <h2 key={i} className="insd__h2">{trimmed.replace(/^#\s+/, '')}</h2>;
          }
          if (/^[-*]\s/.test(trimmed)) {
            const items = trimmed.split(/\n/).map((l) => l.replace(/^[-*]\s+/, ''));
            return <ul key={i} className="insd__ul">{items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
          }
          return <p key={i} className="insd__p">{trimmed}</p>;
        })}
      </div>

      <footer className="insd__foot">
        <div className="insd__foot-title">Want to invest in opportunities like these?</div>
        <Link to="/marketplace" className="insd__foot-cta">Browse the marketplace →</Link>
      </footer>
    </article>
  );
}
