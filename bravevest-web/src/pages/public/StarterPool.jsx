import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useSEO } from '@/hooks/useSEO';
import './StarterPool.css';

export default function StarterPool() {
  useSEO({
    title: 'Starter Pool — Start with ₦5,000',
    description: 'New to investing? Start with just ₦5,000 in a diversified pool across multiple BraveVest projects.',
    canonical: '/#/starter',
  });

  return (
    <div className="starter container">
      <div className="starter__hero">
        <div className="starter__mesh" aria-hidden />
        <div className="starter__inner">
          <div className="starter__eyebrow">Starter Pool</div>
          <h1 className="starter__title">New to investing?<br />Start with ₦5,000.</h1>
          <p className="starter__sub">
            A diversified entry pool split across multiple BraveVest projects.
            Learn how the platform works with real returns on a small amount.
          </p>
          <div className="starter__actions">
            <Button as={Link} to="/register" variant="primary" size="lg">Start with ₦5,000</Button>
            <Button as={Link} to="/help" variant="secondary" size="lg">Learn how it works</Button>
          </div>
        </div>
      </div>

      <div className="starter__grid">
        <div className="starter__card">
          <div className="starter__card-n">01</div>
          <div className="starter__card-title">Diversified from day one</div>
          <p className="starter__card-body">
            Your ₦5,000 is spread across a curated bundle of projects — real estate,
            agriculture, and energy — so you're never exposed to a single project.
          </p>
        </div>
        <div className="starter__card">
          <div className="starter__card-n">02</div>
          <div className="starter__card-title">Same protections</div>
          <p className="starter__card-body">
            Every project in the Starter Pool passes the same verification and due diligence
            as the main marketplace.
          </p>
        </div>
        <div className="starter__card">
          <div className="starter__card-n">03</div>
          <div className="starter__card-title">Grow at your pace</div>
          <p className="starter__card-body">
            Once you're comfortable, move up to full projects with ₦50,000+ minimums.
            No pressure, no lock-in.
          </p>
        </div>
      </div>

      <div className="starter__cta">
        <div className="starter__cta-inner">
          <div className="starter__cta-title">Ready to take the first step?</div>
          <p className="starter__cta-sub">Create your account in 2 minutes. Complete KYC. Invest from ₦5,000.</p>
          <Button as={Link} to="/register" variant="primary" size="lg">Create account</Button>
        </div>
      </div>
    </div>
  );
}
