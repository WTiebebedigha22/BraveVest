import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { riskCategory, riskColor } from '@/lib/format';
import {
  Search,
  Star,
  AlertCircle,
  Loader2,
  ChevronRight,
  Sun,
  Building2,
  Sprout,
  Briefcase,
  Zap,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PageShell from '@/components/shared/PageShell';

const MAIN_TABS = ['All Deals', 'Private Credit', 'Real Estate', 'Favorites'];
const CATEGORIES = ['Energy', 'Real Estate', 'Agriculture', 'SME', 'Infrastructure'];
const CATEGORY_ICON = {
  Energy: Sun,
  'Real Estate': Building2,
  Agriculture: Sprout,
  SME: Briefcase,
  Infrastructure: Zap,
};
const CATEGORY_COLOR = {
  Energy: 'var(--bv-accent)',
  'Real Estate': '#2775CA',
  Agriculture: 'var(--bv-success)',
  SME: 'var(--bv-danger)',
  Infrastructure: '#7C3AED',
};

export default function Marketplace() {
  const { format } = useCurrency();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainTab, setMainTab] = useState('All Deals');
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [starred, setStarred] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('yield-desc'); // 'yield-desc', 'funded-desc'

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bv_favorites') || '[]');
      if (Array.isArray(saved)) setStarred(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bv_favorites', JSON.stringify(starred));
    } catch {}
  }, [starred]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/projects');
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.items)
              ? data.data.items
              : Array.isArray(data?.items)
                ? data.items
                : [];
        if (!cancelled) setProjects(list);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load projects.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleStar(id) {
    setStarred((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const filtered = useMemo(() => {
    let list = projects;
    if (mainTab === 'Favorites') list = list.filter((p) => starred.includes(p.id));
    if (mainTab === 'Real Estate')
      list = list.filter((p) => p.category === 'REAL_ESTATE' || p.category === 'Real Estate');
    if (mainTab === 'Private Credit')
      list = list.filter((p) => p.category !== 'REAL_ESTATE' && p.category !== 'Real Estate');
    if (category)
      list = list.filter(
        (p) => p.category === category || p.category === category.toUpperCase().replace(' ', '_')
      );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || p.name || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'yield-desc') return (b.expectedReturnPct || 0) - (a.expectedReturnPct || 0);
      if (sortBy === 'funded-desc') {
        const fundedA = a.raisedAmount / (a.targetAmount || 1) || 0;
        const fundedB = b.raisedAmount / (b.targetAmount || 1) || 0;
        return fundedB - fundedA;
      }
      return 0;
    });
  }, [projects, mainTab, category, search, starred, sortBy]);

  return (
    <PageShell theme="light" ticker>
      <style>{`
        .market-root {
          background-color: var(--bv-bg-elevated);
          color: var(--bv-text);
          min-height: 100vh;
        }
        .market-card {
          background: var(--bv-bg-elevated);
          border: 1px solid var(--bv-border);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .market-card:hover {
          transform: translateY(-3px);
          border-color: #F7A600;
          box-shadow: 0 16px 36px -12px rgba(18,18,20,0.12);
        }
        .tab-pill {
          transition: all 0.2s ease;
        }
        .tab-pill:hover {
          background: var(--bv-bg-elevated);
        }
      `}</style>

      <div className="market-root">
        <section style={{ padding: '48px 20px 96px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Header & Search */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 32,
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(32px, 4.5vw, 44px)',
                    fontWeight: 800,
                    margin: '0 0 6px',
                    letterSpacing: '-0.03em',
                    color: 'var(--bv-text)',
                  }}
                >
                  Explore Marketplace
                </h1>
                <p style={{ color: 'var(--bv-text-muted)', fontSize: 15, margin: 0 }}>
                  Discover vetted institutional credit and high-yield asset opportunities.
                </p>
              </div>
              <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
                <Search
                  size={18}
                  color="var(--bv-text-muted)"
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search deals, sectors..."
                  style={{
                    width: '100%',
                    padding: '13px 18px 13px 46px',
                    background: 'var(--bv-bg-elevated)',
                    border: '1px solid var(--bv-border)',
                    borderRadius: 12,
                    fontSize: 14,
                    color: 'var(--bv-text)',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F7A600';
                    e.target.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--bv-border)';
                    e.target.style.background = 'var(--bv-surface)';
                  }}
                />
              </div>
            </div>

            {/* Main Category Tabs & View Options */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--bv-border)',
                marginBottom: 28,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 0 }}>
                {MAIN_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMainTab(tab)}
                    className="tab-pill"
                    style={{
                      padding: '12px 20px',
                      background: mainTab === tab ? 'var(--bv-bg-elevated)' : 'transparent',
                      color: mainTab === tab ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      border: '1px solid ' + (mainTab === tab ? 'var(--bv-border)' : 'transparent'),
                      borderBottom: '2px solid ' + (mainTab === tab ? '#F7A600' : 'transparent'),
                      borderRadius: '10px 10px 0 0',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'inherit',
                    }}
                  >
                    {tab} {tab === 'Favorites' && `(${starred.length})`}
                  </button>
                ))}
              </div>

              {/* View Toggle & Sorting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bv-bg-elevated)',
                    border: '1px solid var(--bv-border)',
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  <button
                    onClick={() => setSortBy('yield-desc')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      background: sortBy === 'yield-desc' ? 'var(--bv-surface)' : 'transparent',
                      color: sortBy === 'yield-desc' ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUpDown size={13} /> Highest Yield
                  </button>
                  <button
                    onClick={() => setSortBy('funded-desc')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      background: sortBy === 'funded-desc' ? 'var(--bv-surface)' : 'transparent',
                      color: sortBy === 'funded-desc' ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Most Funded
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bv-bg-elevated)',
                    border: '1px solid var(--bv-border)',
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    style={{
                      padding: 6,
                      background: viewMode === 'grid' ? 'var(--bv-surface)' : 'transparent',
                      color: viewMode === 'grid' ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                    style={{
                      padding: 6,
                      background: viewMode === 'list' ? 'var(--bv-surface)' : 'transparent',
                      color: viewMode === 'list' ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-Category Filter Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 28,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: 'var(--bv-text-muted)',
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                <SlidersHorizontal size={14} /> Filter:
              </span>
              <button
                onClick={() => setCategory(null)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid ' + (!category ? '#F7A600' : 'var(--bv-border)'),
                  background: !category ? 'var(--bv-surface)' : 'var(--bv-surface)',
                  color: !category ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                All Sectors
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? null : cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid ' + (category === cat ? '#F7A600' : 'var(--bv-border)'),
                    background: category === cat ? 'var(--bv-surface)' : 'var(--bv-surface)',
                    color: category === cat ? 'var(--bv-accent)' : 'var(--bv-text-muted)',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {loading ? (
              <div
                style={{
                  padding: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  color: 'var(--bv-text-muted)',
                }}
              >
                <Loader2 size={32} className="animate-spin" color="#F7A600" />
                <span style={{ fontSize: 15, fontWeight: 500 }}>
                  Loading live investment deals...
                </span>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: 24,
                  background: 'color-mix(in srgb, var(--bv-danger) 8%, transparent)',
                  borderRadius: 16,
                  color: 'var(--bv-danger)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  border: '1px solid color-mix(in srgb, var(--bv-danger) 20%, transparent)',
                }}
              >
                <AlertCircle size={22} /> <span>{error}</span>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  background: 'var(--bv-bg-elevated)',
                  borderRadius: 20,
                  border: '1px solid var(--bv-border)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--bv-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--bv-accent)',
                  }}
                >
                  <Search size={28} />
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    margin: '0 0 8px',
                    fontWeight: 700,
                    color: 'var(--bv-text)',
                  }}
                >
                  No deals matched your criteria
                </h3>
                <p style={{ color: 'var(--bv-text-muted)', margin: '0 0 20px', fontSize: 14 }}>
                  Try clearing your search query or selecting a different sector filter.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory(null);
                    setMainTab('All Deals');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#F7A600',
                    color: 'var(--bv-text)',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* --- GRID VIEW --- */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: 24,
                }}
              >
                {filtered.map((project) => {
                  const cat = project.category || 'Other';
                  const displayCat =
                    cat === 'REAL_ESTATE'
                      ? 'Real Estate'
                      : cat === 'AGRICULTURE'
                        ? 'Agriculture'
                        : cat;
                  const Icon = CATEGORY_ICON[displayCat] || Briefcase;
                  const color = CATEGORY_COLOR[displayCat] || 'var(--bv-accent)';
                  const raised = Number(project.raisedAmount || 0);
                  const target = Number(project.targetAmount || 0);
                  const funded =
                    target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
                  const rate = project.expectedReturnPct || 0;
                  const tenor = project.tenorMonths || 12;
                  const isStarred = starred.includes(project.id);
                  const slug = project.slug || project.id;

                  return (
                    <div
                      key={project.id}
                      className="market-card"
                      style={{
                        borderRadius: 20,
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                      }}
                    >
                      <div>
                        {/* Card Top Row */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 16,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: color,
                                color: 'var(--bv-bg-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 20px -4px ${color}44`,
                              }}
                            >
                              <Icon size={20} />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: 'var(--bv-text-muted)',
                                }}
                              >
                                {displayCat}
                              </span>
                              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                                {project.riskLevel && (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: 'var(--bv-accent)',
                                      background: 'var(--bv-surface)',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                    }}
                                  >
                                    Risk {project.riskLevel}
                                  </span>
                                )}
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: 'var(--bv-success)',
                                    background:
                                      'color-mix(in srgb, var(--bv-success) 10%, transparent)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                  }}
                                >
                                  {tenor} Mo Tenor
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleStar(project.id)}
                            aria-label="Favorite"
                            style={{
                              background: 'var(--bv-bg-elevated)',
                              border: '1px solid var(--bv-border)',
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Star
                              size={16}
                              color={isStarred ? '#F7A600' : 'var(--bv-text-muted)'}
                              fill={isStarred ? '#F7A600' : 'none'}
                            />
                          </button>
                        </div>

                        {/* Title */}
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            margin: '0 0 8px',
                            lineHeight: 1.3,
                            color: 'var(--bv-text)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.title || project.name}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: 'var(--bv-text-muted)',
                            margin: '0 0 20px',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.description ||
                            'Secure fixed-income asset opportunity backed by verified commercial underwriting.'}
                        </p>

                        {/* Metrics Box */}
                        <div
                          style={{
                            background: 'var(--bv-bg-elevated)',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 20,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 12,
                            border: '1px solid var(--bv-border)',
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: 11,
                                color: 'var(--bv-text-muted)',
                                display: 'block',
                                marginBottom: 2,
                              }}
                            >
                              Expected Yield
                            </span>
                            <span
                              style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: 'var(--bv-success)',
                                letterSpacing: '-0.02em',
                              }}
                            >
                              {rate}% <span style={{ fontSize: 12, fontWeight: 600 }}>APY</span>
                            </span>
                          </div>
                          <div>
                            <span
                              style={{
                                fontSize: 11,
                                color: 'var(--bv-text-muted)',
                                display: 'block',
                                marginBottom: 2,
                              }}
                            >
                              Min. Investment
                            </span>
                            <span
                              style={{ fontSize: 16, fontWeight: 700, color: 'var(--bv-text)' }}
                            >
                              {format(project.minInvestment || 5000)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: 20 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: 12,
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                          >
                            <span style={{ color: 'var(--bv-text-muted)' }}>Funding Progress</span>
                            <span
                              style={{
                                color: funded >= 100 ? 'var(--bv-success)' : 'var(--bv-text)',
                              }}
                            >
                              {funded}% Funded
                            </span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: 6,
                              background: 'var(--bv-border)',
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${funded}%`,
                                height: '100%',
                                background:
                                  funded >= 100
                                    ? 'var(--bv-success)'
                                    : 'linear-gradient(90deg, #F7A600, #FFC94D)',
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={'/marketplace/' + slug}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          padding: '12px 20px',
                          background: 'var(--bv-bg-elevated)',
                          border: '1px solid var(--bv-border)',
                          borderRadius: 12,
                          textDecoration: 'none',
                          color: 'var(--bv-text)',
                          fontWeight: 700,
                          fontSize: 14,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F7A600';
                          e.currentTarget.style.color = 'var(--bv-text)';
                          e.currentTarget.style.borderColor = '#F7A600';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bv-surface)';
                          e.currentTarget.style.color = 'var(--bv-text)';
                          e.currentTarget.style.borderColor = 'var(--bv-border)';
                        }}
                      >
                        View Opportunity <ChevronRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- LIST VIEW --- */
              <div
                style={{
                  background: 'var(--bv-bg-elevated)',
                  border: '1px solid var(--bv-border)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px -10px rgba(18,18,20,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--bv-text-muted)',
                    padding: '16px 24px',
                    background: 'var(--bv-bg-elevated)',
                    borderBottom: '1px solid var(--bv-border)',
                  }}
                >
                  <span style={{ flex: 1 }}>Opportunity</span>
                  <span style={{ width: 160 }}>Sector / Tenor</span>
                  <span style={{ width: 140 }}>Risk Profile</span>
                  <span style={{ width: 140, textAlign: 'right' }}>Target Yield</span>
                  <span style={{ width: 120, textAlign: 'right' }}>Progress</span>
                  <span style={{ width: 40 }} />
                </div>
                {filtered.map((project) => {
                  const cat = project.category || 'Other';
                  const displayCat =
                    cat === 'REAL_ESTATE'
                      ? 'Real Estate'
                      : cat === 'AGRICULTURE'
                        ? 'Agriculture'
                        : cat;
                  const Icon = CATEGORY_ICON[displayCat] || Briefcase;
                  const color = CATEGORY_COLOR[displayCat] || 'var(--bv-accent)';
                  const raised = Number(project.raisedAmount || 0);
                  const target = Number(project.targetAmount || 0);
                  const funded =
                    target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
                  const rate = project.expectedReturnPct || 0;
                  const tenor = project.tenorMonths || 12;
                  const isStarred = starred.includes(project.id);
                  const slug = project.slug || project.id;

                  return (
                    <Link
                      key={project.id}
                      to={'/marketplace/' + slug}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '18px 24px',
                        borderBottom: '1px solid var(--bv-border)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--bv-bg-elevated)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleStar(project.id);
                          }}
                          aria-label="Favorite"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                          }}
                        >
                          <Star
                            size={18}
                            color={isStarred ? '#F7A600' : 'var(--bv-text-muted)'}
                            fill={isStarred ? '#F7A600' : 'none'}
                          />
                        </button>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: color,
                            color: 'var(--bv-bg-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              marginBottom: 2,
                              color: 'var(--bv-text)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {project.title || project.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                            Min: {format(project.minInvestment || 5000)}
                          </div>
                        </div>
                      </div>

                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bv-text)' }}>
                          {displayCat}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>
                          {tenor} months tenor
                        </div>
                      </div>

                      <div style={{ width: 140, flexShrink: 0 }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            background: 'var(--bv-surface)',
                            color: 'var(--bv-accent)',
                          }}
                        >
                          Risk: {riskCategory(project.riskLevel || 'A')}
                        </span>
                      </div>

                      <div style={{ width: 140, textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bv-success)' }}>
                          {rate}% APY
                        </div>
                      </div>

                      <div style={{ width: 120, textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bv-text)' }}>
                          {funded}%
                        </div>
                        <div
                          style={{
                            width: 80,
                            height: 4,
                            background: 'var(--bv-border)',
                            borderRadius: 99,
                            marginLeft: 'auto',
                            marginTop: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${funded}%`,
                              height: '100%',
                              background: 'var(--bv-success)',
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          width: 40,
                          display: 'flex',
                          justifyContent: 'flex-end',
                          flexShrink: 0,
                          color: 'var(--bv-text-muted)',
                        }}
                      >
                        <ChevronRight size={18} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
