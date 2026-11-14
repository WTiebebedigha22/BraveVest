import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { storiesApi } from '@/api/stories';

export default function StoriesWidget() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    storiesApi.listPublished()
      .then((d) => setStories(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  if (stories.length === 0) return null;

  return (
    <div style={{ padding: 20, background: 'var(--bv-bg-elevated)', border: '1px solid var(--bv-border)', borderRadius: 12, marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="var(--bv-accent)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--bv-text)' }}>Investor Stories</span>
        </div>
        <Link to="/stories" style={{ fontSize: 12, color: 'var(--bv-accent)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stories.map((s) => (
          <div key={s.id} style={{ padding: 12, background: 'var(--bv-bg)', border: '1px solid var(--bv-border)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--bv-text)', fontStyle: 'italic', marginBottom: 6 }}>
              "{s.quote.length > 100 ? s.quote.slice(0, 100) + '…' : s.quote}"
            </div>
            <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', fontWeight: 600 }}>
              — {s.name} · {s.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
