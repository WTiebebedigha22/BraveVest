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
    <div className="nf">
      <div className="nf__mesh" aria-hidden />
      <div className="container nf__inner">
        <div className="nf__code">404</div>
        <h1 className="nf__title">This page took an early exit.</h1>
        <p className="nf__sub">
          The link you followed may be broken, or the page might have been moved.
          Let's get you back on track.
        </p>

        <div className="nf__actions">
          <Button as={Link} to="/" variant="primary" size="lg">Back home</Button>
          <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse marketplace</Button>
        </div>

        <div className="nf__links">
          <Link to="/how-it-works">How it works</Link>
          <span>·</span>
          <Link to="/about">About</Link>
          <span>·</span>
          <Link to="/contact">Contact</Link>
          <span>·</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
