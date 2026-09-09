import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, ShieldCheck, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { n: '92%', t: 'of clients see ranking gains in 90 days', icon: TrendingUp },
  { n: '1,200+', t: 'websites audited and improved', icon: Globe },
  { n: '24h', t: 'average support ticket response', icon: Zap },
];

export default function Hero() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const go = (e) => { e.preventDefault(); navigate(`/app/audit${url ? `?url=${encodeURIComponent(url)}` : ''}`); };

  return (
    <section className="relative overflow-hidden bg-[#070B1A] text-white">
      {/* Background layers */}
      <div className="grid-fade absolute inset-0" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600/40 via-violet-600/30 to-fuchsia-600/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-32 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-fuchsia-600/30 to-indigo-600/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -top-20 -left-24 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-violet-600/25 to-cyan-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: copy + form */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Free instant audit · AI-search ready · No credit card
            </span>
            <h1 className="mt-7 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Find out why your website <span className="gradient-text">isn't ranking.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 lg:mx-0">
              Run a free SEO & AI-readiness audit in under a minute. Then let our team fix it — with monthly reports, milestone tracking and approvals all in one client portal.
            </p>
            <form onSubmit={go} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-4 transition-colors focus-within:bg-white/10">
                <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourwebsite.com" className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-base font-semibold shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:from-indigo-400 hover:to-violet-400">
                Audit my site <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 lg:justify-start"><ShieldCheck className="h-3.5 w-3.5" /> Free scan · Full PDF report unlocked with any package</p>

            {/* Trust row */}
            <div className="mt-8 flex items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs text-slate-400">4.9/5 from 300+ clients</span>
              </div>
              <div className="hidden h-4 w-px bg-white/10 sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Trusted by 1,200+ sites</span>
              </div>
            </div>
          </motion.div>

          {/* Right: floating audit preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="glow-card relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
            >
              {/* Mock audit header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">SEO Audit Report</div>
                    <div className="text-xs text-slate-400">yourwebsite.com</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Live</span>
              </div>

              {/* Score ring */}
              <div className="my-6 flex items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                    <motion.circle
                      cx="80" cy="80" r="68" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round"
                      initial={{ strokeDasharray: 427, strokeDashoffset: 427 }}
                      animate={{ strokeDashoffset: 427 - (427 * 78) / 100 }}
                      transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="font-heading text-5xl font-extrabold text-white">78</motion.span>
                    <span className="text-xs font-medium text-slate-400">Overall score</span>
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'SEO', value: 82, color: 'from-indigo-500 to-violet-500' },
                  { label: 'Performance', value: 64, color: 'from-amber-500 to-orange-500' },
                  { label: 'Content', value: 90, color: 'from-emerald-500 to-teal-500' },
                  { label: 'AI-readiness', value: 71, color: 'from-fuchsia-500 to-pink-500' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{s.label}</span>
                      <span className="text-xs font-semibold text-white">{s.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -left-6 top-10 rounded-2xl border border-white/10 bg-[#0d1230]/90 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400">Ranking change</div>
                  <div className="text-sm font-bold text-emerald-400">+34 positions</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-4 bottom-8 rounded-2xl border border-white/10 bg-[#0d1230]/90 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">AI-readiness</div>
                  <div className="text-sm font-bold text-amber-300">Optimized</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stat cards */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {stats.map(({ n, t, icon: Icon }) => (
            <motion.div
              key={t}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glow-card rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur transition-colors hover:bg-white/[0.07]"
            >
              <Icon className="mb-2 h-5 w-5 text-indigo-400" />
              <div className="font-heading text-3xl font-bold">{n}</div>
              <div className="mt-1 text-sm text-slate-400">{t}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}