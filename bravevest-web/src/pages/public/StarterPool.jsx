import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import './StarterPool.css';

export default function StarterPool() {
  const { format } = useCurrency();

  const MIN = 5000;
  const FULL_MIN = 50000;

  const steps = [
    { n: '01', title: 'Create your account', body: 'Two minutes. Email, phone, password.' },
    { n: '02', title: 'Complete KYC', body: 'Verify your identity once. Takes a few minutes.' },
    { n: '03', title: `Invest from ${format(MIN)}`, body: 'Pick the Starter Pool. We handle the rest.' },
  ];

  return (
    <div className="starter">
      <section className="starter__hero">
        <div className="starter__mesh" aria-hidden />
        <div className="starter__inner">
          <div className="starter__eyebrow">Starter Pool</div>
          <h1 className="starter__title">
            New to investing?<br />
            Start with {format(MIN)}.
          </h1>
          <p className="starter__sub">
            A diversified entry into BraveVest's curated pipeline of real estate,
            agriculture, and SME lending so your first investment isn't a gamble
            on one outcome.
          </p>
          <div className="starter__actions">
            <Link to="/register" className="btn btn--primary">
              Start with {format(MIN)}
            </Link>
            <Link to="/how-it-works" className="btn btn--ghost">
              How it works →
            </Link>
          </div>
        </div>
      </section>

      <div className="starter__grid">
        {steps.map((s) => (
          <div key={s.n} className="starter__card">
            <div className="starter__card-n">{s.n}</div>
            <div className="starter__card-title">{s.title}</div>
            <div className="starter__card-body">{s.body}</div>
          </div>
        ))}
      </div>

      <div className="starter__grid">
        <div className="starter__card">
          <div className="starter__card-title">Diversified by default</div>
          <div className="starter__card-body">
            Your {format(MIN)} is split across a curated bundle real estate,
            agriculture, and SME lending, so no single outcome decides your return.
          </div>
        </div>
        <div className="starter__card">
          <div className="starter__card-title">Same vetted pipeline</div>
          <div className="starter__card-body">
            Starter Pool draws from the same opportunities full investors see.
            You're not getting a lesser tier, just a smaller entry.
          </div>
        </div>
        <div className="starter__card">
          <div className="starter__card-title">Move up when ready</div>
          <div className="starter__card-body">
            When you're comfortable, graduate to full projects with {format(FULL_MIN)}+
            minimums. Same account, same portfolio.
          </div>
        </div>
      </div>

      <section className="starter__cta">
        <h2 className="starter__cta-title">
          Create your account in 2 minutes.
        </h2>
        <p className="starter__cta-sub">
          Complete KYC. Invest from {format(MIN)}. No hidden fees.
        </p>
        <div className="starter__actions starter__actions--center">
          <Link to="/register" className="btn btn--lime btn--lg">
            Start with {format(MIN)}
          </Link>
          <Link to="/login" className="btn btn--ghost-light btn--lg">
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}