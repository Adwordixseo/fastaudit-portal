import React, { useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { findResource, resourceItems } from '@/lib/siteNav';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContentSectionsRenderer from '@/components/content/ContentSectionsRenderer';
import FaqSection from '@/components/site/FaqSection';
import TableOfContents, { extractHeadings } from '@/components/resources/TableOfContents';
import AuthorBox from '@/components/resources/AuthorBox';

export default function ResourceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: dbResource } = useQuery({
    queryKey: ['resource', slug],
    queryFn: async () => {
      const list = await base44.entities.Resource.filter({ slug, is_active: true });
      return list[0];
    },
    enabled: !!slug,
  });

  const hardcoded = findResource(slug);
  const item = dbResource || hardcoded;
  const isDynamic = !!dbResource;

  const { headings: tocHeadings, html: processedBody } = useMemo(
    () => (isDynamic && dbResource?.body ? extractHeadings(dbResource.body) : { headings: [], html: '' }),
    [isDynamic, dbResource?.body]
  );

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0a0815]">
        <SiteHeader />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-3xl font-bold text-white">Article not found</h1>
          <p className="mt-3 text-slate-400">The resource you're looking for doesn't exist.</p>
          <Button asChild className="mt-6 rounded-full border-none bg-gradient-to-r from-pink-500 to-fuchsia-500"><Link to="/#resources">Back to resources</Link></Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const idx = resourceItems.findIndex((i) => i.slug === slug);
  const prev = idx > 0 ? resourceItems[idx - 1] : null;
  const next = idx < resourceItems.length - 1 ? resourceItems[idx + 1] : null;
  const Icon = hardcoded?.icon || FileText;

  return (
    <div className="min-h-screen bg-[#0a0815]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-pink-950/30 to-[#0a0815]">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/#resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-400 hover:text-pink-300">
              <ArrowLeft className="h-4 w-4" /> Resources
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-400">{item.tag}</span>
              {item.readTime && <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {item.readTime}</span>}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{item.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{item.excerpt}</p>
            <p className="mt-5 text-sm text-slate-500">By {item.author} · {item.date}</p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        {isDynamic && dbResource?.image_url && (
          <img src={dbResource.image_url} alt={dbResource.image_alt || dbResource.title || ''} className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover" />
        )}
        <div className={`grid gap-12 ${isDynamic && tocHeadings.length > 0 ? 'lg:grid-cols-[220px_1fr]' : ''}`}>
          {isDynamic && tocHeadings.length > 0 && (
            <aside className="hidden lg:block min-w-0">
              <div className="sticky top-24 overflow-hidden">
                <TableOfContents headings={tocHeadings} />
              </div>
            </aside>
          )}
          <article className="min-w-0">
            {isDynamic ? (
              <>
                <div className="rich-text rich-text-dark space-y-4" dangerouslySetInnerHTML={{ __html: processedBody }} />
                <AuthorBox
                  name={dbResource.author_name || dbResource.author}
                  position={dbResource.author_position}
                  description={dbResource.author_description}
                  image_url={dbResource.author_image_url}
                  twitter={dbResource.author_twitter}
                  linkedin={dbResource.author_linkedin}
                  website={dbResource.author_website}
                />
              </>
            ) : (
              <div className="space-y-12">
                {item.sections.map((s, i) => (
                  <motion.section key={s.heading} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <h2 className="text-2xl font-bold text-white">{s.heading}</h2>
                    <div className="mt-4 space-y-4">
                      {s.body.map((p, j) => <p key={j} className="text-base leading-relaxed text-slate-300">{p}</p>)}
                    </div>
                  </motion.section>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-gradient-to-br from-pink-600 to-fuchsia-600 p-8 text-center text-white">
              <span className="grid mx-auto h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-xl font-bold">Put this into practice</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-pink-100">Run a free audit on your site and see exactly where to start.</p>
              <Button asChild className="mt-6 rounded-full border-none bg-white px-6 text-pink-600 hover:bg-pink-50"><Link to="/app/audit">Run a free audit <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            </div>
          </article>
        </div>
      </div>

      <FaqSection pagePath={location.pathname} />
      <ContentSectionsRenderer />

      {/* Prev / next */}
      <section className="mx-auto max-w-3xl px-5 pb-20 lg:px-8">
        <div className="grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
          {prev ? (
            <button onClick={() => navigate(`/resources/${prev.slug}`)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-pink-400/40 hover:bg-white/[0.07]">
              <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-pink-400" />
              <span><span className="block text-xs text-slate-500">Previous</span><span className="block text-sm font-semibold text-white">{prev.title}</span></span>
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => navigate(`/resources/${next.slug}`)} className="group flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-right transition-colors hover:border-pink-400/40 hover:bg-white/[0.07]">
              <span><span className="block text-xs text-slate-500">Next</span><span className="block text-sm font-semibold text-white">{next.title}</span></span>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-pink-400" />
            </button>
          ) : <div />}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}