import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import './CTA.css';

export default function CTA() {
  return (
    <section className="cta container">
      <div className="cta__card">
        <div className="cta__mesh" aria-hidden />
        <h2 className="cta__title">Ready to start investing?</h2>
        <p className="cta__sub">Join thousands of Nigerians building long-term wealth through curated opportunities.</p>
        <div className="cta__actions">
          <Button as={Link} to="/register" variant="primary" size="lg">Create your account</Button>
          <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse projects</Button>
        </div>
      </div>
    </section>
  );
}
