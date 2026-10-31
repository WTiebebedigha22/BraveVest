import { useState } from 'react';
import { Mail, CheckCircle, Clock, Search, Inbox } from 'lucide-react';

const MESSAGES = [
  { id: 1, from: 'Adaeze Nwosu', email: 'adaeze@example.com', subject: 'KYC verification stuck', preview: 'My KYC has been under review for 4 days now...', time: '2h ago', read: false, status: 'open' },
  { id: 2, from: 'Emeka Obi', email: 'emeka.obi@gmail.com', subject: 'Withdrawal to wrong account', preview: 'I just withdrew ₦50,000 but entered a wrong...', time: '4h ago', read: false, status: 'open' },
  { id: 3, from: 'Funmilayo Adebayo', email: 'funmi.a@yahoo.com', subject: 'Question about Lagos Solar', preview: 'Can I invest more than ₦500,000 in this deal?', time: '1d ago', read: true, status: 'open' },
  { id: 4, from: 'Chinedu Eze', email: 'chinedu.eze@outlook.com', subject: 'Portfolio statement request', preview: 'I need my statement for tax purposes for 2025...', time: '1d ago', read: true, status: 'resolved' },
  { id: 5, from: 'Ngozi Okafor', email: 'ngozi@example.com', subject: 'Diaspora investment', preview: 'I am based in the UK — can I fund with GBP?', time: '2d ago', read: true, status: 'resolved' },
  { id: 6, from: 'Tunde Bakare', email: 'tunde.b@gmail.com', subject: 'Password reset', preview: 'Cannot log in — password reset link expired', time: '2d ago', read: true, status: 'resolved' },
];

export default function ContactInbox() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(MESSAGES[0]);

  const filtered = MESSAGES.filter(m => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'open' && m.status !== 'open') return false;
    if (filter === 'resolved' && m.status !== 'resolved') return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = MESSAGES.filter(m => !m.read).length;

  return (
    <div style={{ padding: '48px 0', minHeight: '100vh', background: 'var(--bybit-black)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--bybit-orange)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Admin</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '8px 0 4px' }}>
              Contact Inbox {unreadCount > 0 && <span style={{ background: 'var(--bybit-orange)', color: '#fff', fontSize: '12px', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px', verticalAlign: 'middle' }}>{unreadCount}</span>}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--bybit-text-muted)', margin: 0 }}>Support messages from users.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* List */}
          <div style={{ background: 'var(--bybit-surface)', border: '1px solid var(--bybit-border)', borderRadius: '12px', overflow: 'hidden' }}>
            
            {/* Toolbar */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--bybit-border)' }}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={16} color="var(--bybit-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages"
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bybit-black)', border: '1px solid var(--bybit-border)', borderRadius: '6px', fontSize: '13px', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[{ id: 'all', label: 'All' }, { id: 'unread', label: 'Unread' }, { id: 'open', label: 'Open' }, { id: 'resolved', label: 'Resolved' }].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{ padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: 'none', background: filter === f.id ? 'rgba(246,165,0,0.15)' : 'var(--bybit-black)', color: filter === f.id ? 'var(--bybit-orange)' : 'var(--bybit-text-muted)', fontFamily: 'inherit' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filtered.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelected(m)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--bybit-border)',
                    cursor: 'pointer',
                    background: selected.id === m.id ? 'var(--bybit-surface-2)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {!m.read && <span style={{ width: '6px', height: '6px', background: 'var(--bybit-orange)', borderRadius: '50%' }} />}
                      <span style={{ fontSize: '14px', fontWeight: m.read ? '500' : '600', color: '#fff' }}>{m.from}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--bybit-text-muted)', whiteSpace: 'nowrap' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff', marginBottom: '4px' }}>{m.subject}</div>
                  <div style={{ fontSize: '12px', color: 'var(--bybit-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div style={{ background: 'var(--bybit-surface)', border: '1px solid var(--bybit-border)', borderRadius: '12px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              {selected.status === 'open' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', background: 'rgba(246,165,0,0.15)', color: 'var(--bybit-orange)', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  <Clock size={10} /> Open
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', background: 'rgba(14,203,129,0.15)', color: 'var(--bybit-green)', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  <CheckCircle size={10} /> Resolved
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--bybit-text-muted)' }}>{selected.time}</span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{selected.subject}</h2>
            <div style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', marginBottom: '20px' }}>
              From <span style={{ color: '#fff', fontWeight: '500' }}>{selected.from}</span> &lt;{selected.email}&gt;
            </div>

            <div style={{ background: 'var(--bybit-black)', borderRadius: '8px', padding: '20px', fontSize: '14px', color: 'var(--bybit-text)', lineHeight: 1.7, marginBottom: '20px', border: '1px solid var(--bybit-border)' }}>
              {selected.preview} Please advise on next steps.
            </div>

            <div style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--bybit-text-muted)' }}>Reply</div>
            <textarea
              rows={4}
              placeholder="Type your response..."
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bybit-black)', border: '1px solid var(--bybit-border)', borderRadius: '8px', fontSize: '14px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '10px 20px', background: 'var(--bybit-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Reply
              </button>
              <button style={{ padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid var(--bybit-border)', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
