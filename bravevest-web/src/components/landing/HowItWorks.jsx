import { Link } from 'react-router-dom';
import './HowItWorks.css';

const steps = [
  {
    n: '01',
    title: 'Enter Your Details',
    body: 'We will match your capital to the right opportunities based on your profile.',
    color: 'teal',
    icon: 'pencil',
  },
  {
    n: '02',
    title: 'Finding The Right Opportunities',
    body: 'Finding and selecting verified opportunities tailored to your investment goals.',
    color: 'purple',
    icon: 'sparkle',
  },
  {
    n: '03',
    title: 'Payment Options',
    body: 'Flexible payment options to fund and receive returns on your schedule.',
    color: 'lime',
    icon: 'card',
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw">
      <div className="container">
        <h2 className="hiw__title">How It Works?</h2>
        <p className="hiw__sub">
          There are plenty of investment providers, products and platforms.
          We make the choice simple.
        </p>

        <div className="hiw__grid">
          {steps.map((s) => (
            <div key={s.n} className={`hiw__card hiw__card--${s.color}`}>
              <div className="hiw__icon"><StepIcon name={s.icon} /></div>
              <div className="hiw__step">STEP {s.n.replace('0', '')}</div>
              <h3 className="hiw__h3">{s.title}</h3>
              <p className="hiw__p">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="hiw__cta">
          <Link to="/marketplace" className="hiw__cta-link">Browse opportunities →</Link>
        </div>
      </div>
    </section>
  );
}

function StepIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#0F0F10', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'pencil') {
    return (
      <svg {...common}>
        <path d="M4 20h4l10-10-4-4L4 16v4z" />
        <path d="M14 6l4 4" />
      </svg>
    );
  }
  if (name === 'sparkle') {
    return (
      <svg {...common}>
        <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
