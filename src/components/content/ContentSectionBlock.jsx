import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

const bgClasses = {
  white: 'bg-[#0a0815]',
  slate: 'bg-[#0f0a1e]',
  indigo: 'bg-pink-950/20',
};

export default function ContentSectionBlock({ section: s }) {
  const navigate = useNavigate();
  const isSideBySide = s.image_url && (s.image_position === 'left' || s.image_position === 'right');

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
    <section className={`py-16 ${bgClasses[s.background] || 'bg-[#0a0815]'}`}>
      <div className="mx-auto max-w-4xl px-6">
        {s.image_url && s.image_position === 'top' && (
          <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="mb-8 block w-full aspect-[16/9] rounded-2xl overflow-hidden" />
        )}
        <div className={isSideBySide ? 'grid gap-8 md:grid-cols-2 md:items-center' : ''}>
          {s.image_url && s.image_position === 'left' && (
            <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="block w-full aspect-[4/3] rounded-2xl overflow-hidden" />
          )}
          <div>
            {s.heading && <h2 className="text-3xl font-bold tracking-tight text-white">{s.heading}</h2>}
            {s.body && (
              <div
                className="rich-text rich-text-dark mt-4 text-slate-300"
                style={s.columns > 1 ? { columnCount: s.columns, columnGap: '2rem' } : undefined}
                dangerouslySetInnerHTML={{ __html: s.body }}
                onClick={handleBodyClick}
              />
            )}
            {(s.link_url && s.link_label) || (s.extra_links && s.extra_links.length > 0) ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {s.link_url && s.link_label && (
                  <Link
                    to={s.link_url}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:from-pink-400 hover:to-fuchsia-400"
                  >
                    {s.link_label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {s.extra_links?.filter((l) => l.url && l.label).map((l, i) => (
                  <Link
                    key={i}
                    to={l.url}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-pink-400/40 hover:text-pink-300"
                  >
                    {l.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {s.image_url && s.image_position === 'right' && (
            <Image src={s.image_url} alt={s.image_alt || ''} fittingType="fill" className="block w-full aspect-[4/3] rounded-2xl overflow-hidden" />
          )}
        </div>
      </div>
    </section>
  );
}