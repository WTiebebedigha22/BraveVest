import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import './WhySection.css';

export default function WhySection() {
  return (
    <section className="why container">
      <h2 className="why__title">
        Why Should You Use<br />BraveVest?
      </h2>

      {/* Row 1: image left, text right */}
      <div className="why__row">
        <div className="why__media">
          <div className="why__media-mesh why__media-mesh--green" />
          <div className="why__media-inner">
            <div className="why__mini-card">
              <div className="why__mini-status">
                <span className="why__mini-dot" />
                <span>Status</span>
                <span className="why__mini-tag">Your loan is approved</span>
              </div>
              {/* Replace placeholder background with a real image or dashboard graphic */}
              <div className="why__mini-img">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" 
                  alt="Business Analytics Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                />
              </div>
            </div>
            <div className="why__badge-card">
              <span className="why__badge-icon">B</span>
              <div>
                <div className="why__badge-title">Business Loan</div>
                <div className="why__badge-sub">Instant capital for growth.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="why__copy">
          <div className="why__eyebrow">Business</div>
          <h3 className="why__h3">Refreshingly Instant Business Funding</h3>
          <p className="why__p">
            We use our creative might to bring you the best opportunities at the right
            tenor — with verified operators and transparent terms.
          </p>
          <Button as={Link} to="/marketplace" variant="primary" size="md">Browse Now</Button>
        </div>
      </div>

      {/* Row 2: text left, image right */}
      <div className="why__row why__row--reverse">
        <div className="why__copy">
          <div className="why__eyebrow">Personal</div>
          <h3 className="why__h3">Individual Short-Term Opportunities</h3>
          <p className="why__p">
            We provide curated opportunities based on your investor profile. Get started in
            5 minutes or less.
          </p>
          <Button as={Link} to="/register" variant="primary" size="md">Apply Now</Button>
        </div>

        <div className="why__media">
          <div className="why__media-mesh why__media-mesh--purple" />
          <div className="why__media-inner why__media-inner--right">
            <div className="why__photo-card">
              <img 
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" 
                alt="Investment Portfolio Dashboard" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
            </div>
            <div className="why__badge-card why__badge-card--offset">
              <span className="why__badge-icon why__badge-icon--purple">P</span>
              <div>
                <div className="why__badge-title">Personal Portfolio</div>
                <div className="why__badge-sub">Track every return.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}