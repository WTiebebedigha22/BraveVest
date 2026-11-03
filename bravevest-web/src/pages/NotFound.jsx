import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useSEO } from '@/hooks/useSEO';
import './NotFound.css';

export default function NotFound() {
  useSEO({
    title: 'Page not found',
    description: 'The page you are looking for could not be found.',
    noIndex: true,
  });

  return (
    <main className="nf">
      <div className="nf__mesh" aria-hidden="true" />
      <div className="nf__grain" aria-hidden="true" />

      <div className="container nf__inner">
        <p className="nf__eyebrow">Error 404</p>

        <div className="nf__code" aria-hidden="true">
          404
        </div>

        <h1 className="nf__title">This page took an early exit.</h1>

        <p className="nf__sub">
          The link you followed may be broken, or the page might have been moved.
          Let&rsquo;s get you back on track.
        </p>

        <div className="nf__actions">
          <Button as={Link} to="/" variant="primary" size="lg">
            Back home
          </Button>
          <Button as={Link} to="/marketplace" variant="secondary" size="lg">
            Browse marketplace
          </Button>
        </div>

        <nav className="nf__links" aria-label="Helpful links">
          <Link to="/how-it-works">How it works</Link>
          <span aria-hidden="true">·</span>
          <Link to="/about">About</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
          <span aria-hidden="true">·</span>
          <Link to="/login">Sign in</Link>
        </nav>
      </div>
    </main>
  );
}