import { useEffect, useState } from 'react';
import { Copy, Users, Gift } from 'lucide-react';
import { referralsApi } from '@/api/referrals';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/context/CurrencyContext';

export default function Referral() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    referralsApi.me().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  const code = data?.code || (user?.email ? user.email.split('@')[0].toUpperCase() : 'BV' + Date.now().toString(36).toUpperCase());
  const link = window.location.origin + '/#/register?ref=' + code;

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const stats = data?.stats || { referrals: data?.referredUsers?.length || 0, earnings: data?.totalEarned || 0 };

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Referrals</h1>
          <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Invite friends and earn rewards</p>
        </div>

        <div className="card" style={{ marginBottom: '24px', padding: '32px', background: 'linear-gradient(135deg, var(--bybit-surface), var(--bybit-surface-2))' }}>
          <Gift size={32} color="var(--bybit-orange)" style={{ marginBottom: '12px' }} />
          <h2 style={{ margin: '0 0 8px', fontSize: '22px' }}>Earn ₦2,000 per referral</h2>
          <p style={{ color: 'var(--bybit-text-muted)', fontSize: '13px', marginBottom: '24px' }}>
            Share your link. When a friend invests for the first time, you both earn.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              value={link}
              readOnly
              style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', minWidth: '240px' }}
              onFocus={(e) => e.target.select()}
            />
            <button onClick={copyLink} className="btn btn--primary">
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--bybit-text-muted)' }}>
            Your code: <strong style={{ fontFamily: 'monospace', color: 'var(--bybit-orange)' }}>{code}</strong>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="data-label">Referrals</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{loading ? '—' : stats.referrals}</div>
          </div>
          <div className="card">
            <div className="data-label">Total Earned</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px', color: 'var(--bybit-orange)' }}>
              {loading ? '—' : format(stats.earnings)}
            </div>
          </div>
        </div>

        {data?.referredUsers?.length > 0 && (
          <div className="card" style={{ padding: 0, marginTop: '24px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bybit-border)' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Your Referrals</h3>
            </div>
            <table className="fin-table">
              <thead>
                <tr><th>User</th><th>Joined</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.referredUsers.map(r => (
                  <tr key={r.id}>
                    <td>{r.email || r.name || '—'}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                    <td><span className="pill">{r.status || 'PENDING'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
