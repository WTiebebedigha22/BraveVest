import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fundingApi } from '../../api/funding';
import FundingCard from '../../components/funding/FundingCard';

const CATEGORIES = ['ALL', 'REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];

export default function FundingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('ALL');
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fundingApi
      .list({ category: category === 'ALL' ? undefined : category, q: q || undefined })
      .then((r) => { if (alive) setItems(r.data?.items ?? r.items ?? []); })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category, q]);

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>Funding opportunities</h1>
          <p style={{ margin: '4px 0 0', color: '#666' }}>Curated opportunities from verified borrowers. Each is a peer-to-peer loan.</p>
        </div>
        <Link to="/funding/new" className="btn btn-primary">Request funding<//Link>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          style={{ padding: '10px 14px', border: '1px solid #e3e3e3', borderRadius: 999, minWidth: 200, flex: '1 1 200px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #e3e3e3', borderRadius: 999 }}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: '#b71c1c' }}>Couldn’t load: {error.message}</div>}
      {!loading && !error && items.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>No published opportunities yet.</div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginTop: 24,
        }}
      >
        {items.map((it) => <FundingCard key={it.id} request={it} />)}
      </div>
    </div>
  );
}
