import React from 'react';

const steps = [
  { n: '01', title: 'Run Your Free SEO Audit', text: 'Enter your website URL and get a free SEO audit report, including key issues and missed opportunities.' },
  { n: '02', title: 'Choose Your SEO Package', text: 'There are three SEO packages to meet your needs, and all lead to building a stronger website ready to rank.' },
  { n: '03', title: 'Continuous SEO Improvements', text: 'Clear the issues, achieve the milestones, and track your regular SEO progress from a single dashboard.' },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">How It Works</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">From a free SEO report to a stronger website.</h2>
          <p className="mt-5 text-slate-500">The first report shows what\u2019s wrong, and you enroll in monthly progress and AI-SEO success.</p>
        </div>
        <ol className="space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200">
              <span className="font-heading text-3xl font-extrabold gradient-text">{s.n}</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}