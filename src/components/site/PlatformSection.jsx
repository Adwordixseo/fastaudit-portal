import React from 'react';
import { motion } from 'framer-motion';
import { Search, FolderKanban, FileText, CheckCircle2, LifeBuoy, RefreshCw } from 'lucide-react';

const items = [
  { icon: Search, title: 'Instant Website Audit', text: "Find what is working against your website's success with our instant, free SEO audit reports." },
  { icon: FolderKanban, title: 'Project Progress', text: 'Access an advanced dashboard to see what\u2019s happening and keep track of milestone achievements.' },
  { icon: FileText, title: 'Monthly Reports', text: 'Get easy-to-understand and downloadable SEO audit reports from one online SEO platform every month.' },
  { icon: CheckCircle2, title: 'One-Click Approvals', text: 'Handle approvals and key SEO deliverables with a one-click, easy-to-access automated dashboard.' },
  { icon: LifeBuoy, title: 'Support Tickets', text: 'Need help or have a question? Raise a support ticket, and the entire conversation will be together.' },
  { icon: RefreshCw, title: 'Renew & Upgrade', text: 'Review your SEO package and plan status, and renew or upgrade it for continuous SEO improvement.' },
];

export default function PlatformSection() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Features Beyond Audit</span>
        <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">From SEO audits to monthly progress, everything is done right on a single-click-accessible platform by Adwordix LLC.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-all hover:-translate-y-1 hover:border-pink-400/40 hover:bg-white/[0.07]">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-500/15 text-pink-400 transition-colors group-hover:bg-pink-500 group-hover:text-white">
              <it.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}