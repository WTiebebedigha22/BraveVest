import { useState } from 'react';
import { Search, Star, Zap, Building2, Sprout, Briefcase, Sun, ChevronRight } from 'lucide-react';

const MAIN_TABS = ['Favorites', 'Private Credit', 'Real Estate'];
const SUB_TABS = ['Active Deals', 'Funding', 'Closed'];
const FILTER_TAGS = ['All', 'Low Risk', 'High Yield', 'Agri', 'Energy', 'SME'];

const DEMO_MARKETS = [
  { id: 1, title: 'Lagos Solar Fund II', type: 'Energy', apy: '14.5%', tenor: '18 mo', risk: 'A', funded: 72, min: 50000, icon: <Sun size={18} />, color: '#F6A500', starred: true },
  { id: 2, title: 'Abuja Real Estate Note', type: 'Real Estate', apy: '12.0%', tenor: '24 mo', risk: 'AA', funded: 45, min: 100000, icon: <Building2 size={18} />, color: '#2775CA', starred: true },
  { id: 3, title: 'Ogun Agri Cooperative', type: 'Agri', apy: '14.0%', tenor: '12 mo', risk: 'BBB', funded: 88, min: 25000, icon: <Sprout size={18} />, color: '#0ECB81', starred: false },
  { id: 4, title: 'SME Trade Finance', type: 'SME', apy: '16.5%', tenor: '6 mo', risk: 'BB', funded: 34, min: 5000, icon: <Briefcase size={18} />, color: '#F6465D', starred: false },
  { id: 5, title: 'Kano Agro Processing', type: 'Agri', apy: '15.0%', tenor: '12 mo', risk: 'BBB', funded: 91, min: 10000, icon: <Sprout size={18} />, color: '#0ECB81', starred: false },
  { id: 6, title: 'Port Harcourt Logistics', type: 'Energy', apy: '17.5%', tenor: '18 mo', risk: 'B', funded: 22, min: 50000, icon: <Zap size={18} />, color: '#F6A500', starred: true },
  { id: 7, title: 'Lekki Phase 1 REIT', type: 'Real Estate', apy: '13.5%', tenor: '24 mo', risk: 'A', funded: 60, min: 200000, icon: <Building2 size={18} />, color: '#2775CA', starred: false },
  { id: 8, title: 'Retail SME Growth', type: 'SME', apy: '18.0%', tenor: '9 mo', risk: 'BB', funded: 15, min: 5000, icon: <Briefcase size={18} />, color: '#F6465D', starred: false },
  { id: 9, title: 'Kaduna Solar Grid', type: 'Energy', apy: '15.5%', tenor: '36 mo', risk: 'A', funded: 50, min: 25000, icon: <Sun size={18} />, color: '#F6A500', starred: false },
];

