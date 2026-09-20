import Hero from '@/components/landing/Hero';
import SuccessStats from '@/components/landing/SuccessStats';
import WhySection from '@/components/landing/WhySection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import CTA from '@/components/landing/CTA';
import { useSEO } from '@/hooks/useSEO';

export default function Home() {
  useSEO({
    title: 'Access Verified Investment Opportunities',
    description:
      'BraveVest Marketplace gives investors access to verified investment opportunities across real estate, agriculture, energy and credit-backed products.',
    canonical: '/',
  });
  return (
    <>
      <Hero />
      <SuccessStats />
      <WhySection />
      <HowItWorks />
      <FeaturedProjects />
      <CTA />
    </>
  );
}
