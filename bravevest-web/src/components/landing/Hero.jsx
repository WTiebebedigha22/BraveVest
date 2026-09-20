import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import './Hero.css';

const SLIDER_MIN = 5000;
const SLIDER_MAX = 50000000;
const SLIDER_DEFAULT = 50000000;   // in NGN base

export default function Hero() {
  const { format } = useCurrency();
  const [amount, setAmount] = useState(SLIDER_DEFAULT);

  return (
    <section className="hero">
      <div className="hero__mesh" aria-hidden />
      <div className="container hero__inner">
        {/* Left: copy */}
        <div className="hero__copy">
          <h1 className="hero__title">
            Completely<br />Hassle-Free<br />Investing.
          </h1>
          <p className="hero__sub">
            Curated opportunities and structured products across real estate, agriculture and
            energy — finding the right one can seem difficult.
          </p>
          <div className="hero__cta">
            <Button as={Link} to="/register" variant="primary" size="lg">Get Started</Button>
            <Button as={Link} to="/how-it-works" variant="secondary" size="lg">
              Chat With Experts
              <span className="hero__chat-badge">3</span>
            </Button>
          </div>
          <ul className="hero__trust">
            <li><CheckIcon /> Verified Opportunities</li>
            <li><CheckIcon /> No Hidden Charges</li>
          </ul>
        </div>

        {/* Right: widget card */}
        <aside className="hero__card">
          <div className="hero__card-chip">
            <ShieldIcon /> Compare The Best Returns
          </div>

          <div className="hero__card-body">
            <div className="hero__card-label">Select Investment Amount</div>
            <div className="hero__card-amount">{format(amount)}</div>

            <div className="hero__slider">
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="hero__slider-input"
                style={{
                  // show fill up to thumb
                  background: `linear-gradient(to right, #3FB8C4 0%, #B3D941 ${((amount - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%, #E5E5E5 ${((amount - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%, #E5E5E5 100%)`,
                }}
              />
              <div className="hero__slider-labels">
                <span>{format(SLIDER_MIN)}</span>
                <span>{format(SLIDER_MAX)}</span>
              </div>
            </div>

            <Button as={Link} to="/marketplace" variant="primary" size="lg" className="hero__card-cta">
              Start Now
            </Button>

            <div className="hero__card-meta">
              <span><UserIcon /> 50,000+ Users</span>
              <span><LockIcon /> Safe And Non-Binding</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ── icons ── */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7.5l3.2 3.2L12 4" stroke="#0F0F10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.5 3.2-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
