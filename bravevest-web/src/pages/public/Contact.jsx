import { useState } from 'react';
import { contactApi } from '@/api/contact';
import '@/styles/contact.css';

const SUBJECTS = [
  { value: 'GENERAL', label: 'General enquiry' },
  { value: 'INVESTOR', label: 'I want to invest' },
  { value: 'BORROWER', label: 'I want to request funding' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'PRESS', label: 'Press & media' },
  { value: 'SUPPORT', label: 'Support' },
];

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  subject: 'GENERAL',
  message: '',
  website: '', // honeypot
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  function upd(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject,
        message: form.message.trim(),
        website: form.website,
      });
      setDone(true);
      setForm(INITIAL);
    } catch (err) {
      const d = err?.response?.data;
      setError(d?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-page">
      <header className="contact-hero">
        <h1>Get in touch</h1>
        <p>Questions about investing, funding, or partnering with BraveVest? We read every message.</p>
      </header>

      <div className="contact-grid">
        <section className="contact-form-wrap">
          {done ? (
            <div className="contact-success">
              <h2>Message received</h2>
              <p>Thanks for reaching out. We typically reply within one business day.</p>
              <button className="btn btn-primary" onClick={() => setDone(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {error && <div className="contact-error">{error}</div>}

              <div className="field-row">
                <label>
                  <span>Name *</span>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => upd('name', e.target.value)}
                  />
                </label>
                <label>
                  <span>Email *</span>
                  <input
                    type="email"
                    required
                    maxLength={200}
                    value={form.email}
                    onChange={(e) => upd('email', e.target.value)}
                  />
                </label>
              </div>

              <div className="field-row">
                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    maxLength={30}
                    value={form.phone}
                    onChange={(e) => upd('phone', e.target.value)}
                  />
                </label>
                <label>
                  <span>Subject</span>
                  <select value={form.subject} onChange={(e) => upd('subject', e.target.value)}>
                    {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
              </div>

              <label className="field-full">
                <span>Message *</span>
                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  value={form.message}
                  onChange={(e) => upd('message', e.target.value)}
                />
              </label>

              {/* honeypot — hidden from humans, visible to bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => upd('website', e.target.value)}
                className="contact-honeypot"
                aria-hidden="true"
              />

              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send message'}
              </button>
              <p className="contact-hint">We usually reply within one business day.</p>
            </form>
          )}
        </section>

        <aside className="contact-aside">
          <div className="contact-card">
            <h3>Email</h3>
            <a href="mailto:help@bravevest.com">help@bravevest.com</a>
            <p>For support, questions, or general enquiries.</p>
          </div>
          <div className="contact-card">
            <h3>Investors</h3>
            <a href="mailto:investors@bravevest.com">investors@bravevest.com</a>
            <p>Portfolio questions, onboarding, statements.</p>
          </div>
          <div className="contact-card">
            <h3>Funding</h3>
            <a href="mailto:funding@bravevest.com">funding@bravevest.com</a>
            <p>Credit requests, documentation, repayments.</p>
          </div>
          <div className="contact-card">
            <h3>Office</h3>
            <p>
              BraveVest<br />
              Lagos, Nigeria
            </p>
            <p className="contact-hours">Mon–Fri, 9am–6pm WAT</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
