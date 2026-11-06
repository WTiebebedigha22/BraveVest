import { useEffect, useState } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2, Mail, CreditCard, Globe, Shield } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const SECTIONS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'smtp', label: 'Email / SMTP', icon: Mail },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Settings() {
  const [section, setSection] = useState('general');
  const [form, setForm] = useState({
    platformName: 'BraveVest',
    supportEmail: 'support@bravevest.com',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: true,
    paystackPublicKey: '',
    paystackSecretKey: '',
    paystackWebhookSecret: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    kycRequired: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ kind: '', text: '' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/admin/settings').catch(() => null);
        if (!cancelled && data) setForm((prev) => ({ ...prev, ...data }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg({ kind: '', text: '' });
    setSaving(true);
    try {
      await apiFetch('/admin/settings', { method: 'PATCH', body: form });
      setMsg({ kind: 'success', text: 'Settings saved.' });
    } catch (err) {
      setMsg({ kind: 'error', text: err && err.message ? err.message : 'Could not save.' });
    } finally {
      setSaving(false);
    }
  }

  const input = { padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'inherit' };
  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 16, color: 'var(--text)' };

  if (loading) {
    return (
      <PortalLayout theme="dark">
        <div style={{ padding: 96, display: 'flex', gap: 12, color: 'var(--text-muted)' }}>
          <Loader2 size={20} /> Loading settings…
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 className='bv-fade-up' style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 24px' }}>Settings</h1>

          <div className='bv-fade-up' style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto' }}>
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button key={s.id} onClick={() => setSection(s.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 18px', background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  border: '1px solid ' + (active ? 'var(--border)' : 'transparent'),
                  borderBottom: '1px solid ' + (active ? 'var(--surface)' : 'transparent'),
                  borderRadius: '10px 10px 0 0', marginBottom: -1,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                }}>
                  <Icon size={16} /> {s.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={save} className='bv-card-lift bv-fade-up' style={{ padding: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            {msg.kind && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: msg.kind === 'error' ? 'rgba(246,70,93,0.1)' : 'rgba(14,203,129,0.1)', border: '1px solid ' + (msg.kind === 'error' ? 'rgba(246,70,93,0.25)' : 'rgba(14,203,129,0.25)'), borderRadius: 8, color: msg.kind === 'error' ? '#F6465D' : '#0ECB81', fontSize: 13, marginBottom: 20 }}>
                {msg.kind === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />} {msg.text}
              </div>
            )}

            {section === 'general' && (
              <>
                <label style={label}>Platform name<input type='text' value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} style={input} /></label>
                <label style={label}>Support email<input type='email' value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} style={input} /></label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 12, cursor: 'pointer' }}>
                  <input type='checkbox' checked={form.kycRequired} onChange={(e) => setForm({ ...form, kycRequired: e.target.checked })} />
                  Require KYC before investing
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                  <input type='checkbox' checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
                  Maintenance mode
                </label>
              </>
            )}

            {section === 'smtp' && (
              <>
                <label style={label}>SMTP host<input type='text' value={form.smtpHost} onChange={(e) => setForm({ ...form, smtpHost: e.target.value })} placeholder='smtp.gmail.com' style={input} /></label>
                <label style={label}>SMTP port<input type='text' value={form.smtpPort} onChange={(e) => setForm({ ...form, smtpPort: e.target.value })} placeholder='587' style={input} /></label>
                <label style={label}>SMTP username<input type='text' value={form.smtpUser} onChange={(e) => setForm({ ...form, smtpUser: e.target.value })} style={input} /></label>
                <label style={label}>SMTP password<input type='password' value={form.smtpPass} onChange={(e) => setForm({ ...form, smtpPass: e.target.value })} style={input} /></label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                  <input type='checkbox' checked={form.smtpSecure} onChange={(e) => setForm({ ...form, smtpSecure: e.target.checked })} />
                  Use TLS/SSL
                </label>
              </>
            )}

            {section === 'payments' && (
              <>
                <label style={label}>Paystack public key<input type='text' value={form.paystackPublicKey} onChange={(e) => setForm({ ...form, paystackPublicKey: e.target.value })} placeholder='pk_test_...' style={input} /></label>
                <label style={label}>Paystack secret key<input type='password' value={form.paystackSecretKey} onChange={(e) => setForm({ ...form, paystackSecretKey: e.target.value })} placeholder='sk_test_...' style={input} /></label>
                <label style={label}>Paystack webhook secret<input type='password' value={form.paystackWebhookSecret} onChange={(e) => setForm({ ...form, paystackWebhookSecret: e.target.value })} style={input} /></label>
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>Bank transfer details</h3>
                  <label style={label}>Bank name<input type='text' value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} style={input} /></label>
                  <label style={label}>Account name<input type='text' value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} style={input} /></label>
                  <label style={label}>Account number<input type='text' value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} style={input} /></label>
                </div>
              </>
            )}

            {section === 'security' && (
              <>
                <div style={{ padding: 16, background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>Security notes:</strong> All secrets stored encrypted. Never commit them to git.
                  Use environment variables in production. Rotate Paystack keys quarterly.
                </div>
              </>
            )}

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button type='submit' disabled={saving} className='bv-pill bv-pill--primary'>
                {saving ? <Loader2 size={14} /> : <Save size={14} />} {saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </PortalLayout>
  );
}
