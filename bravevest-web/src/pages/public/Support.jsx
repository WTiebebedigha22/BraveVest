import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageCircle,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { api } from '@/api/client';

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Average response: 5 minutes',
    cta: 'Start Chat',
    href: null,
    chat: true,
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Response within 24 hours',
    cta: 'support@bravevest.com',
    href: 'mailto:support@bravevest.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'Mon–Fri, 9am–6pm WAT',
    cta: '+234 800 000 0000',
    href: 'tel:+2348000000000',
  },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', hint: 'General question' },
  { value: 'normal', label: 'Normal', hint: 'Account issue' },
  { value: 'high', label: 'High', hint: 'Transaction problem' },
  { value: 'urgent', label: 'Urgent', hint: 'Security concern' },
];

export default function Support() {
  const formId = useId();
  const [form, setForm] = useState({ subject: '', message: '', priority: 'normal' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    form.subject.trim().length > 0 && form.message.trim().length > 0 && !loading;

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/api/contact', { ...form, type: 'support' });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again or email support@bravevest.com.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ subject: '', message: '', priority: 'normal' });
    setSent(false);
    setError('');
  }

  return (
    <div className="support">
      <style>{`
        /* =====================================================
           LIGHT MODE (default)
           ===================================================== */
        .support {
          --sp-bg: #ffffff;
          --sp-bg-soft: #f8f9fb;
          --sp-text: #0a1628;
          --sp-text-muted: #5b6472;
          --sp-border: #e6e8ec;
          --sp-border-strong: #d4d8df;
          --sp-card-bg: #ffffff;
          --sp-card-bg-soft: #fafbfc;
          --sp-input-bg: #ffffff;
          --sp-input-border: #d4d8df;
          --sp-placeholder: #9aa3af;
          --sp-gold: #b8860b;
          --sp-gold-soft: rgba(184, 134, 11, 0.10);
          --sp-gold-ring: rgba(184, 134, 11, 0.20);
          --sp-success: #0a8a5c;
          --sp-success-soft: rgba(10, 138, 92, 0.10);
          --sp-danger: #c9293f;
          --sp-danger-soft: rgba(201, 41, 63, 0.08);
          --sp-danger-border: rgba(201, 41, 63, 0.25);
          --sp-shadow: 0 1px 2px rgba(10, 22, 40, 0.04), 0 4px 12px rgba(10, 22, 40, 0.04);
          --sp-shadow-hover: 0 2px 4px rgba(10, 22, 40, 0.06), 0 8px 24px rgba(10, 22, 40, 0.08);

          background: var(--sp-bg-soft);
          min-height: 100vh;
          min-height: 100dvh;
          color: var(--sp-text);
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .support *,
        .support *::before,
        .support *::after { box-sizing: border-box; }

        .support__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 24px);
          width: 100%;
        }

        /* ---------- Back to home ---------- */
        .support__back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px 8px 8px;
          margin: 20px 0 0;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--sp-text-muted);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .support__back:hover {
          color: var(--sp-text);
          background: rgba(10, 22, 40, 0.04);
        }
        .support__back:focus-visible {
          outline: 2px solid var(--sp-gold);
          outline-offset: 2px;
        }
        .support__back svg {
          transition: transform 0.15s ease;
        }
        .support__back:hover svg {
          transform: translateX(-2px);
        }

        /* ---------- Hero ---------- */
        .support__hero {
          border-bottom: 1px solid var(--sp-border);
          padding: clamp(24px, 4vw, 40px) 0 clamp(40px, 6vw, 64px);
          background: var(--sp-bg);
        }
        .support__eyebrow {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--sp-gold);
          background: var(--sp-gold-soft);
          padding: 5px 10px;
          border-radius: 9999px;
          margin-bottom: 14px;
        }
        .support__title {
          margin: 0 0 clamp(12px, 2vw, 16px);
          font-size: clamp(28px, 5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-wrap: balance;
          color: var(--sp-text);
          font-weight: 700;
        }
        .support__lede {
          max-width: 60ch;
          font-size: clamp(14px, 1.8vw, 16.5px);
          line-height: 1.6;
          color: var(--sp-text-muted);
          margin: 0;
        }

        /* ---------- Body ---------- */
        .support__body {
          padding: clamp(40px, 6vw, 60px) 0;
        }

        /* ---------- Channels ---------- */
        .support__channels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: clamp(40px, 6vw, 64px);
        }

        .support__channel {
          display: flex;
          flex-direction: column;
          padding: 24px;
          border: 1px solid var(--sp-border);
          border-radius: 12px;
          background: var(--sp-card-bg);
          box-shadow: var(--sp-shadow);
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .support__channel:hover {
          border-color: var(--sp-border-strong);
          box-shadow: var(--sp-shadow-hover);
          transform: translateY(-1px);
        }

        .support__channel-icon {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--sp-gold-soft);
          color: var(--sp-gold);
          margin-bottom: 16px;
        }

        .support__channel-title {
          font-size: 18px;
          margin: 0 0 6px;
          line-height: 1.3;
          color: var(--sp-text);
          font-weight: 600;
        }
        .support__channel-desc {
          font-size: 13.5px;
          color: var(--sp-text-muted);
          margin: 0 0 20px;
          line-height: 1.5;
          flex-grow: 1;
        }
        .support__channel-cta {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid var(--sp-input-border);
          background: var(--sp-card-bg);
          color: var(--sp-text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          font-family: inherit;
        }
        .support__channel-cta:hover {
          background: var(--sp-gold-soft);
          border-color: var(--sp-gold);
          color: var(--sp-gold);
        }
        .support__channel-cta:focus-visible {
          outline: 2px solid var(--sp-gold);
          outline-offset: 2px;
        }

        /* ---------- Form wrap ---------- */
        .support__form-wrap {
          max-width: 720px;
          margin: 0 auto;
        }
        .support__form-header { margin-bottom: 24px; }
        .support__form-title {
          margin: 0 0 6px;
          font-size: clamp(20px, 3vw, 26px);
          line-height: 1.2;
          color: var(--sp-text);
          font-weight: 700;
        }
        .support__form-sub {
          margin: 0;
          font-size: 13.5px;
          color: var(--sp-text-muted);
          line-height: 1.5;
        }
        .support__form-sub span[aria-hidden] {
          color: var(--sp-gold);
          font-weight: 600;
        }

        /* ---------- Card ---------- */
        .support__card {
          background: var(--sp-card-bg);
          border: 1px solid var(--sp-border);
          border-radius: 12px;
          padding: clamp(20px, 3vw, 32px);
          box-shadow: var(--sp-shadow);
        }

        /* ---------- Form ---------- */
        .support__form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .support__field {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .support__label {
          font-size: 13px;
          font-weight: 600;
          color: var(--sp-text);
          line-height: 1.4;
        }
        .support__label span[aria-hidden] {
          color: var(--sp-gold);
          margin-left: 2px;
        }

        .support__input,
        .support__textarea,
        .support__select {
          width: 100%;
          padding: 11px 14px;
          font-size: 14.5px;
          border-radius: 8px;
          min-height: 44px;
          background: var(--sp-input-bg);
          border: 1px solid var(--sp-input-border);
          color: var(--sp-text);
          font-family: inherit;
          line-height: 1.4;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          -webkit-appearance: none;
          appearance: none;
        }
        .support__input::placeholder,
        .support__textarea::placeholder {
          color: var(--sp-placeholder);
        }
        .support__input:focus,
        .support__textarea:focus,
        .support__select:focus {
          outline: none;
          border-color: var(--sp-gold);
          box-shadow: 0 0 0 3px var(--sp-gold-ring);
        }

        .support__textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.55;
        }
        .support__select {
          cursor: pointer;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235b6472' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
        }

        .support__counter {
          align-self: flex-end;
          font-size: 11.5px;
          color: var(--sp-text-muted);
          opacity: 0.8;
          margin-top: -4px;
          font-variant-numeric: tabular-nums;
        }

        /* ---------- Error ---------- */
        .support__error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 8px;
          background: var(--sp-danger-soft);
          border: 1px solid var(--sp-danger-border);
          color: var(--sp-danger);
          font-size: 13.5px;
          line-height: 1.5;
        }
        .support__error svg { flex-shrink: 0; margin-top: 2px; }

        /* ---------- Note ---------- */
        .support__note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: var(--sp-text-muted);
          line-height: 1.5;
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--sp-bg-soft);
          border: 1px solid var(--sp-border);
        }
        .support__note svg { flex-shrink: 0; margin-top: 2px; opacity: 0.8; }

        /* ---------- Submit ---------- */
        .support__submit {
          width: 100%;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: var(--sp-text);
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s ease, opacity 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .support__submit:hover:not(:disabled) {
          background: #1a2842;
        }
        .support__submit:focus-visible {
          outline: 2px solid var(--sp-gold);
          outline-offset: 2px;
        }
        .support__submit:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }
        .support__spinner {
          animation: support-spin 0.8s linear infinite;
        }
        @keyframes support-spin { to { transform: rotate(360deg); } }

        /* ---------- Success ---------- */
        .support__success {
          text-align: center;
          padding: clamp(32px, 6vw, 48px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .support__success-icon {
          width: 64px;
          height: 64px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--sp-success-soft);
          color: var(--sp-success);
          margin-bottom: 8px;
        }
        .support__success-title {
          margin: 0;
          font-size: 20px;
          color: var(--sp-text);
          font-weight: 700;
        }
        .support__success-text {
          margin: 0;
          color: var(--sp-text-muted);
          font-size: 14px;
          line-height: 1.55;
          max-width: 42ch;
        }
        .support__success-reset {
          margin-top: 16px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid var(--sp-input-border);
          background: var(--sp-card-bg);
          color: var(--sp-text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s ease, border-color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .support__success-reset:hover {
          background: var(--sp-gold-soft);
          border-color: var(--sp-gold);
        }
        .support__success-reset:focus-visible {
          outline: 2px solid var(--sp-gold);
          outline-offset: 2px;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 480px) {
          .support__channels { grid-template-columns: 1fr; }
          .support__input,
          .support__textarea,
          .support__select {
            font-size: 16px; /* prevents iOS zoom-on-focus */
          }
        }

        /* ---------- Reduced motion ---------- */
        @media (prefers-reduced-motion: reduce) {
          .support__channel,
          .support__submit,
          .support__channel-cta,
          .support__success-reset,
          .support__back,
          .support__back svg { transition: none; }
          .support__spinner { animation-duration: 1.6s; }
        }

        /* =====================================================
           DARK MODE (opt-in via OS preference)
           ===================================================== */
        @media (prefers-color-scheme: dark) {
          .support {
            --sp-bg: #0f1729;
            --sp-bg-soft: #0a1020;
            --sp-text: #f2f4f8;
            --sp-text-muted: #9aa6b8;
            --sp-border: #1f2a42;
            --sp-border-strong: #2d3a55;
            --sp-card-bg: #131c30;
            --sp-card-bg-soft: #16202e;
            --sp-input-bg: #0d1626;
            --sp-input-border: #2a3852;
            --sp-placeholder: #6b7688;
            --sp-gold: #e0bd47;
            --sp-gold-soft: rgba(224, 189, 71, 0.12);
            --sp-gold-ring: rgba(224, 189, 71, 0.25);
            --sp-success: #2dd4a0;
            --sp-success-soft: rgba(45, 212, 160, 0.12);
            --sp-danger: #ff6b81;
            --sp-danger-soft: rgba(255, 107, 129, 0.10);
            --sp-danger-border: rgba(255, 107, 129, 0.28);
            --sp-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.25);
            --sp-shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.35), 0 8px 24px rgba(0, 0, 0, 0.35);
          }
          .support__select {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa6b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
          }
          .support__submit {
            background: var(--sp-gold);
            color: #0a1020;
          }
          .support__submit:hover:not(:disabled) {
            background: #eccb5a;
          }
        }
      `}</style>

      {/* ---------- Hero ---------- */}
      <section className="support__hero">
        <div className="support__container">
          <Link to="/" className="support__back" aria-label="Back to home">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <span className="support__eyebrow">Support</span>
          <h1 className="support__title">How can we help?</h1>
          <p className="support__lede">
            Our team is available Monday to Friday, 9am–6pm WAT. For urgent
            matters, please call.
          </p>
        </div>
      </section>

      <div className="support__container support__body">
        {/* ---------- Contact channels ---------- */}
        <div className="support__channels">
          {CHANNELS.map(({ icon: Icon, title, description, cta, href, chat }) => (
            <div key={title} className="support__channel">
              <div className="support__channel-icon">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h2 className="support__channel-title">{title}</h2>
              <p className="support__channel-desc">{description}</p>
              {href ? (
                <a href={href} className="support__channel-cta">
                  {cta}
                </a>
              ) : (
                <button
                  type="button"
                  className="support__channel-cta"
                  onClick={() =>
                    chat && window.open('https://chat.bravevest.com', '_blank')
                  }
                >
                  {cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ---------- Contact form ---------- */}
        <div className="support__form-wrap">
          <div className="support__form-header">
            <h2 className="support__form-title">Send us a message</h2>
            <p className="support__form-sub">
              We reply to your registered email. Fields marked{' '}
              <span aria-hidden="true">*</span> are required.
            </p>
          </div>

          {sent ? (
            <div className="support__card support__success" role="status" aria-live="polite">
              <div className="support__success-icon">
                <CheckCircle size={36} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="support__success-title">Message sent</h3>
              <p className="support__success-text">
                We&rsquo;ll respond to your registered email within 24 hours.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="support__success-reset"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="support__card support__form" noValidate>
              {/* Subject */}
              <div className="support__field">
                <label htmlFor={`${formId}-subject`} className="support__label">
                  Subject <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`${formId}-subject`}
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                  maxLength={120}
                  autoComplete="off"
                  className="support__input"
                />
                <span className="support__counter">{form.subject.length}/120</span>
              </div>

              {/* Priority */}
              <div className="support__field">
                <label htmlFor={`${formId}-priority`} className="support__label">
                  Priority
                </label>
                <select
                  id={`${formId}-priority`}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="support__select"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label} — {p.hint}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="support__field">
                <label htmlFor={`${formId}-message`} className="support__label">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id={`${formId}-message`}
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please include as much detail as possible..."
                  required
                  maxLength={4000}
                  className="support__textarea"
                />
                <span className="support__counter">{form.message.length}/4000</span>
              </div>

              {/* Error */}
              {error && (
                <div className="support__error" role="alert">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* Security note */}
              <div className="support__note">
                <Shield size={14} aria-hidden="true" />
                <span>
                  Never share passwords or full card numbers. We will never ask
                  for them.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="support__submit"
                disabled={!canSubmit}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="support__spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}