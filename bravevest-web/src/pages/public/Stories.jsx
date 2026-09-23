import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useSEO } from '@/hooks/useSEO';
import './Stories.css';

const STORIES = [
  {
    name: 'Chidinma A.',
    role: 'Product designer, Lagos',
    quote: 'I started with â‚¦100,000 in the Projects 001 pilot. Watching the monthly payouts arrive, on time, made me trust the model. I\'ve since added two more projects.',
    highlight: 'â‚¦100k â†’ â‚¦118k in 6 months',
  },
  {
    name: 'Tunde B.',
    role: 'Diaspora investor, London',
    quote: 'I\'ve been trying to invest back home for years. BraveVest made it possible without a Nigerian property manager or a local bank account.',
    highlight: 'Diaspora investor since 2025',
  },
  {
    name: 'Amina O.',
    role: 'Cooperative treasurer, Abuja',
    quote: 'Our 40-member cooperative pooled â‚¦8M through CoFund. The consolidated reporting made every member feel seen â€” no more WhatsApp spreadsheets.',
    highlight: 'â‚¦8M pooled via CoFund',
  },
  {
    name: 'Emeka N.',
    role: 'Business owner, Port Harcourt',
    quote: 'The land review was thorough â€” they caught a documentation issue the sponsor hadn\'t flagged. That kind of diligence is why I keep coming back.',
    highlight: '3 investments, 2 matured',
  },
];

export default function Stories() {
  useSEO({
    title: 'Investor Stories',
    description: 'Real investors sharing their experience with BraveVest â€” from â‚¦100k pilots to â‚¦8M cooperative pools.',
    canonical: '/#/stories',
  });

  return (
    <div className="stories container">
      <header className="stories__head">
        <div className="stories__eyebrow">Investor Stories</div>
        <h1 className="stories__title">Real people, real returns.</h1>
        <p className="stories__sub">
          From first-time investors to cooperatives and diaspora communities â€” how people are using BraveVest.
        </p>
      </header>

      <div className="stories__grid">
        {STORIES.map((s, i) => (
          <div key={s.name} className={`story ${i === 0 ? 'story--feature' : ''}`}>
            <div className="story__quote-mark">"</div>
            <blockquote className="story__quote">{s.quote}</blockquote>
            <div className="story__highlight">{s.highlight}</div>
            <div className="story__author">
              <div className="story__avatar">{s.name.split(' ').map((x) => x[0]).join('')}</div>
              <div>
                <div className="story__name">{s.name}</div>
                <div className="story__role">{s.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stories__cta">
        <div>
          <div className="stories__cta-title">Ready to write your own story?</div>
          <p className="stories__cta-body">Start with as little as â‚¦50,000 in a verified opportunity.</p>
        </div>
        <div className="stories__cta-actions">
          <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse projects</Button>
          <Button as={Link} to="/register" variant="primary" size="lg">Create account</Button>
        </div>
      </div>

      <div className="stories__note">
        Stories are illustrative. Returns and experiences vary by investor and project.
      </div>
    </div>
  );
}