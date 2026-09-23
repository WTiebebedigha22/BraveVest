import Hero from '@/components/landing/Hero';
import SuccessStats from '@/components/landing/SuccessStats';
import WhySection from '@/components/landing/WhySection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import TrustBar from '@/components/landing/TrustBar';
import CTA from '@/components/landing/CTA';
import { useSEO } from '@/hooks/useSEO';
import { usePrefetch } from '@/hooks/usePrefetch';

export default function Home() {
  useSEO({
    title: 'Access Verified Investment Opportunities',
    description: 'BraveVest Marketplace gives investors access to verified investment opportunities across real estate, agriculture, energy and credit-backed products.',
    canonical: '/',
  });

  // Prefetch marketplace while user reads the landing page
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  usePrefetch([apiBase + '/projects?featured=true&limit=3']);

  return (
    <>
      <Hero />
      <SuccessStats />
      <TrustBar />
      <WhySection />
      <HowItWorks />
      <FeaturedProjects />
      <CTA />
    </>
  );
}
