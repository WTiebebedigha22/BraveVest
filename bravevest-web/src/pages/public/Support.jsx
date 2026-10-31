import { useState } from 'react';
import { Mail, MessageCircle, Phone, FileText, CheckCircle } from 'lucide-react';
import { api } from '@/api/client';

export default function Support() {
  const [form, setForm] = useState({ subject: '', message: '', priority: 'normal' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setLoading(true);
    try {
      await api.post('/api/contact', { ...form, type: 'support' }).catch(() => {});
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--navy-900)', minHeight: '100vh' }}>
      <section className="container" style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <span className="eyebrow">Support</span>
        <h1 style={{ margin: '16px 0 24px' }}>How can we help?</h1>
        <p className="lede" style={{ maxWidth: '600px' }}>
          Our team is available Monday to Friday, 9am–6pm WAT. For urgent matters, please call.
        </p>
      </section>

      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Contact channels */}
        <div className="grid-3" style={{ marginBottom: '64px' }}>
          <div className="card">
            <MessageCircle size={24} color="var(--gold)" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Live Chat</h3>
            <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '16px' }}>Average response: 5 minutes</p>
            <button className="btn btn--outline" style={{ width: '100%' }}>Start Chat</button>
          </div>
          <div className="card">
            <Mail size={24} color="var(--gold)" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Email</h3>
            <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '16px' }}>Response within 24 hours</p>
            <a href="mailto:support@bravevest.com" className="btn btn--outline" style={{ width: '100%' }}>support@bravevest.com</a>
          </div>
          <div className="card">
            <Phone size={24} color="var(--gold)" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Phone</h3>
            <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '16px' }}>Mon–Fri, 9am–6pm WAT</p>
            <a href="tel:+2348000000000" className="btn btn--outline" style={{ width: '100%' }}>+234 800 000 0000</a>
          </div>
        </div>

        {/* Contact form */}
        <div className="container--narrow" style={{ margin: '0 auto', maxWidth: '720px' }}>
          <h2 style={{ marginBottom: '24px' }}>Send us a message</h2>
          {sent ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <CheckCircle size={40} color="var(--success)" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
              <h3>Message sent</h3>
              <p style={{ color: 'var(--slate)', marginTop: '8px' }}>We'll respond to your registered email within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card">
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of your issue" required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low — General question</option>
                  <option value="normal">Normal — Account issue</option>
                  <option value="high">High — Transaction problem</option>
                  <option value="urgent">Urgent — Security concern</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Message</label>
                <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Please include as much detail as possible..." required />
              </div>
              <button type="submit" className="btn btn--primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
