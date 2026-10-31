import { useState } from 'react';
import { Search, Star, Zap, Building2, Sprout, Briefcase, Sun } from 'lucide-react';

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
    <div style={{ padding: '32px 0', background: '#FAFAFA', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Header & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#111' }}>Markets</h1>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search deals" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', fontSize: '14px', color: '#111', outline: 'none' }} 
            />
          </div>
        </div>

        {/* Main Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #EAEAEA' }}>
          {MAIN_TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setMainTab(tab)} 
              style={{ 
                padding: '12px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                background: mainTab === tab ? '#fff' : 'transparent',
                color: mainTab === tab ? '#111' : '#666',
                border: mainTab === tab ? '1px solid #EAEAEA' : '1px solid transparent',
                borderBottom: mainTab === tab ? '1px solid #fff' : '1px solid transparent',
                borderRadius: '8px 8px 0 0', marginBottom: '-1px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inner Content Box */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '0 8px 8px 8px', padding: '32px' }}>
          
          {/* Sub Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #EAEAEA', marginBottom: '24px' }}>
            {SUB_TABS.map(tab => (
              <button 
                key={tab} 
                onClick={() => setSubTab(tab)}
                style={{ 
                  padding: '0 0 16px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none',
                  color: subTab === tab ? '#111' : '#888',
                  borderBottom: subTab === tab ? '2px solid #F6A500' : '2px solid transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {FILTER_TAGS.map(tag => (
              <button 
                key={tag} 
                onClick={() => setFilter(tag)}
                style={{ 
                  padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: 'none',
                  background: filter === tag ? 'rgba(246,165,0,0.1)' : '#F5F5F5',
                  color: filter === tag ? '#F6A500' : '#666'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Info Banner */}
          <div style={{ background: '#F8F8F8', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
              All Active Private Credit Deals on BraveVest
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
              Explore vetted, collateralized lending opportunities. View live funding progress, expected yields, and risk ratings, sortable by any column.
            </div>
          </div>

          {/* Table Header */}
          <div style={{ display: 'flex', fontSize: '13px', color: '#888', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA', marginBottom: '8px' }}>
            <span style={{ flex: 1, fontWeight: '500' }}>Asset / Project</span>
            <span style={{ width: '200px', fontWeight: '500' }}>Tags</span>
            <span style={{ width: '150px', textAlign: 'right', fontWeight: '500' }}>Expected Yield / Tenor</span>
          </div>

          {/* Market List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredMarkets.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>No active deals found.</div>
            ) : (
              filteredMarkets.map((asset) => (
                <div key={asset.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #EAEAEA', cursor: 'pointer' }} className="market-row">
                  <div style={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
                    <Star 
                      size={20} 
                      color={starred.includes(asset.id) ? '#F6A500' : '#CCC'} 
                      fill={starred.includes(asset.id) ? '#F6A500' : 'none'} 
                      onClick={(e) => { e.stopPropagation(); toggleStar(asset.id); }} 
                    />
                  </div>
                  
                  <div style={{ width: '40px', height: '40px', background: asset.color, borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                    {asset.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>{asset.title}</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{asset.type} · Min ₦{asset.min.toLocaleString()}</div>
                  </div>
                  
                  <div style={{ width: '200px', display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(246,165,0,0.1)', color: '#F6A500', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Risk {asset.risk}</span>
                    <span style={{ background: 'rgba(14,203,129,0.1)', color: '#0ECB81', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{asset.tenor}</span>
                  </div>
                  
                  <div style={{ width: '150px', textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>{asset.apy}</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: asset.funded > 80 ? '#F6465D' : '#0ECB81' }}>{asset.funded}% Funded</div>
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
