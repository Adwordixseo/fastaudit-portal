import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findItem, platformItems, solutionsItems } from '@/lib/siteNav';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export default function FeatureDetail() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const item = findItem(category, slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
          <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
          <Button asChild className="mt-6 rounded-full"><Link to="/">Back home</Link></Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const isPlatform = category === 'platform';
  const list = isPlatform ? platformItems : solutionsItems;
  const idx = list.findIndex((i) => i.slug === slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;
  const Icon = item.icon;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to={`/#${isPlatform ? 'platform' : 'solutions'}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-4 w-4" /> {isPlatform ? 'Platform' : 'Solutions'}
            </Link>
            <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <Icon className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{item.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 shadow-lg shadow-indigo-500/25"><Link to="/app/audit">Run a free audit <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6"><Link to="/#pricing">View pricing</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">What you get</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {item.features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prev / next */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <div className="grid gap-4 border-t border-slate-100 pt-10 sm:grid-cols-2">
          {prev ? (
            <button onClick={() => navigate(`/${category}/${prev.slug}`)} className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
              <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
              <span><span className="block text-xs text-slate-400">Previous</span><span className="block text-sm font-semibold text-slate-900">{prev.title}</span></span>
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => navigate(`/${category}/${next.slug}`)} className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 p-4 text-right transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
              <span><span className="block text-xs text-slate-400">Next</span><span className="block text-sm font-semibold text-slate-900">{next.title}</span></span>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
            </button>
          ) : <div />}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}