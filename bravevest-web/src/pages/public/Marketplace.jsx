import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, AlertCircle, Loader2, ChevronRight, Sun, Building2, Sprout, Briefcase, Zap } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PageShell from '@/components/shared/PageShell';

const MAIN_TABS = ['All Deals', 'Private Credit', 'Real Estate', 'Favorites'];
const CATEGORIES = ['Energy', 'Real Estate', 'Agriculture', 'SME', 'Infrastructure'];
const CATEGORY_ICON = { Energy: Sun, 'Real Estate': Building2, Agriculture: Sprout, SME: Briefcase, Infrastructure: Zap };
const CATEGORY_COLOR = { Energy: '#F6A500', 'Real Estate': '#2775CA', Agriculture: '#0ECB81', SME: '#F6465D', Infrastructure: '#8B5CF6' };

export default function Marketplace() {
  const { format } = useCurrency();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainTab, setMainTab] = useState('All Deals');
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [starred, setStarred] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bv_favorites') || '[]');
      if (Array.isArray(saved)) setStarred(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('bv_favorites', JSON.stringify(starred)); } catch {}
  }, [starred]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/projects');
        const list = Array.isArray(data) ? data : (data && data.projects) || [];
        if (!cancelled) setProjects(list);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load projects.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function toggleStar(id) {
    setStarred((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  const filtered = useMemo(() => {
    let list = projects;
    if (mainTab === 'Favorites') list = list.filter((p) => starred.includes(p.id));
    if (mainTab === 'Real Estate') list = list.filter((p) => p.category === 'REAL_ESTATE' || p.category === 'Real Estate');
    if (mainTab === 'Private Credit') list = list.filter((p) => p.category !== 'REAL_ESTATE' && p.category !== 'Real Estate');
    if (category) list = list.filter((p) => p.category === category || p.category === category.toUpperCase().replace(' ', '_'));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => (p.title || p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
    }
    return list;
  }, [projects, mainTab, category, search, starred]);

  return (
    <PageShell theme='dark' ticker>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Markets</h1>
            <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
              <Search size={18} color='var(--text-muted)' style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search deals…' style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9999, fontSize: 14, color: 'var(--text)', outline: 'none' }} />
            </div>
          </div>
          <div className='bv-fade-up' style={{ display: 'flex', gap: 4, marginBottom: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {MAIN_TABS.map((tab) => (
              <button key={tab} onClick={() => setMainTab(tab)} style={{ padding: '12px 16px', background: mainTab === tab ? 'var(--surface)' : 'transparent', color: mainTab === tab ? 'var(--text)' : 'var(--text-muted)', border: '1px solid ' + (mainTab === tab ? 'var(--border)' : 'transparent'), borderBottom: '1px solid ' + (mainTab === tab ? 'var(--surface)' : 'transparent'), borderRadius: '10px 10px 0 0', marginBottom: -1, fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0 16px 16px 16px', padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <button onClick={() => setCategory(null)} style={{ padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: !category ? 'rgba(246,165,0,0.12)' : 'var(--bg-soft)', color: !category ? '#B87800' : 'var(--text-muted)', fontFamily: 'inherit' }}>All</button>
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategory(category === cat ? null : cat)} style={{ padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: category === cat ? 'rgba(246,165,0,0.12)' : 'var(--bg-soft)', color: category === cat ? '#B87800' : 'var(--text-muted)', fontFamily: 'inherit' }}>
                  {cat}
                </button>
              ))}
            </div>
            {loading ? (
              <div style={{ padding: 48, display: 'flex', gap: 12, color: 'var(--text-muted)' }}><Loader2 size={20} /> Loading projects…</div>
            ) : error ? (
              <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', borderRadius: 12, color: '#F6465D', display: 'flex', gap: 12 }}><AlertCircle size={20} /> {error}</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 16px' }}>
                <h3 style={{ fontSize: 24, margin: '0 0 8px', fontFamily: 'Playfair Display, Georgia, serif' }}>No deals found</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', fontSize: 13, color: 'var(--text-muted)', padding: '0 16px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                  <span style={{ flex: 1, fontWeight: 500 }}>Project</span>
                  <span style={{ width: 200, fontWeight: 500 }}>Risk / Tenor</span>
                  <span style={{ width: 160, textAlign: 'right', fontWeight: 500 }}>Yield / Funded</span>
                  <span style={{ width: 32 }} />
                </div>
                {filtered.map((project) => {
                  const cat = project.category || 'Other';
                  const displayCat = cat === 'REAL_ESTATE' ? 'Real Estate' : cat === 'AGRICULTURE' ? 'Agriculture' : cat;
                  const Icon = CATEGORY_ICON[displayCat] || Briefcase;
                  const color = CATEGORY_COLOR[displayCat] || '#F6A500';
                  const raised = Number(project.raisedAmount || 0);
                  const target = Number(project.targetAmount || 0);
                  const funded = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
                  const rate = project.expectedReturnPct || 0;
                  const tenor = project.tenorMonths || 12;
                  const isStarred = starred.includes(project.id);
                  const slug = project.slug || project.id;
                  return (
                    <Link key={project.id} to={'/marketplace/' + slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 16px', borderBottom: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
                      <button type='button' onClick={(e) => { e.preventDefault(); toggleStar(project.id); }} aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                        <Star size={18} color={isStarred ? '#F6A500' : '#666'} fill={isStarred ? '#F6A500' : 'none'} />
                      </button>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title || project.name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{displayCat} · Min {format(project.minInvestment || 5000)}</div>
                      </div>
                      <div style={{ width: 200, display: 'flex', gap: 6, flexShrink: 0 }}>
                        {project.riskLevel && <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 600, background: 'rgba(246,165,0,0.12)', color: '#B87800' }}>Risk {project.riskLevel}</span>}
                        <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 600, background: 'rgba(14,203,129,0.1)', color: '#099250' }}>{tenor}mo</span>
                      </div>
                      <div style={{ width: 160, textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{rate}%</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: funded > 80 ? '#F6465D' : '#099250' }}>{funded}% funded</div>
                      </div>
                      <ChevronRight size={18} color='var(--text-muted)' style={{ flexShrink: 0 }} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
