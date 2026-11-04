import { useState } from 'react';
import { Save, Shield, Bell, Globe, Database } from 'lucide-react';

const SECTIONS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Backup', icon: Database },
];

export default function AdminSettings() {
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: '48px 0', minHeight: '100vh', background: 'var(--bybit-black)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--bybit-orange)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
            Admin
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '8px 0 4px' }}>Platform Settings</h1>
          <p style={{ fontSize: '14px', color: 'var(--bybit-text-muted)', margin: 0 }}>Configure platform-wide behavior and policies.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <aside>
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: isActive ? 'var(--bybit-surface)' : 'transparent',
                    border: isActive ? '1px solid var(--bybit-border)' : '1px solid transparent',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#fff' : 'var(--bybit-text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '4px',
                    fontFamily: 'inherit',
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--bybit-orange)' : 'var(--bybit-text-muted)'} />
                  {s.label}
                </button>
              );
            })}
          </aside>

          {/* Content */}
          <div style={{ background: 'var(--bybit-surface)', border: '1px solid var(--bybit-border)', borderRadius: '12px', padding: '28px' }}>
            {active === 'general' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>General</h2>
                <Field label="Platform Name" value="BraveVest" />
                <Field label="Support Email" value="support@bravevest.com" />
                <Field label="Default Currency" value="NGN (₦)" select={['NGN (₦)', 'USD ($)', 'GBP (£)']} />
                <Field label="Timezone" value="Africa/Lagos (WAT)" />
              </div>
            )}
            {active === 'security' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>Security</h2>
                <Toggle label="Require 2FA for all admins" defaultChecked />
                <Toggle label="Enforce password rotation every 90 days" />
                <Toggle label="Lock account after 5 failed attempts" defaultChecked />
                <Toggle label="Allow admin sessions from new IPs" defaultChecked />
              </div>
            )}
            {active === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>Notifications</h2>
                <Toggle label="Email new admin on user registrations" defaultChecked />
                <Toggle label="Alert on failed KYC submissions" defaultChecked />
                <Toggle label="Daily digest of platform activity" defaultChecked />
                <Toggle label="Slack webhook for critical events" />
              </div>
            )}
            {active === 'data' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>Data & Backup</h2>
                <p style={{ fontSize: '13px', color: 'var(--bybit-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Last backup: <span style={{ color: '#fff', fontWeight: '600' }}>Today at 03:00 WAT</span> · 2.4 GB · AWS S3 (eu-west-1)
                </p>
                <button style={{ padding: '10px 20px', background: 'var(--bybit-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Trigger Manual Backup
                </button>
              </div>
            )}

            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--bybit-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={handleSave} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'var(--bybit-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                <Save size={14} /> Save Changes
              </button>
              {saved && <span style={{ fontSize: '13px', color: 'var(--bybit-green)', fontWeight: '500' }}>✓ Saved</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, select }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--bybit-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</label>
      {select ? (
        <select defaultValue={value} style={{ width: '100%', padding: '12px 14px', background: 'var(--bybit-black)', border: '1px solid var(--bybit-border)', borderRadius: '8px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'inherit' }}>
          {select.map(s => <option key={s}>{s}</option>)}
        </select>
      ) : (
        <input defaultValue={value} style={{ width: '100%', padding: '12px 14px', background: 'var(--bybit-black)', border: '1px solid var(--bybit-border)', borderRadius: '8px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
      )}
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--bybit-border)' }}>
      <span style={{ fontSize: '14px', color: '#fff' }}>{label}</span>
      <button onClick={() => setOn(!on)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? 'var(--bybit-orange)' : 'var(--bybit-border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', padding: 0 }}>
        <span style={{ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}
