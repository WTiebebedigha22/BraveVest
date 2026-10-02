import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import './Hero.css';

const MIN = 5000, MAX = 50000000, DEFAULT = 50000000;

export default function Hero() {
  const { format } = useCurrency();
  const [amount, setAmount] = useState(DEFAULT);

  return (
    <section className="hero">
      <div className="hero__mesh" aria-hidden />
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">Completely<br />Hassle-Free<br />Investing.</h1>
          <p className="hero__sub">Curated opportunities and structured products across real estate, agriculture and energy.</p>
          <div className="hero__cta">
            <Button as={Link} to="/register" variant="primary" size="lg">Get Started</Button>
            <Button as={Link} to="/how-it-works" variant="secondary" size="lg">How It Works</Button>
          </div>
          <ul className="hero__trust">
            <li><span className="hero__check">✓</span> Verified Opportunities</li>
            <li><span className="hero__check">✓</span> No Hidden Charges</li>
          </ul>
        </div>
        <aside className="hero__card">
          <div className="hero__card-chip">🛡 Compare The Best Returns</div>
          <div className="hero__card-body">
            <div className="hero__card-label">Select Investment Amount</div>
            <div className="hero__card-amount">{format(amount)}</div>
            <input type="range" min={MIN} max={MAX} step={5000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="hero__slider-input" style={{ background: 'linear-gradient(to right, #3FB8C4 0%, #B3D941 ' + ((amount - MIN) / (MAX - MIN)) * 100 + '%, #E5E5E5 ' + ((amount - MIN) / (MAX - MIN)) * 100 + '%, #E5E5E5 100%)' }} />
            <div className="hero__slider-labels"><span>{format(MIN)}</span><span>{format(MAX)}</span></div>
            <Button as={Link} to="/marketplace" variant="primary" size="lg" className="hero__card-cta">Start Now</Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
