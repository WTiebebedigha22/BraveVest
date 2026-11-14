import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, Loader2, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { api } from '@/api/client';
import PageShell from '@/components/shared/PageShell';

const C = {
  bg:        'var(--bv-bg)',
  surface:   'var(--bv-bg-elevated)',
  text:      'var(--bv-text)',
  muted:     'var(--bv-text-muted)',
  border:    'var(--bv-border)',
  accent:    'var(--bv-accent)',
  accentTxt: 'var(--bv-bg-elevated)',
};

function InsightList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/insights/published');
        const data = res.data?.data ?? res.data ?? [];
        if (!cancelled) setItems(Array.isArray(data) ? data : data.insights ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || e?.message || 'Could not load insights.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => i.category && set.add(i.category));
    return ['all', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    let out = items;
    if (category !== 'all') out = out.filter((i) => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.summary || '').toLowerCase().includes(q) ||
          (i.category || '').toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, search, category]);

  if (loading) {
    return (
      <PageShell>
        <div style={{ padding: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: C.muted }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading insights…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div role="alert" style={{ padding: 48, maxWidth: 800, margin: '0 auto', color: C.text }}>
          <div style={{ display: 'flex', gap: 8, color: 'var(--bv-negative, #F6465D)', padding: 16, background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8 }}>
            <AlertCircle size={20} /> {error}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Insights & Research</h1>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Deep dives into markets, investment opportunities, and financial literacy — published by the BraveVest team.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
              <Search size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search insights"
                style={{ width: '100%', padding: '10px 12px 10px 36px', background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accent : 'transparent', color: active ? C.accentTxt : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: c === 'all' ? 'capitalize' : 'none' }}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              {items.length === 0 ? 'No insights published yet. Check back soon.' : 'No insights match your filters.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {filtered.map((i) => (
                <Link
                  key={i.id}
                  to={`/insights/${i.id}`}
                  style={{ display: 'flex', flexDirection: 'column', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: C.text, transition: 'transform 0.15s, border-color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {i.coverImage && (
                    <div style={{ width: '100%', height: 160, background: C.bg, overflow: 'hidden' }}>
                      <img src={i.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {i.category && (
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.accent, marginBottom: 8 }}>{i.category}</span>
                    )}
                    <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.35 }}>{i.title}</h2>
                    <p style={{ fontSize: 14, color: C.muted, margin: '0 0 16px', lineHeight: 1.55, flex: 1 }}>
                      {i.summary || (i.body ? i.body.slice(0, 120) + '…' : '')}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                      <Calendar size={12} />
                      {i.publishedAt ? new Date(i.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date(i.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function InsightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/insights/${id}`);
        const data = res.data?.data ?? res.data;
        if (!cancelled) setItem(data);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || e?.message || 'Could not load article.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div style={{ padding: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: C.muted }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading article…
          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </PageShell>
    );
  }

  if (error || !item) {
    return (
      <PageShell>
        <div style={{ padding: 80, maxWidth: 800, margin: '0 auto', textAlign: 'center', color: C.text }}>
          <AlertCircle size={40} color="var(--bv-negative, #F6465D)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Article not found</h1>
          <p style={{ color: C.muted, marginBottom: 24 }}>{error || 'This insight may have been unpublished or removed.'}</p>
          <button type="button" onClick={() => navigate('/insights')} style={{ padding: '10px 20px', background: C.accent, color: C.accentTxt, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Back to insights
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', paddingTop: 24, paddingBottom: 80 }}>
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Link to="/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 32 }}>
            <ArrowLeft size={14} /> All insights
          </Link>

          {item.category && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.accent, marginBottom: 12 }}>
              <Tag size={12} /> {item.category}
            </span>
          )}

          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{item.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.muted, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            <Calendar size={14} />
            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {item.coverImage && (
            <div style={{ marginBottom: 32, borderRadius: 12, overflow: 'hidden' }}>
              <img src={item.coverImage} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
          )}

          {item.summary && (
            <p style={{ fontSize: 18, color: C.muted, fontStyle: 'italic', margin: '0 0 32px', lineHeight: 1.6 }}>{item.summary}</p>
          )}

          <div style={{ fontSize: 16, lineHeight: 1.75, color: C.text, whiteSpace: 'pre-wrap' }}>{item.body}</div>
        </article>
      </div>
    </PageShell>
  );
}

export default function Insights() {
  const { id } = useParams();
  return id ? <InsightDetail /> : <InsightList />;
}