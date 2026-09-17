import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Rocket, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';

const items = [
  { icon: Building2, title: 'Agencies', slug: 'agencies', text: 'White-glove reporting for every client project, delivered through one branded portal.' },
  { icon: Rocket, title: 'SaaS & Startups', slug: 'saas-startups', text: 'Own the answers buyers ask Google and AI assistants at every stage of the funnel.' },
  { icon: ShoppingBag, title: 'E-Commerce', slug: 'ecommerce', text: 'Win product-intent searches and turn category pages into revenue machines.' },
  { icon: MapPin, title: 'Local Business', slug: 'local-business', text: 'Show up first on the map and in "near me" searches with local SEO that compounds.' },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Solutions</span>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Built for how you grow.</h2>
          </div>
          <p className="max-w-md text-slate-400">Whatever you sell, the process is the same: audit, fix, report, approve, repeat — and watch the graph go up.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <Link key={it.title} to={`/solutions/${it.slug}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7 transition-colors hover:border-indigo-400/40 hover:from-white/[0.1]">
              <it.icon className="h-6 w-6 text-indigo-300" />
              <h3 className="mt-6 text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{it.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 opacity-0 transition-opacity group-hover:opacity-100">Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}