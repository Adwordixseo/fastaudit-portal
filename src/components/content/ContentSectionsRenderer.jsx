import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

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

const bgClasses = {
  white: 'bg-white',
  slate: 'bg-slate-50',
  indigo: 'bg-indigo-50/40',
};

export default function ContentSectionsRenderer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: sections = [] } = useQuery({
    queryKey: ['content-sections'],
    queryFn: () => base44.entities.ContentSection.filter({ is_active: true }),
  });

  const matched = useMemo(
    () => matchPath(location.pathname, sections).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [sections, location.pathname]
  );

  if (matched.length === 0) return null;

  const handleBodyClick = (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <>
      {matched.map((s) => {
        const isSideBySide = s.image_url && (s.image_position === 'left' || s.image_position === 'right');
        return (
        <section key={s.id} className={`py-16 ${bgClasses[s.background] || 'bg-white'}`}>
          <div className="mx-auto max-w-4xl px-6">
            {s.image_url && s.image_position === 'top' && (
              <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="mb-8 block w-full aspect-[16/9] rounded-2xl overflow-hidden" />
            )}
            <div className={isSideBySide ? 'grid gap-8 md:grid-cols-2 md:items-center' : ''}>
              {s.image_url && s.image_position === 'left' && (
                <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="block w-full aspect-[4/3] rounded-2xl overflow-hidden" />
              )}
              <div>
                {s.heading && <h2 className="text-3xl font-bold tracking-tight text-slate-900">{s.heading}</h2>}
                {s.body && (
                  <div
                    className="rich-text mt-4 text-slate-600"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                    onClick={handleBodyClick}
                  />
                )}
                {s.link_url && s.link_label && (
                  <div className="mt-6">
                    <Link
                      to={s.link_url}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                      {s.link_label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
              {s.image_url && s.image_position === 'right' && (
                <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="block w-full aspect-[4/3] rounded-2xl overflow-hidden" />
              )}
            </div>
          </div>
        </section>
        );
      })}
    </>
  );
}