import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commitmentsApi } from '../../api/commitments';
import { fundingApi } from '../../api/funding';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/funding/StatusBadge';

function fmt(n, currency = 'NGN') {
  return `${currency} ${Number(n || 0).toLocaleString()}`;
}

function hasRole(user, ...roles) {
  if (!user) return false;
  const list = Array.isArray(user.roles) && user.roles.length ? user.roles : (user.role ? [user.role] : []);
  return roles.some((r) => list.includes(r));
}

export default function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode] = useState('investing');
  const [commitments, setCommitments] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      commitmentsApi.mine().catch(() => ({ data: [] })),
      hasRole(user, 'BORROWER', 'ADMIN', 'SUPER_ADMIN')
        ? fundingApi.mine().catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] }),
    ]).then(([c, r]) => {
      if (!alive) return;
      setCommitments(c.data ?? c ?? []);
      setMyRequests(r.data ?? r ?? []);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [user]);

  const canBorrow = hasRole(user, 'BORROWER', 'ADMIN', 'SUPER_ADMIN');
  const hasInvesting = commitments.length > 0;
  const hasBorrowing = myRequests.length > 0;
  const showToggle = canBorrow || hasBorrowing;

  useEffect(() => {
    if (!hasInvesting && hasBorrowing) setMode('credit');
  }, [hasInvesting, hasBorrowing]);

  const totalCommitted = commitments.reduce((s, c) => s + Number(c.amount || 0), 0);
  const activeCommitments = commitments.filter((c) => c.status === 'CONFIRMED').length;

  const totalRequested = myRequests.reduce((s, r) => s + Number(r.amountRequested || 0), 0);
  const totalFunded = myRequests.reduce((s, r) => s + Number(r.amountFunded || 0), 0);
  const activeRequests = myRequests.filter((r) => !['CANCELLED', 'REJECTED', 'CLOSED'].includes(r.status)).length;

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Dashboard</h1>

      {showToggle && (
        <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: '#f0f0f0', borderRadius: 999, margin: '20px 0' }}>
          {['investing', 'credit'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '8px 18px', borderRadius: 999, border: 0, cursor: 'pointer',
                background: mode === m ? '#1b5e20' : 'transparent',
                color: mode === m ? '#fff' : '#333',
                fontWeight: 600, fontSize: 13, 
              }}
            >
              {m === 'credit' ? 'Credit' : 'Investing'}</button>
          ))}
        </div>
      )}

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}

      {!loading && mode === 'investing' && (
        <>
          {!hasInvesting ? (
            <Empty
              title="You haven’t committed to anything yet"
              body="Back a funding request to start building your portfolio."
              cta={{ to: '/funding', label: 'Browse opportunities' }}
            />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
                <Card label="Total committed" value={fmt(totalCommitted)} />
                <Card label="Active commitments" value={activeCommitments} />
              </div>

              <h2 style={{ fontSize: 18 }}>Recent commitments</h2>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {commitments.slice(0, 5).map((c) => (
                  <Row
                    key={c.id}
                    to={`/funding/${c.request?.id}`}
                    title={c.request?.title ?? '—'}
                    meta={`${fmt(c.amount, c.currency)} · ${c.status}`}
                  />
                ))}
              </div>

              <Link to="/commitments" className="btn">View all commitments</Link>
            </>
          )}
        </>
      )}

      {!loading && mode === 'credit' && (
        <>
          {!hasBorrowing && !canBorrow ? (
            <Empty title="You’re not set up for credit yet" body="Contact support to enable credit on your account." />
          ) : !hasBorrowing ? (
            <Empty
              title="No credit requests yet"
              body="Submit a request to raise capital from investors."
              cta={{ to: '/funding/new', label: 'Create a credit request' }}
            />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
                <Card label="Total requested" value={fmt(totalRequested)} />
                <Card label="Total funded" value={fmt(totalFunded)} />
                <Card label="Active requests" value={activeRequests} />
              </div>

              <h2 style={{ fontSize: 18 }}>Your requests</h2>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {myRequests.slice(0, 5).map((r) => (
                  <Row
                    key={r.id}
                    to={`/funding/${r.id}`}
                    title={r.title}
                    meta={`${fmt(r.amountRequested, r.currency)} · ${r.status}`}
                    badge={<StatusBadge status={r.status} />}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link to="/funding/mine" className="btn">View all requests</Link>
                {canBorrow && <Link to="/funding/new" className="btn btn-primary">New request</Link>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div style={{ padding: '18px 20px', border: '1px solid #e3e3e3', borderRadius: 14, background: '#fff' }}>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Row({ to, title, meta, badge }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, border: '1px solid #e3e3e3', borderRadius: 12, background: '#fff', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
          <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{meta}</div>
        </div>
        {badge}
      </div>
    </Link>
  );
}

function Empty({ title, body, cta }) {
  return (
    <div style={{ padding: 60, textAlign: 'center', border: '1px dashed #ddd', borderRadius: 16, marginTop: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
      {body && <div style={{ color: '#888', marginTop: 6 }}>{body}</div>}
      {cta && <Link to={cta.to} className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>{cta.label}</Link>}
    </div>
  );
}
