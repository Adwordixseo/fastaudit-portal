import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ContentSectionBlock from '@/components/content/ContentSectionBlock';

function matchPath(pathname, sections) {
  return sections.filter((s) => {
    if (s.page_path === pathname) return true;
    if (s.page_path && s.page_path.includes(':')) {
      const pattern = s.page_path.replace(/:[^/]+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return false;
  });
}

export default function ContentSectionsRenderer() {
  const location = useLocation();
  const { data: sections = [] } = useQuery({
    queryKey: ['content-sections'],
    queryFn: () => base44.entities.ContentSection.filter({ is_active: true }),
  });

  const matched = useMemo(
    () => matchPath(location.pathname, sections)
      .filter((s) => !s.replace_section)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [sections, location.pathname]
  );

  if (matched.length === 0) return null;

  return (
    <>
      {matched.map((s) => <ContentSectionBlock key={s.id} section={s} />)}
    </>
  );
}