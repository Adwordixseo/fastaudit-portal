import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { resourceItems } from '@/lib/siteNav';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export default function Resources() {
  const { data: dbResources = [] } = useQuery({
    queryKey: ['resources-active'],
    queryFn: () => base44.entities.Resource.filter({ is_active: true }, '-created_date', 100),
  });

  const dynamicCards = dbResources.map((r) => ({
    slug: r.slug,
    icon: FileText,
    tag: r.tag || 'Article',
    title: r.title,
    excerpt: r.excerpt || '',
    image_url: r.image_url,
  }));

  const allCards = [...dynamicCards, ...resourceItems];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Resources</span>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Learn How to Lead the Market With a Free SEO Audit</h1>
            <p className="mt-4 text-slate-500">Insights, guides and playbooks on SEO, AI-readiness and growth — latest first.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allCards.map((it) => {
              const Icon = it.icon;
              return (
                <Link key={it.slug} to={`/resources/${it.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-indigo-200 hover:shadow-lg">
                  {it.image_url && <img src={it.image_url} alt="" className="aspect-[16/9] w-full object-cover" />}
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{it.tag}</span>
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{it.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{it.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-700">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}