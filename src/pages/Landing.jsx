import React from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Hero from '@/components/site/Hero';
import PlatformSection from '@/components/site/PlatformSection';
import HowItWorks from '@/components/site/HowItWorks';
import SolutionsSection from '@/components/site/SolutionsSection';
import PricingSection from '@/components/site/PricingSection';
import ResourcesSection from '@/components/site/ResourcesSection';
import FaqSection from '@/components/site/FaqSection';
import CtaBanner from '@/components/site/CtaBanner';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <Hero />
        <PlatformSection />
        <HowItWorks />
        <SolutionsSection />
        <PricingSection />
        <ResourcesSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}