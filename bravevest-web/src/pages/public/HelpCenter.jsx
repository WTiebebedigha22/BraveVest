import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useSEO } from '@/hooks/useSEO';
import './HelpCenter.css';

const ARTICLES = [
  { id: 'how-verification-works', cat: 'Getting started', title: 'How does BraveVest verify projects?', excerpt: 'Every project passes sponsor verification, land/title review, budget validation and a site inspection before it goes live.' },
  { id: 'understanding-returns', cat: 'Investing', title: 'Understanding your returns and payout schedule', excerpt: 'How returns are calculated, when they are paid, and what happens at maturity.' },
  { id: 'kyc-guide', cat: 'Getting started', title: 'How to complete your KYC', excerpt: 'A step-by-step walkthrough of personal details, ID upload, address, bank account and review.' },
  { id: 'risk-explained', cat: 'Investing', title: 'Understanding investment risk', excerpt: 'What risk levels mean, how they are assigned, and how to build a diversified portfolio.' },
  { id: 'project-default', cat: 'Safety', title: 'What happens if a project defaults?', excerpt: 'Our recovery process, timelines, and the role of the investment committee.' },
  { id: 'fees-explained', cat: 'Money', title: 'All fees, explained', excerpt: 'Structuring fee, administration fee, project management fee, performance fee â€” what each does.' },
  { id: 'withdrawing', cat: 'Money', title: 'How to withdraw your returns', excerpt: 'Where payouts land, how long they take, and how to update your bank details.' },
  { id: 'taxes', cat: 'Money', title: 'Taxes on your returns', excerpt: 'General guidance on how returns are taxed in Nigeria and what BraveVest reports.' },
  { id: 'security', cat: 'Safety', title: 'How we keep your account secure', excerpt: '256-bit SSL, PCI-DSS-compliant payment processors, 2FA, and how to spot phishing.' },
  { id: 'co-investing', cat: 'Advanced', title: 'Co-investing with groups', excerpt: 'How BraveVest CoFund works for cooperatives, families and diaspora groups.' },
  { id: 'prime-circle', cat: 'Advanced', title: 'Prime & Circle explained', excerpt: 'Premium opportunities, private briefings, and how to qualify.' },
  { id: 'dispute-resolution', cat: 'Safety', title: 'Filing a complaint', excerpt: 'Our complaint handling process and the timelines you should expect.' },
];

const CATEGORIES = ['All', 'Getting started', 'Investing', 'Money', 'Safety', 'Advanced'];

export default function HelpCenter() {
  useSEO({
    title: 'Help Center â€” Guides and answers',
    description: 'Guides on verification, returns, risk, fees, withdrawals and account security on BraveVest.',
    canonical: '/#/help',
  });

  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    let out = ARTICLES;
    if (cat !== 'All') out = out.filter((a) => a.cat === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((a) => a.title.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s));
    }
    return out;
  }, [cat, q]);

  return (
    <div className="help container">
      <header className="help__head">
        <div className="help__eyebrow">Help Center</div>
        <h1 className="help__title">How can we help?</h1>
        <p className="help__sub">Answers to the most common questions about investing on BraveVest.</p>
        <div className="help__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articlesâ€¦"
          />
        </div>
        <div className="help__cats">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`help__pill ${c === cat ? 'is-active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="help__grid">
        {filtered.map((a) => (
          <Link key={a.id} to={`/help/${a.id}`} className="help__card">
            <div className="help__card-cat">{a.cat}</div>
            <div className="help__card-title">{a.title}</div>
            <p className="help__card-excerpt">{a.excerpt}</p>
            <div className="help__card-cta">Read article â†’</div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="help__empty">No articles match your search.</div>
      )}

      <div className="help__contact">
        <div>
          <div className="help__contact-title">Can't find what you're looking for?</div>
          <p className="help__contact-body">Send us an email or use the contact form and we'll get back within 24 hours.</p>
        </div>
        <Button as={Link} to="/contact" variant="primary" size="lg">Contact us</Button>
      </div>
    </div>
  );
}