import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Article not found</h1>
          <p className="mt-3 text-slate-500">The resource you're looking for doesn't exist.</p>
          <Button asChild className="mt-6 rounded-full"><Link to="/#resources">Back to resources</Link></Button>
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
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/#resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-4 w-4" /> Resources
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{item.tag}</span>
              {item.readTime && <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {item.readTime}</span>}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{item.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.excerpt}</p>
            <p className="mt-5 text-sm text-slate-400">By {item.author} · {item.date}</p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className={`grid gap-10 ${isDynamic && tocHeadings.length > 0 ? 'lg:grid-cols-[200px_1fr]' : ''}`}>
          {isDynamic && tocHeadings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={tocHeadings} />
              </div>
            </aside>
          )}
          <article className="max-w-3xl">
            {isDynamic ? (
              <>
                {dbResource.image_url && (
                  <img src={dbResource.image_url} alt="" className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover" />
                )}
                <div className="rich-text space-y-4" dangerouslySetInnerHTML={{ __html: processedBody }} />
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
                    <h2 className="text-2xl font-bold text-slate-900">{s.heading}</h2>
                    <div className="mt-4 space-y-4">
                      {s.body.map((p, j) => <p key={j} className="text-base leading-relaxed text-slate-600">{p}</p>)}
                    </div>
                  </motion.section>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-center text-white">
              <span className="grid mx-auto h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-xl font-bold">Put this into practice</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-indigo-100">Run a free audit on your site and see exactly where to start.</p>
              <Button asChild className="mt-6 rounded-full bg-white px-6 text-indigo-700 hover:bg-indigo-50"><Link to="/app/audit">Run a free audit <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            </div>
          </article>
        </div>
      </div>

      <FaqSection pagePath={location.pathname} />
      <ContentSectionsRenderer />

      {/* Prev / next */}
      <section className="mx-auto max-w-3xl px-5 pb-20 lg:px-8">
        <div className="grid gap-4 border-t border-slate-100 pt-10 sm:grid-cols-2">
          {prev ? (
            <button onClick={() => navigate(`/resources/${prev.slug}`)} className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
              <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
              <span><span className="block text-xs text-slate-400">Previous</span><span className="block text-sm font-semibold text-slate-900">{prev.title}</span></span>
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => navigate(`/resources/${next.slug}`)} className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 p-4 text-right transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
              <span><span className="block text-xs text-slate-400">Next</span><span className="block text-sm font-semibold text-slate-900">{next.title}</span></span>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
            </button>
          ) : <div />}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}