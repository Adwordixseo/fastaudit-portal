import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Gauge, Target } from 'lucide-react';

const items = [
  { icon: Gauge, tag: 'Guide', title: 'What a good SEO score actually means', text: 'How to read your audit scores and which fixes move the needle first.' },
  { icon: Bot, tag: 'AI Search', title: 'Getting cited by ChatGPT & Google AI Overviews', text: 'Structured data, quotable passages and entity clarity — explained simply.' },
  { icon: Target, tag: 'Playbook', title: 'A 90-day SEO roadmap for small teams', text: 'The exact milestone plan we run inside every client project.' },
];

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
        {items.map((it) => (
          <article key={it.title} className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:border-indigo-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{it.tag}</span>
              <it.icon className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{it.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}