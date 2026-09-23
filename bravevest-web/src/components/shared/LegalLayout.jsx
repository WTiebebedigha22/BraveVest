import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import './LegalLayout.css';

/**
 * Shared layout for Terms, Privacy, Disclosures, Risk Disclosure pages.
 *
 * Props:
 *   title       — page title
 *   subtitle    — optional short subtitle
 *   lastUpdated — date string
 *   description — for SEO meta
 *   canonical   — route
 *   sections    — array of { id, heading, body: string[] }
 */
export default function LegalLayout({ title, subtitle, lastUpdated, description, canonical, sections }) {
  useSEO({ title, description, canonical });

  // Auto-scroll to hash anchor on mount
  useEffect(() => {
    if (window.location.hash.includes('#')) {
      const id = window.location.hash.split('#').pop();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="legal container">
      <aside className="legal__nav">
        <div className="legal__nav-title">On this page</div>
        {sections.map((s) => (
          <a key={s.id} href={'#' + s.id} className="legal__nav-link">{s.heading}</a>
        ))}
      </aside>

      <article className="legal__body">
        <header className="legal__head">
          <div className="legal__eyebrow">Legal</div>
          <h1 className="legal__title">{title}</h1>
          {subtitle && <p className="legal__subtitle">{subtitle}</p>}
          <div className="legal__updated">Last updated: {lastUpdated}</div>
        </header>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="legal__section">
            <h2 className="legal__h2">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="legal__p">{p}</p>
            ))}
          </section>
        ))}

        <footer className="legal__foot">
          <div className="legal__foot-title">Questions about this document?</div>
          <p className="legal__foot-body">
            Contact our legal and compliance team at{' '}
            <a href="mailto:legal@bravevest.com">legal@bravevest.com</a>
          </p>
          <div className="legal__foot-links">
            <Link to="/terms">Terms</Link>
            <span>·</span>
            <Link to="/privacy">Privacy</Link>
            <span>·</span>
            <Link to="/disclosures">Disclosures</Link>
            <span>·</span>
            <Link to="/risk-disclosure">Risk Disclosure</Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
