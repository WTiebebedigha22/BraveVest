import { useEffect, useState } from 'react';
import { contactApi } from '@/api/contact';

const STATUSES = ['ALL', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'];

function fmtDate(s) {
  if (!s) return '';
  return new Date(s).toLocaleString();
}

export default function ContactInbox() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  function reload() {
    setLoading(true);
    contactApi.list({ status: status === 'ALL' ? undefined : status })
      .then((r) => setItems(r.data?.items ?? r.items ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }
  useEffect(reload, [status]);

  async function setMessageStatus(id, next) {
    try {
      await contactApi.update(id, { status: next });
      reload();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  }

  return (
    <div style={{ padding: '32px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, margin: '0 0 4px' }}>Contact inbox</h1>
      <p style={{ color: '#666', margin: '0 0 20px' }}>Messages from the public contact form.</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: '7px 14px', borderRadius: 999, border: '1px solid #e5e7eb',
              background: status === s ? '#1b5e20' : '#fff',
              color: status === s ? '#fff' : '#333',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>}
      {error && <div style={{ padding: 40, textAlign: 'center', color: '#b91c1c' }}>{error.message}</div>}
      {!loading && items.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>No messages.</div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((m) => {
          const open = openId === m.id;
          return (
            <div key={m.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '14px 18px', background: 'transparent',
                  border: 0, cursor: 'pointer', textAlign: 'left', gap: 12, flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name} — {m.subject}</div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                    {m.email} · {fmtDate(m.createdAt)}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                  background: m.status === 'NEW' ? '#e0f2fe' : m.status === 'REPLIED' ? '#e8f5e9' : '#f3f4f6',
                  color: m.status === 'NEW' ? '#075985' : m.status === 'REPLIED' ? '#1b5e20' : '#4b5563',
                }}>{m.status}</span>
              </button>

              {open && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#333', marginTop: 14 }}>{m.message}</p>
                  {m.phone && <p style={{ color: '#666', fontSize: 13 }}>Phone: {m.phone}</p>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    <a
                      className="btn btn-primary"
                      href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}
                      onClick={() => setMessageStatus(m.id, 'REPLIED')}
                    >
                      Reply by email
                    </a>
                    {m.status !== 'READ' && m.status !== 'REPLIED' && (
                      <button className="btn" onClick={() => setMessageStatus(m.id, 'READ')}>Mark read</button>
                    )}
                    {m.status !== 'ARCHIVED' && (
                      <button className="btn" onClick={() => setMessageStatus(m.id, 'ARCHIVED')}>Archive</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
