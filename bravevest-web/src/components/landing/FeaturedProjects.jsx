import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '@/components/marketplace/ProjectCard';
import Loader from '@/components/shared/Loader';
import { projectsApi } from '@/api/projects';
import './FeaturedProjects.css';

export default function FeaturedProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi
      .featured(3)
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured container">
      <header className="featured__head">
        <div>
          <div className="featured__eyebrow">Featured</div>
          <h2 className="featured__title">Curated opportunities</h2>
        </div>
        <Link to="/marketplace" className="featured__see-all">Browse marketplace →</Link>
      </header>

      {loading ? (
        <div className="text-center py-5"><Loader /></div>
      ) : items.length === 0 ? (
        <div className="featured__empty">No featured projects yet.</div>
      ) : (
        <div className="grid grid-3">
          {items.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </section>
  );
}
