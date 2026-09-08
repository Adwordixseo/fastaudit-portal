import React from 'react';

const steps = [
  { n: '01', title: 'Audit your website', text: 'Enter your URL and get a scored report with the issues holding you back.' },
  { n: '02', title: 'Pick a growth package', text: 'Unlock the full PDF report and choose monthly, quarterly or yearly billing.' },
  { n: '03', title: 'Track, approve, grow', text: 'Follow milestones, review monthly reports and approve deliverables from your dashboard.' },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">How it works</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">From first audit to first-page results.</h2>
          <p className="mt-5 text-slate-500">No spreadsheets, no lost emails. Every step of your SEO engagement lives in the portal.</p>
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