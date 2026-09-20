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
    description:
      'Browse verified investment opportunities in real estate, agriculture, energy and credit products. Transparent terms, curated operators.',
    canonical: '/#/marketplace',
  });

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 24 };
    if (category) params.category = category;
    if (q) params.q = q;
    projectsApi
      .list(params)
      .then((data) => setItems(data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    if (q && q.length > 2) Analytics.search(q);
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
