import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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
import ContentSectionsRenderer from '@/components/content/ContentSectionsRenderer';
import ContentSectionBlock from '@/components/content/ContentSectionBlock';

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
    if (replacements[key]) return <ContentSectionBlock section={replacements[key]} />;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {renderSlot('hero', Hero)}
        {renderSlot('platform', PlatformSection)}
        {renderSlot('how_it_works', HowItWorks)}
        {renderSlot('solutions', SolutionsSection)}
        {renderSlot('pricing', PricingSection)}
        {renderSlot('resources', ResourcesSection)}
        <FaqSection pagePath="/" />
        <ContentSectionsRenderer />
        {renderSlot('cta', CtaBanner)}
      </main>
      <SiteFooter />
    </div>
  );
}