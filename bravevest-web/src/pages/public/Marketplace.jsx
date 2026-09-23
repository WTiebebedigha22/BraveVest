import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ProjectGrid from '@/components/marketplace/ProjectGrid';
import ProjectFilters from '@/components/marketplace/ProjectFilters';
import Skeleton from '@/components/shared/Skeleton';
import AdminEmpty from '@/components/admin/AdminEmpty';
import { projectsApi } from '@/api/projects';
import { useSEO } from '@/hooks/useSEO';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Analytics } from '@/utils/analytics';
import './Marketplace.css';

export default function Marketplace() {
  useSEO({
    title: 'Marketplace — Verified Opportunities',
    description: 'Browse verified investment opportunities in real estate, agriculture, energy and credit products.',
    canonical: '/#/marketplace',
  });

  const online = useOnlineStatus();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedQ = useDebounce(q, 500);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = { limit: 100 };
    if (category) params.category = category;
    if (debouncedQ.trim().length > 1) params.q = debouncedQ.trim();

    projectsApi
      .list(params)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data || []);
          if (debouncedQ.trim().length > 2) Analytics.search(debouncedQ.trim());
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load projects');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, debouncedQ]);

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
        <Skeleton.Grid count={6} />
      ) : error ? (
        <AdminEmpty
          title={online ? "Couldn't load projects" : 'You are offline'}
          body={online ? error : 'Reconnect to the internet to browse projects.'}
        />
      ) : items.length === 0 ? (
        <AdminEmpty
          title="No projects found"
          body="Try a different category or search term."
        />
      ) : (
        <ProjectGrid projects={items} />
      )}
    </div>
  );
}
