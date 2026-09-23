import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Loader from '@/components/shared/Loader';
import ProjectGrid from '@/components/marketplace/ProjectGrid';
import ProjectFilters from '@/components/marketplace/ProjectFilters';
import { projectsApi } from '@/api/projects';
import { useSEO } from '@/hooks/useSEO';
import { Analytics } from '@/utils/analytics';
import './Marketplace.css';

export default function Marketplace() {
  useSEO({
    title: 'Marketplace — Verified Opportunities',
    description: 'Browse verified investment opportunities in real estate, agriculture, energy and credit products.',
    canonical: '/#/marketplace',
  });

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = { limit: 100 };
    if (category) params.category = category;
    if (q.trim().length > 1) params.q = q.trim();

    projectsApi
      .list(params)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data || []);
          if (q.trim().length > 2) Analytics.search(q.trim());
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load projects');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, q]);

  return (
    <div className="container marketplace">
      <PageHeader
        title="The Marketplace"
        subtitle="Handpicked opportunities across real estate, agriculture, and energy."
        right={
          <input
            className="marketplace__search"
            placeholder="Search opportunities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        }
      />

      <ProjectFilters value={category} onChange={setCategory} />

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : error ? (
        <div className="marketplace__empty">
          <h3>Couldn't load projects</h3>
          <p className="text-muted">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="marketplace__empty">
          <h3>No projects found</h3>
          <p className="text-muted">Try a different category or search term.</p>
        </div>
      ) : (
        <ProjectGrid projects={items} />
      )}
    </div>
  );
}
