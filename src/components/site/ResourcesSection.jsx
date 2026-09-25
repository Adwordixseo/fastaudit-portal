import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ResourcesSection() {
  const { data: dbResources = [] } = useQuery({
    queryKey: ['resources-active-home'],
    queryFn: () => base44.entities.Resource.filter({ is_active: true }, '-created_date', 3),
  });

  const cards = dbResources.map((r) => ({
    slug: r.slug,
    icon: FileText,
    tag: r.tag || 'Article',
    title: r.title,
    excerpt: r.excerpt || '',
    image_url: r.image_url,
  }));

  return (
    <section id="resources" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Resources</span>
          <h2 className="mt-3 text-4xl font-bold text-white">Learn How to Lead the Market With a Free SEO Audit</h2>
        </div>
        <Link to="/resources" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-400 hover:text-pink-300">View all resources <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map((it) => {
          const Icon = it.icon;
          return (
            <Link key={it.slug} to={`/resources/${it.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur transition hover:border-pink-400/40 hover:bg-white/[0.07]">
              {it.image_url && <img src={it.image_url} alt="" className="aspect-[16/9] w-full object-cover" />}
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-400">{it.tag}</span>
                  <Icon className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{it.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{it.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-pink-400 transition-colors group-hover:text-pink-300">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}