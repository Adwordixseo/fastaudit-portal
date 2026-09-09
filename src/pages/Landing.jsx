import React from 'react';
import { Navigate } from 'react-router-dom';
import SiteHeader from '@/components/site/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
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
  const { user, isLoadingAuth } = useAuth();
  if (!isLoadingAuth && user?.is_team_member) return <Navigate to="/team" replace />;
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