export default function Marketplace() {
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
    <div className="marketplace" style={{ background: '#FAFAFA', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        .marketplace { padding: clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px); }
        
        .marketplace__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .marketplace__search-wrapper {
          position: relative;
          width: 300px;
        }

        .marketplace__search {
          padding: 12px 16px 12px 46px;
          border: 1px solid var(--line, #EAEAEA);
          border-radius: var(--r-pill, 9999px);
          font-size: 14px;
          width: 100%;
          outline: none;
          background: #fff;
          color: #111;
          transition: border-color 0.2s ease;
        }
        .marketplace__search:focus { border-color: var(--ink, #111); }

        .marketplace__empty { text-align: center; padding: 60px 0; }
        .marketplace__empty h3 { font-family: var(--font-serif); font-size: 26px; margin-bottom: 8px; }

        /* Main Tabs Scrollable on Mobile */
        .marketplace__main-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--line, #EAEAEA);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .marketplace__main-tabs::-webkit-scrollbar { display: none; }

        /* Table Desktop Layout vs Mobile Flex Card */
        .market-row {
          display: flex;
          align-items: center;
          padding: 20px 16px;
          border-bottom: 1px solid var(--line, #EAEAEA);
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-radius: 8px;
        }
        .market-row:hover {
          background-color: #F8F9FA;
        }

        .market-desktop-header {
          display: flex;
          font-size: 13px;
          color: #888;
          padding: 0 16px 12px;
          border-bottom: 1px solid var(--line, #EAEAEA);
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .market-desktop-header { display: none; }
          .market-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            background: #fff;
            border: 1px solid var(--line, #EAEAEA);
            margin-bottom: 12px;
            border-radius: 12px;
          }
          .marketplace__search-wrapper { width: 100%; }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header & Search */}
        <div className="marketplace__header">
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '700', margin: 0, color: '#111' }}>Markets</h1>
          <div className="marketplace__search-wrapper">
            <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search deals..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="marketplace__search" 
            />
          </div>
        </div>

        {/* Main Tabs */}
        <div className="marketplace__main-tabs">
          {MAIN_TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setMainTab(tab)} 
              style={{ 
                padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                background: mainTab === tab ? '#fff' : 'transparent',
                color: mainTab === tab ? '#111' : '#666',
                border: mainTab === tab ? '1px solid var(--line, #EAEAEA)' : '1px solid transparent',
                borderBottom: mainTab === tab ? '1px solid #fff' : '1px solid transparent',
                borderRadius: '8px 8px 0 0', marginBottom: '-1px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inner Content Box */}
        <div style={{ background: '#fff', border: '1px solid var(--line, #EAEAEA)', borderRadius: '0 12px 12px 12px', padding: 'clamp(16px, 3vw, 32px)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          
          {/* Sub Tabs */}
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--line, #EAEAEA)', marginBottom: '24px', overflowX: 'auto' }}>
            {SUB_TABS.map(tab => (
              <button 
                key={tab} 
                onClick={() => setSubTab(tab)}
                style={{ 
                  padding: '0 0 14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none', whiteSpace: 'nowrap',
                  color: subTab === tab ? '#111' : '#888',
                  borderBottom: subTab === tab ? '2px solid #F6A500' : '2px solid transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {FILTER_TAGS.map(tag => (
              <button 
                key={tag} 
                onClick={() => setFilter(tag)}
                style={{ 
                  padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: 'none',
                  background: filter === tag ? 'rgba(246,165,0,0.12)' : '#F5F5F5',
                  color: filter === tag ? '#B87800' : '#666',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Info Banner */}
          <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '20px', marginBottom: '28px', border: '1px solid #EFEFEF' }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '6px' }}>
              All Active Private Credit Deals on BraveVest
            </div>
            <div style={{ fontSize: '13.5px', color: '#666', lineHeight: 1.5 }}>
              Explore vetted, collateralized lending opportunities. View live funding progress, expected yields, and risk ratings.
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="market-desktop-header">
            <span style={{ flex: 1, fontWeight: '500' }}>Asset / Project</span>
            <span style={{ width: '180px', fontWeight: '500' }}>Tags & Risk</span>
            <span style={{ width: '160px', textAlign: 'right', fontWeight: '500' }}>Expected Yield / Tenor</span>
          </div>

          {/* Market List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredMarkets.length === 0 ? (
              <div className="marketplace__empty">
                <h3>No active deals found</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>Try adjusting your search criteria or filter tags.</p>
              </div>
            ) : (
              filteredMarkets.map((asset) => (
                <div key={asset.id} className="market-row">
                  
                  {/* Top / Left Section: Icon & Details */}
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, width: '100%', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <Star 
                        size={18} 
                        color={starred.includes(asset.id) ? '#F6A500' : '#CCC'} 
                        fill={starred.includes(asset.id) ? '#F6A500' : 'none'} 
                        onClick={(e) => { e.stopPropagation(); toggleStar(asset.id); }} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    
                    <div style={{ width: '40px', height: '40px', background: asset.color, borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {asset.icon}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.title}</div>
                      <div style={{ fontSize: '12.5px', color: '#888' }}>{asset.type} · Min ₦{asset.min.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* Tags Section */}
                  <div style={{ width: '180px', display: 'flex', gap: '6px', alignItems: 'center', width: '100%', justifyContent: 'space-between', '@media (min-width: 768px)': { width: '180px', justifyContent: 'flex-start' } }}>
                    <span style={{ fontSize: '12px', color: '#666', display: 'inline-block', md: { display: 'none' } }} className="mobile-label">Details:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ background: 'rgba(246,165,0,0.1)', color: '#B87800', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600' }}>Risk {asset.risk}</span>
                      <span style={{ background: 'rgba(14,203,129,0.1)', color: '#099250', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600' }}>{asset.tenor}</span>
                    </div>
                  </div>
                  
                  {/* Yield & Funding Section */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #F1F1F1', md: { borderTop: 'none', paddingTop: '0', width: '160px', textAlign: 'right', display: 'block' } }}>
                    <div style={{ fontSize: '12px', color: '#888', display: 'block', '@media(min-width: 768px)': { display: 'none' } }}>Yield / Progress</div>
                    <div style={{ textAlign: 'left', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'block' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{asset.apy}</div>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: asset.funded > 80 ? '#F6465D' : '#099250' }}>{asset.funded}% Funded</div>
                      </div>
                      <ChevronRight size={18} color="#CCC" style={{ display: 'none', '@media(max-width: 768px)': { display: 'block' } }} />
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
