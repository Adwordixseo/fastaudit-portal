import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const go = (e) => { e.preventDefault(); navigate(`/app/audit${url ? `?url=${encodeURIComponent(url)}` : ''}`); };

  return (
    <section className="relative overflow-hidden bg-[#070B1A] text-white">
      <div className="grid-fade absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600/40 via-violet-600/30 to-fuchsia-600/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Free instant audit · AI-search ready · No credit card
          </span>
          <h1 className="mt-7 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            Find out why your website <span className="gradient-text">isn't ranking.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Run a free SEO & AI-readiness audit in under a minute. Then let our team fix it — with monthly reports, milestone tracking and approvals all in one client portal.
          </p>
          <form onSubmit={go} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-4">
              <Globe className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourwebsite.com" className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-base font-semibold shadow-xl shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-400">
              Audit my site <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Free scan · Full PDF report unlocked with any package</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[['92%', 'of clients see ranking gains in 90 days'], ['1,200+', 'websites audited and improved'], ['24h', 'average support ticket response']].map(([n, t]) => (
            <div key={t} className="glow-card rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur">
              <div className="font-heading text-3xl font-bold">{n}</div>
              <div className="mt-1 text-sm text-slate-400">{t}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}