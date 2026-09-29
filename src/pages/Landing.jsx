import React, { useMemo, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/site/SiteHeader';
import { useAuth } from '@/lib/AuthContext';
import Hero from '@/components/site/Hero';

// Sections below the fold are code-split so they never block the above-the-fold
// content (FCP/LCP). The hero, header, and content-section fetch stay critical.
const SiteFooter = lazy(() => import('@/components/site/SiteFooter'));
const PlatformSection = lazy(() => import('@/components/site/PlatformSection'));
const HowItWorks = lazy(() => import('@/components/site/HowItWorks'));
const SolutionsSection = lazy(() => import('@/components/site/SolutionsSection'));
const PricingSection = lazy(() => import('@/components/site/PricingSection'));
const ResourcesSection = lazy(() => import('@/components/site/ResourcesSection'));
const FaqSection = lazy(() => import('@/components/site/FaqSection'));
const CtaBanner = lazy(() => import('@/components/site/CtaBanner'));
const ContentSectionsRenderer = lazy(() => import('@/components/content/ContentSectionsRenderer'));
const ContentSectionBlock = lazy(() => import('@/components/content/ContentSectionBlock'));

// Prevent layout jump while a lazy section's chunk streams in — render a stable
// empty shell of the same height instead of collapsing the page.
const Lazy = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

export default function Landing() {
  const { user, isLoadingAuth } = useAuth();
  const { data: sections = [] } = useQuery({
    queryKey: ['content-sections'],
    queryFn: () => base44.entities.ContentSection.filter({ is_active: true }),
  });

  const { hidden, replacements } = useMemo(() => {
    const overrides = sections.filter((s) => s.page_path === '/' && s.replace_section);
    const hidden = new Set(overrides.filter((o) => o.hide_default).map((o) => o.replace_section));
    const replacements = {};
    overrides.filter((o) => !o.hide_default).forEach((o) => { replacements[o.replace_section] = o; });
    return { hidden, replacements };
  }, [sections]);

  if (!isLoadingAuth && user?.is_team_member) return <Navigate to="/team" replace />;

  const renderSlot = (key, Component) => {
    if (hidden.has(key)) return null;
    const node = replacements[key]
      ? <ContentSectionBlock section={replacements[key]} />
      : <Component />;
    return <Lazy>{node}</Lazy>;
  };

  return (
    <div className="min-h-screen bg-[#0a0815]">
      <SiteHeader />
      <main>
        {renderSlot('hero', Hero)}
        {renderSlot('platform', PlatformSection)}
        {renderSlot('how_it_works', HowItWorks)}
        {renderSlot('solutions', SolutionsSection)}
        {renderSlot('pricing', PricingSection)}
        {renderSlot('resources', ResourcesSection)}
        <Lazy><FaqSection pagePath="/" /></Lazy>
        <Lazy><ContentSectionsRenderer /></Lazy>
        {renderSlot('cta', CtaBanner)}
      </main>
      <Lazy><SiteFooter /></Lazy>
    </div>
  );
}