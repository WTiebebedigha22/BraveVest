import HowItWorksSection from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';
import { useSEO } from '@/hooks/useSEO';
import './HowItWorks.css';

export default function HowItWorks() {
  useSEO({
    title: 'How It Works',
    description: 'From sign-up to your first return â€” BraveVest makes structured investing simple, secure and transparent.',
    canonical: '/#/how-it-works',
  });
  return (
    <div className="hiw-page container">
      <header className="hiw-page__head">
        <div className="hiw-page__eyebrow">How it works</div>
        <h1 className="hiw-page__title">Simple. Secure. Transparent.</h1>
        <p className="hiw-page__sub">From sign-up to your first return â€” the whole experience in three steps.</p>
      </header>
      <HowItWorksSection />
      <CTA />
    </div>
  );
}