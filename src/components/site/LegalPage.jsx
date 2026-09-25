import React from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export default function LegalPage({ title, subtitle, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-[#0a0815]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">Legal</p>
        <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-slate-400">{subtitle}</p>}
        {lastUpdated && <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>}
        <div className="mt-10 space-y-8 leading-relaxed text-slate-300">{children}</div>
      </section>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
    </section>
  );
}