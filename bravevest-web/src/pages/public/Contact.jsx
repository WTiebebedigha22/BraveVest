import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.by { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.by * { box-sizing:border-box; }
.by-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.by-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:48px; padding:0 28px; border-radius:8px; font-weight:600; font-size:15px; text-decoration:none; border:0; cursor:pointer; transition:background .15s; }
.by-btn--y { background:var(--by-yellow); color:#121214; }
.by-btn--y:hover { background:#FFB82E; }
.by-btn:disabled { opacity:.6; cursor:not-allowed; }
.by-page { padding:72px 0 96px; }
.by-eyebrow { font-size:13px; font-weight:600; color:var(--by-amber); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:12px; }
.by-page h1 { font-size:clamp(36px,5vw,56px); font-weight:800; letter-spacing:-0.03em; margin:0 0 16px; line-height:1.08; }
.by-page h1 em { font-style:normal; color:var(--by-amber); }
.by-page .by-lede { font-size:17px; color:var(--by-mute); line-height:1.6; max-width:600px; margin:0 0 48px; }
.by-contact-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:32px; align-items:flex-start; }
.by-form-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:16px; padding:32px; }
.by-form-card h2 { font-size:20px; font-weight:700; margin:0 0 20px; }
.by-field { display:grid; gap:6px; font-size:13px; font-weight:500; color:var(--by-text); margin-bottom:16px; }
.by-input, .by-textarea { width:100%; padding:12px 14px; background:#FFFFFF; border:1px solid var(--by-line); border-radius:8px; font-size:14px; color:var(--by-text); font-family:inherit; outline:none; transition:border-color .15s; }
.by-input:focus, .by-textarea:focus { border-color:var(--by-yellow); }
.by-textarea { resize:vertical; min-height:120px; }
.by-banner { display:flex; gap:10px; align-items:flex-start; padding:12px 14px; border-radius:8px; font-size:13px; margin-bottom:20px; }
.by-banner--err { background:rgba(192,57,43,.08); border:1px solid rgba(192,57,43,.2); color:#C0392B; }
.by-banner--ok { background:rgba(14,159,91,.08); border:1px solid rgba(14,159,91,.2); color:var(--by-green); }
.by-info-list { display:flex; flex-direction:column; gap:12px; }
.by-info-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:12px; padding:20px; display:flex; gap:14px; align-items:flex-start; transition:border-color .15s; }
.by-info-card:hover { border-color:var(--by-yellow); }
.by-info-ic { width:40px; height:40px; border-radius:10px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.by-info-lbl { font-size:12px; font-weight:500; color:var(--by-mute); margin-bottom:2px; }
.by-info-val { font-size:15px; font-weight:600; color:var(--by-text); text-decoration:none; }
.by-info-val:hover { color:var(--by-amber); }
@media (max-width:900px) { .by-contact-grid { grid-template-columns:1fr; } .by-page { padding:48px 0 64px; } }
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return setErr('Please fill in name, email, and message.');
    }
    setSending(true);
    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || 'General inquiry',
          message: form.message.trim(),
        },
      });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
      setErr(e?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  }

  return (
    <PageShell theme="light" ticker>
      <style>{CSS}</style>
      <div className="by">
        <section className="by-page">
          <div className="by-wrap">
            <div className="by-eyebrow">Contact</div>
            <h1>Get in <em>touch</em></h1>
            <p className="by-lede">
              Questions about investing, KYC, or a specific project? Our team responds within 2 hours on business days.
            </p>

            <div className="by-contact-grid">
              {/* Form */}
              <div className="by-form-card">
                <h2>Send us a message</h2>

                {err && (
                  <div className="by-banner by-banner--err" role="alert">
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>{err}</div>
                  </div>
                )}
                {sent && (
                  <div className="by-banner by-banner--ok">
                    <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>Message sent. We'll respond within 2 hours.</div>
                  </div>
                )}

                <form onSubmit={submit}>
                  <label className="by-field">
                    Name
                    <input
                      className="by-input"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="by-field">
                    Email
                    <input
                      className="by-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </label>
                  <label className="by-field">
                    Subject
                    <input
                      className="by-input"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="by-field">
                    Message
                    <textarea
                      className="by-textarea"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </label>
                  <button type="submit" className="by-btn by-btn--y" disabled={sending}>
                    {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                    {sending ? 'Sending…' : 'Send message'}
                  </button>
                  <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
                </form>
              </div>

              {/* Info cards */}
              <div className="by-info-list">
                {[
                  { icon: Mail, label: 'Email', value: 'support@bravevest.com', href: 'mailto:support@bravevest.com' },
                  { icon: Phone, label: 'Phone', value: '+234 800 BRAVE', href: 'tel:+23480027283' },
                  { icon: MapPin, label: 'Address', value: 'Lagos, Nigeria' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–6pm WAT' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="by-info-card">
                    <div className="by-info-ic"><Icon size={18} /></div>
                    <div>
                      <div className="by-info-lbl">{label}</div>
                      {href ? (
                        <a href={href} className="by-info-val">{value}</a>
                      ) : (
                        <div className="by-info-val">{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}