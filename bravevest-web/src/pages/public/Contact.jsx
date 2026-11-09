import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PageShell from '@/components/shared/PageShell';

const CSS = `
.ct { --ct-bg:#FFFFFF; --ct-card:#F9F9FB; --ct-card2:#F5F5F7; --ct-line:#E4E4E9; --ct-text:#121214; --ct-mute:#6B6B76; --ct-yellow:#F7A600; --ct-amber:#C27C00; --ct-green:#0E9F5B;
  background:var(--ct-bg); color:var(--ct-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; }
.ct * { box-sizing:border-box; }
.ct-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }

/* Hero Banner with Dark Overlay */
.ct-hero { position:relative; overflow:hidden; padding:96px 0 80px; background-color:#121214; color:#FFFFFF; text-align:center; }
.ct-hero-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.35; filter:brightness(0.8); }
.ct-hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(18,18,20,0.6) 0%, rgba(18,18,20,0.85) 100%); }
.ct-hero .ct-wrap { position:relative; z-index:2; max-width:760px; }
.ct-chip { display:inline-flex; padding:6px 14px; border-radius:6px; background:rgba(247,166,0,0.15); border:1px solid rgba(247,166,0,0.3); font-size:13px; font-weight:700; color:var(--ct-yellow); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:16px; }
.ct-hero h1 { font-size:clamp(38px, 5.5vw, 60px); font-weight:800; letter-spacing:-0.035em; margin:0 0 16px; line-height:1.08; }
.ct-hero h1 em { font-style:normal; color:var(--ct-yellow); }
.ct-hero p { font-size:clamp(16px, 1.8vw, 18px); color:#D1D5DB; line-height:1.6; margin:0; }

/* Contact Body Grid */
.ct-body { padding:72px 0 96px; background:var(--ct-bg); }
.ct-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:40px; align-items:flex-start; }
.ct-form-card { background:var(--ct-card); border:1px solid var(--ct-line); border-radius:20px; padding:36px; box-shadow:0 12px 32px -12px rgba(18,18,20,0.06); }
.ct-form-card h2 { font-size:22px; font-weight:800; margin:0 0 24px; color:var(--ct-text); }
.ct-field { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--ct-text); margin-bottom:20px; }
.ct-input, .ct-textarea { width:100%; padding:14px 16px; background:#FFFFFF; border:1px solid var(--ct-line); border-radius:10px; font-size:14px; color:var(--ct-text); font-family:inherit; outline:none; transition:border-color .2s, box-shadow .2s; }
.ct-input:focus, .ct-textarea:focus { border-color:var(--ct-yellow); box-shadow:0 0 0 3px rgba(247,166,0,0.15); }
.ct-textarea { resize:vertical; min-height:130px; }
.ct-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; height:52px; padding:0 32px; border-radius:10px; font-weight:700; font-size:15px; text-decoration:none; border:0; cursor:pointer; background:var(--ct-yellow); color:#121214; transition:background .15s, transform .15s; box-shadow:0 8px 20px -6px rgba(247,166,0,0.5); }
.ct-btn:hover { background:#FFB82E; transform:translateY(-1px); }
.ct-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }

.ct-banner { display:flex; gap:12px; align-items:flex-start; padding:14px 16px; border-radius:10px; font-size:13px; margin-bottom:24px; font-weight:500; }
.ct-banner--err { background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.2); color:#DC2626; }
.ct-banner--ok { background:rgba(14,159,91,0.08); border:1px solid rgba(14,159,91,0.2); color:var(--ct-green); }

.ct-info-list { display:flex; flex-direction:column; gap:16px; }
.ct-info-card { background:var(--ct-card); border:1px solid var(--ct-line); border-radius:16px; padding:24px; display:flex; gap:16px; align-items:flex-start; transition:border-color .2s, transform .2s; }
.ct-info-card:hover { border-color:var(--ct-yellow); transform:translateY(-2px); }
.ct-info-ic { width:46px; height:46px; border-radius:12px; background:rgba(247,166,0,0.15); color:var(--ct-amber); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.ct-info-lbl { font-size:12px; font-weight:600; color:var(--ct-mute); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; }
.ct-info-val { font-size:15px; font-weight:700; color:var(--ct-text); text-decoration:none; }
.ct-info-val:hover { color:var(--ct-amber); }

@media (max-width:900px) { .ct-grid { grid-template-columns:1fr; gap:32px; } .ct-hero { padding:72px 0 60px; } }
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
      <div className="ct">
        {/* Hero Section with Professional Financial Background & Dark Overlay */}
        <section className="ct-hero">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="Corporate office building" 
            className="ct-hero-bg" 
          />
          <div className="ct-hero-overlay" />
          <div className="ct-wrap">
            <span className="ct-chip">Support &amp; Inquiries</span>
            <h1>Get in <em>touch</em></h1>
            <p>
              Questions about investing, KYC verification, or specific private credit opportunities? Our dedicated support team responds within 2 hours on business days.
            </p>
          </div>
        </section>

        {/* Contact Content Grid */}
        <section className="ct-body">
          <div className="ct-wrap">
            <div className="ct-grid">
              
              {/* Form Card */}
              <div className="ct-form-card">
                <h2>Send us a message</h2>

                {err && (
                  <div className="ct-banner ct-banner--err" role="alert">
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>{err}</div>
                  </div>
                )}
                {sent && (
                  <div className="ct-banner ct-banner--ok" role="status">
                    <CheckCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>Message sent successfully. We'll respond within 2 hours.</div>
                  </div>
                )}

                <form onSubmit={submit}>
                  <label className="ct-field">
                    Full Name
                    <input
                      className="ct-input"
                      type="text"
                      placeholder="e.g. Adebayo Johnson"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="ct-field">
                    Email Address
                    <input
                      className="ct-input"
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </label>
                  <label className="ct-field">
                    Subject
                    <input
                      className="ct-input"
                      type="text"
                      placeholder="e.g. Private Credit Inquiry (Optional)"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </label>
                  <label className="ct-field">
                    Message
                    <textarea
                      className="ct-textarea"
                      placeholder="How can our investment advisory team help you today?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </label>
                  <button type="submit" className="ct-btn" disabled={sending}>
                    {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
                    {sending ? 'Sending message…' : 'Send Message'}
                  </button>
                  <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
                </form>
              </div>

              {/* Info Cards */}
              <div className="ct-info-list">
                {[
                  { icon: Mail, label: 'Email Support', value: 'support@bravevest.com', href: 'mailto:support@bravevest.com' },
                  { icon: Phone, label: 'Direct Line', value: '+234 800 BRAVEST', href: 'tel:+234800272837' },
                  { icon: MapPin, label: 'Headquarters', value: 'Victoria Island, Lagos, Nigeria' },
                  { icon: Clock, label: 'Business Hours', value: 'Monday – Friday, 9am – 6pm WAT' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="ct-info-card">
                    <div className="ct-info-ic"><Icon size={22} /></div>
                    <div>
                      <div className="ct-info-lbl">{label}</div>
                      {href ? (
                        <a href={href} className="ct-info-val">{value}</a>
                      ) : (
                        <div className="ct-info-val">{value}</div>
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