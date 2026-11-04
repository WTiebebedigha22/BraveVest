import { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';

export default function AdminContactInbox() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.contactList().then(r => setItems(r || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <h1 style={{ margin: 0, fontSize: '24px', marginBottom: '4px' }}>Contact Inbox</h1>
        <p style={{ color: 'var(--bybit-text-muted)', margin: '0 0 24px', fontSize: '13px' }}>{items.length} messages</p>

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>No messages yet</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {items.map(m => (
              <div key={m.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{m.name} <span style={{ fontSize: '12px', color: 'var(--bybit-text-muted)', fontWeight: 'normal' }}>&lt;{m.email}&gt;</span></div>
                    <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>{m.subject}</div>
                  </div>
                  <span className="pill">{m.status}</span>
                </div>
                <p style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: 'var(--bybit-text-muted)' }}>{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
