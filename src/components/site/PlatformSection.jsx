import React from 'react';
import { motion } from 'framer-motion';
import { Search, FolderKanban, FileText, CheckCircle2, LifeBuoy, RefreshCw } from 'lucide-react';

const items = [
  { icon: Search, title: 'Instant Website Audit', text: 'Score your SEO, performance, content and AI-readiness with a prioritised fix list.' },
  { icon: FolderKanban, title: 'Project Progress', text: 'Watch every milestone move from pending to done with live progress bars.' },
  { icon: FileText, title: 'Monthly Reports', text: 'PDFs, documents and spreadsheets delivered to your dashboard — preview or download.' },
  { icon: CheckCircle2, title: 'One-click Approvals', text: 'Approve deliverables or request changes, with a full history log per document.' },
  { icon: LifeBuoy, title: 'Support Tickets', text: 'Raise a ticket, track its status and keep the whole conversation in one thread.' },
  { icon: RefreshCw, title: 'Renew & Upgrade', text: 'See active and expired packages and renew or scale up in a couple of clicks.' },
];

export default function PlatformSection() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">The features</span>
        <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Everything your SEO project needs, in one portal.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <it.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}