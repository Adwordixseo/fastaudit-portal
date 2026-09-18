import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Rocket, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';

const items = [
  { icon: Building2, title: 'Agencies', slug: 'agencies', text: 'Choose a professional and expert white-label website audit tool to track multiple clients in one place.' },
  { icon: Rocket, title: 'SaaS & Startups', slug: 'saas-startups', text: 'With advanced SEO audits, find the real gaps and target high-intent searches for your solutions.' },
  { icon: ShoppingBag, title: 'E-Commerce', slug: 'ecommerce', text: 'Get precise SEO audit reports and track how you can convert your potential consumers into your customers.' },
  { icon: MapPin, title: 'Local Businesses', slug: 'local-business', text: 'Never miss a near-me search for your service or product. See where you can win the high-intent searches.' },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Solutions</span>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">SEO insights aligned with your business model</h2>
          </div>
          <p className="max-w-md text-slate-400">Whether you sell a product, a service, or software, get free SEO audits and more for precise results.</p>
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