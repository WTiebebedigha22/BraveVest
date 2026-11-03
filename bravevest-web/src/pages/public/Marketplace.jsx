import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Zap, Building2, Sprout, Briefcase, Sun, ChevronRight } from 'lucide-react';

const MAIN_TABS = ['Favorites', 'Private Credit', 'Real Estate'];
const SUB_TABS = ['Active Deals', 'Funding', 'Closed'];
const FILTER_TAGS = ['All', 'Low Risk', 'High Yield', 'Agri', 'Energy', 'SME'];

const DEMO_MARKETS = [
  { id: 1, slug: 'lagos-solar-fund-ii', title: 'Lagos Solar Fund II', type: 'Energy', apy: '14.5%', tenor: '18 mo', risk: 'A', funded: 72, min: 50000, icon: <Sun size={18} />, color: '#F6A500', starred: true },
  { id: 2, slug: 'abuja-real-estate-note', title: 'Abuja Real Estate Note', type: 'Real Estate', apy: '12.0%', tenor: '24 mo', risk: 'AA', funded: 45, min: 100000, icon: <Building2 size={18} />, color: '#2775CA', starred: true },
  { id: 3, slug: 'ogun-agri-cooperative', title: 'Ogun Agri Cooperative', type: 'Agri', apy: '14.0%', tenor: '12 mo', risk: 'BBB', funded: 88, min: 25000, icon: <Sprout size={18} />, color: '#0ECB81', starred: false },
  { id: 4, slug: 'sme-trade-finance', title: 'SME Trade Finance', type: 'SME', apy: '16.5%', tenor: '6 mo', risk: 'BB', funded: 34, min: 5000, icon: <Briefcase size={18} />, color: '#F6465D', starred: false },
  { id: 5, slug: 'kano-agro-processing', title: 'Kano Agro Processing', type: 'Agri', apy: '15.0%', tenor: '12 mo', risk: 'BBB', funded: 91, min: 10000, icon: <Sprout size={18} />, color: '#0ECB81', starred: false },
  { id: 6, slug: 'port-harcourt-logistics', title: 'Port Harcourt Logistics', type: 'Energy', apy: '17.5%', tenor: '18 mo', risk: 'B', funded: 22, min: 50000, icon: <Zap size={18} />, color: '#F6A500', starred: true },
  { id: 7, slug: 'lekki-phase-1-reit', title: 'Lekki Phase 1 REIT', type: 'Real Estate', apy: '13.5%', tenor: '24 mo', risk: 'A', funded: 60, min: 200000, icon: <Building2 size={18} />, color: '#2775CA', starred: false },
  { id: 8, slug: 'retail-sme-growth', title: 'Retail SME Growth', type: 'SME', apy: '18.0%', tenor: '9 mo', risk: 'BB', funded: 15, min: 5000, icon: <Briefcase size={18} />, color: '#F6465D', starred: false },
  { id: 9, slug: 'kaduna-solar-grid', title: 'Kaduna Solar Grid', type: 'Energy', apy: '15.5%', tenor: '36 mo', risk: 'A', funded: 50, min: 25000, icon: <Sun size={18} />, color: '#F6A500', starred: false },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('Private Credit');
  const [subTab, setSubTab] = useState('Active Deals');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [starred, setStarred] = useState([1, 2, 6]);

  const toggleStar = (id) => {
    setStarred(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredMarkets = DEMO_MARKETS.filter(m => {
    if (mainTab === 'Favorites' && !starred.includes(m.id)) return false;
    if (mainTab === 'Real Estate' && m.type !== 'Real Estate') return false;
    if (mainTab === 'Private Credit' && m.type === 'Real Estate') return false;
    if (filter !== 'All' && m.type !== filter && m.risk !== filter) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="marketplace">
      <style>{`
        .marketplace {
          background: #FAFAFA;
          min-height: 100vh;
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          padding: clamp(12px, 3vw, 48px) clamp(12px, 3vw, 24px);
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .marketplace *,
        .marketplace *::before,
        .marketplace *::after {
          box-sizing: border-box;
        }

        .marketplace__container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* ---------- Header ---------- */
        .marketplace__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(16px, 2.5vw, 24px);
          gap: 12px;
          flex-wrap: wrap;
        }

        .marketplace__title {
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 700;
          margin: 0;
          color: #111;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .marketplace__search-wrapper {
          position: relative;
          width: 300px;
          max-width: 100%;
          flex-shrink: 0;
        }

        .marketplace__search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #888;
          display: flex;
        }

        .marketplace__search {
          padding: 11px 16px 11px 42px;
          border: 1px solid #EAEAEA;
          border-radius: 9999px;
          font-size: 14px;
          width: 100%;
          outline: none;
          background: #fff;
          color: #111;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          -webkit-appearance: none;
          appearance: none;
          line-height: 1.4;
          min-height: 44px;
        }
        .marketplace__search:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.06);
        }
        .marketplace__search::placeholder {
          color: #999;
        }

        /* ---------- Main Tabs ---------- */
        .marketplace__main-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 0;
          border-bottom: 1px solid #EAEAEA;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          position: relative;
        }
        .marketplace__main-tabs::-webkit-scrollbar { display: none; }

        .marketplace__main-tab {
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          background: transparent;
          color: #666;
          border: 1px solid transparent;
          border-bottom: 1px solid transparent;
          border-radius: 8px 8px 0 0;
          margin-bottom: -1px;
          transition: color 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          line-height: 1.3;
          font-family: inherit;
        }
        .marketplace__main-tab:active { transform: scale(0.98); }
        .marketplace__main-tab--active {
          background: #fff;
          color: #111;
          border-color: #EAEAEA;
          border-bottom-color: #fff;
        }

        /* ---------- Inner Content Box ---------- */
        .marketplace__box {
          background: #fff;
          border: 1px solid #EAEAEA;
          border-radius: 0 12px 12px 12px;
          padding: clamp(14px, 2.5vw, 32px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        /* ---------- Sub Tabs ---------- */
        .marketplace__sub-tabs {
          display: flex;
          gap: clamp(14px, 3vw, 20px);
          border-bottom: 1px solid #EAEAEA;
          margin-bottom: clamp(16px, 2.5vw, 24px);
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .marketplace__sub-tabs::-webkit-scrollbar { display: none; }

        .marketplace__sub-tab {
          padding: 0 0 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
          white-space: nowrap;
          color: #888;
          border-bottom: 2px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          line-height: 1.3;
          font-family: inherit;
        }
        .marketplace__sub-tab--active {
          color: #111;
          border-bottom-color: #F6A500;
        }

        /* ---------- Filter Tags ---------- */
        .marketplace__filters {
          display: flex;
          gap: 8px;
          margin-bottom: clamp(18px, 2.5vw, 28px);
          flex-wrap: wrap;
        }

        .marketplace__filter-tag {
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: #F5F5F5;
          color: #666;
          transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
          -webkit-tap-highlight-color: transparent;
          line-height: 1.3;
          white-space: nowrap;
          font-family: inherit;
        }
        .marketplace__filter-tag:active { transform: scale(0.96); }
        .marketplace__filter-tag--active {
          background: rgba(246, 165, 0, 0.12);
          color: #B87800;
        }

        /* ---------- Info Banner ---------- */
        .marketplace__banner {
          background: #F8F9FA;
          border-radius: 10px;
          padding: clamp(14px, 2vw, 20px);
          margin-bottom: clamp(18px, 2.5vw, 28px);
          border: 1px solid #EFEFEF;
        }
        .marketplace__banner-title {
          font-size: clamp(14px, 1.6vw, 15px);
          font-weight: 600;
          color: #111;
          margin-bottom: 6px;
          line-height: 1.35;
        }
        .marketplace__banner-text {
          font-size: clamp(12.5px, 1.4vw, 13.5px);
          color: #666;
          line-height: 1.5;
        }

        /* ---------- Desktop Header ---------- */
        .market-desktop-header {
          display: flex;
          font-size: 13px;
          color: #888;
          padding: 0 16px 12px;
          border-bottom: 1px solid #EAEAEA;
          margin-bottom: 8px;
        }

        /* ---------- Market Row (now a Link) ---------- */
        .market-row {
          display: flex;
          align-items: center;
          padding: 18px 16px;
          border-bottom: 1px solid #EAEAEA;
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-radius: 8px;
          -webkit-tap-highlight-color: transparent;
          gap: 0;
          text-decoration: none;
          color: inherit;
        }
        .market-row:hover { background-color: #F8F9FA; }
        .market-row:last-child { border-bottom: none; }
        .market-row:active { background-color: #F1F3F5; }
        .market-row:focus-visible {
          outline: 2px solid #111;
          outline-offset: -2px;
          background-color: #F8F9FA;
        }

        .market-row__main {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 12px;
          min-width: 0;
        }

        .market-row__star {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          padding: 4px;
          margin: -4px;
          border-radius: 6px;
          transition: background 0.15s ease;
        }
        .market-row__star:hover { background: rgba(246, 165, 0, 0.08); }

        .market-row__icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .market-row__info {
          flex: 1;
          min-width: 0;
        }

        .market-row__title {
          font-size: 15px;
          font-weight: 600;
          color: #111;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .market-row__meta {
          font-size: 12.5px;
          color: #888;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .market-row__tags {
          width: 180px;
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;
        }

        .market-row__tag {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
          line-height: 1.4;
        }
        .market-row__tag--risk {
          background: rgba(246, 165, 0, 0.1);
          color: #B87800;
        }
        .market-row__tag--tenor {
          background: rgba(14, 203, 129, 0.1);
          color: #099250;
        }

        .market-row__yield {
          width: 160px;
          text-align: right;
          flex-shrink: 0;
        }
        .market-row__apy {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }
        .market-row__funded {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.3;
        }
        .market-row__funded--high { color: #F6465D; }
        .market-row__funded--ok { color: #099250; }

        .market-row__chevron { display: none; }

        /* ---------- Empty State ---------- */
        .marketplace__empty {
          text-align: center;
          padding: clamp(40px, 8vw, 60px) 16px;
        }
        .marketplace__empty h3 {
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(20px, 3vw, 26px);
          margin: 0 0 8px;
          color: #111;
        }
        .marketplace__empty p {
          color: #888;
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 768px) {
          .market-desktop-header { display: none; }

          .marketplace__header {
            flex-direction: column;
            align-items: stretch;
          }

          .marketplace__search-wrapper {
            width: 100%;
          }

          .marketplace__main-tabs {
            border-bottom: none;
            gap: 6px;
            margin-bottom: 12px;
            padding-bottom: 2px;
          }

          .marketplace__main-tab {
            border-radius: 9999px;
            border: 1px solid #EAEAEA;
            background: #fff;
            margin-bottom: 0;
            padding: 9px 16px;
            font-size: 13.5px;
          }
          .marketplace__main-tab--active {
            background: #111;
            color: #fff;
            border-color: #111;
          }

          .marketplace__box {
            border-radius: 12px;
          }

          .market-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
            background: #fff;
            border: 1px solid #EAEAEA;
            margin-bottom: 12px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          }
          .market-row:last-child { margin-bottom: 0; }
          .market-row:hover { background-color: #fff; }
          .market-row:focus-visible {
            outline-offset: 2px;
          }

          .market-row__main {
            width: 100%;
            gap: 10px;
          }

          .market-row__icon {
            width: 36px;
            height: 36px;
          }

          .market-row__title {
            font-size: 14.5px;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .market-row__meta {
            font-size: 12px;
            white-space: normal;
          }

          .market-row__tags {
            width: 100%;
            justify-content: flex-start;
            padding-top: 2px;
          }

          .market-row__yield {
            width: 100%;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px solid #F1F1F1;
          }

          .market-row__yield-inner {
            display: flex;
            align-items: baseline;
            gap: 10px;
          }

          .market-row__apy {
            font-size: 17px;
          }

          .market-row__chevron {
            display: flex;
            color: #CCC;
            flex-shrink: 0;
          }
        }

        /* ---------- Small phones ---------- */
        @media (max-width: 380px) {
          .marketplace__main-tab {
            padding: 8px 13px;
            font-size: 13px;
          }
          .marketplace__filter-tag {
            padding: 6px 11px;
            font-size: 12px;
          }
          .market-row__title { font-size: 14px; }
          .market-row__apy { font-size: 16px; }
        }

        /* ---------- Reduced motion ---------- */
        @media (prefers-reduced-motion: reduce) {
          .marketplace *,
          .marketplace *::before,
          .marketplace *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }

        /* ---------- Large screens ---------- */
        @media (min-width: 1400px) {
          .marketplace__container { max-width: 1280px; }
        }
      `}</style>

      <div className="marketplace__container">

        {/* Header & Search */}
        <div className="marketplace__header">
          <h1 className="marketplace__title">Markets</h1>
          <div className="marketplace__search-wrapper">
            <span className="marketplace__search-icon">
              <Search size={18} />
            </span>
            <input
              type="search"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="marketplace__search"
              aria-label="Search deals"
            />
          </div>
        </div>

        {/* Main Tabs */}
        <div className="marketplace__main-tabs" role="tablist" aria-label="Main categories">
          {MAIN_TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={mainTab === tab}
              onClick={() => setMainTab(tab)}
              className={`marketplace__main-tab ${mainTab === tab ? 'marketplace__main-tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inner Content Box */}
        <div className="marketplace__box">

          {/* Sub Tabs */}
          <div className="marketplace__sub-tabs" role="tablist" aria-label="Deal status">
            {SUB_TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={subTab === tab}
                onClick={() => setSubTab(tab)}
                className={`marketplace__sub-tab ${subTab === tab ? 'marketplace__sub-tab--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Tags */}
          <div className="marketplace__filters" role="group" aria-label="Filter deals">
            {FILTER_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                aria-pressed={filter === tag}
                className={`marketplace__filter-tag ${filter === tag ? 'marketplace__filter-tag--active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Info Banner */}
          <div className="marketplace__banner">
            <div className="marketplace__banner-title">
              All Active Private Credit Deals on BraveVest
            </div>
            <div className="marketplace__banner-text">
              Explore vetted, collateralized lending opportunities. View live funding progress, expected yields, and risk ratings.
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="market-desktop-header">
            <span style={{ flex: 1, fontWeight: 500 }}>Asset / Project</span>
            <span style={{ width: 180, fontWeight: 500 }}>Tags & Risk</span>
            <span style={{ width: 160, textAlign: 'right', fontWeight: 500 }}>Expected Yield / Tenor</span>
          </div>

          {/* Market List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredMarkets.length === 0 ? (
              <div className="marketplace__empty">
                <h3>No active deals found</h3>
                <p>Try adjusting your search criteria or filter tags.</p>
              </div>
            ) : (
              filteredMarkets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/marketplace/${asset.slug}`}
                  className="market-row"
                  aria-label={`View details for ${asset.title}`}
                >

                  {/* Main: Star + Icon + Title */}
                  <div className="market-row__main">
                    <div
                      className="market-row__star"
                      onClick={(e) => {
                        // Prevent row navigation when toggling star
                        e.preventDefault();
                        e.stopPropagation();
                        toggleStar(asset.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStar(asset.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={starred.includes(asset.id) ? `Remove ${asset.title} from favorites` : `Add ${asset.title} to favorites`}
                      aria-pressed={starred.includes(asset.id)}
                    >
                      <Star
                        size={18}
                        color={starred.includes(asset.id) ? '#F6A500' : '#CCC'}
                        fill={starred.includes(asset.id) ? '#F6A500' : 'none'}
                        style={{ cursor: 'pointer', display: 'block' }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="market-row__icon" style={{ background: asset.color }} aria-hidden="true">
                      {asset.icon}
                    </div>

                    <div className="market-row__info">
                      <div className="market-row__title">{asset.title}</div>
                      <div className="market-row__meta">
                        {asset.type} · Min ₦{asset.min.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="market-row__tags">
                    <span className="market-row__tag market-row__tag--risk">Risk {asset.risk}</span>
                    <span className="market-row__tag market-row__tag--tenor">{asset.tenor}</span>
                  </div>

                  {/* Yield & Funding */}
                  <div className="market-row__yield">
                    <div className="market-row__yield-inner">
                      <div className="market-row__apy">{asset.apy}</div>
                      <div className={`market-row__funded ${asset.funded > 80 ? 'market-row__funded--high' : 'market-row__funded--ok'}`}>
                        {asset.funded}% Funded
                      </div>
                    </div>
                    <ChevronRight size={18} className="market-row__chevron" aria-hidden="true" />
                  </div>

                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}