import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resourceItems } from '@/lib/siteNav';

export default function ResourcesSection() {
  return (
    <section id="resources" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Resources</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">Learn what drives rankings.</h2>
        </div>
        <Link to="/app/audit" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">Start with a free audit <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {resourceItems.map((it) => {
          const Icon = it.icon;
          return (
            <Link key={it.slug} to={`/resources/${it.slug}`} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 transition hover:border-indigo-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{it.tag}</span>
                <Icon className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{it.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{it.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-700">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}