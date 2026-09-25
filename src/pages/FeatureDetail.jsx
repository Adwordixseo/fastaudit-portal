import React from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findItem, platformItems, solutionsItems } from '@/lib/siteNav';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ContentSectionsRenderer from '@/components/content/ContentSectionsRenderer';
import FaqSection from '@/components/site/FaqSection';

export default function FeatureDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const category = location.pathname.startsWith('/platform') ? 'platform' : 'solutions';
  const navigate = useNavigate();
  const item = findItem(category, slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0a0815]">
        <SiteHeader />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
          <h1 className="text-3xl font-bold text-white">Page not found</h1>
          <p className="mt-3 text-slate-400">The page you're looking for doesn't exist.</p>
          <Button asChild className="mt-6 rounded-full border-none bg-gradient-to-r from-pink-500 to-fuchsia-500"><Link to="/">Back home</Link></Button>
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
    <div className="min-h-screen bg-[#0a0815]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-pink-950/30 to-[#0a0815]">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to={`/#${isPlatform ? 'platform' : 'solutions'}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-400 hover:text-pink-300">
              <ArrowLeft className="h-4 w-4" /> {isPlatform ? 'Platform' : 'Solutions'}
            </Link>
            <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/30">
              <Icon className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{item.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full border-none bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-fuchsia-400"><Link to="/app/audit">Run a free audit <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/30 px-6 text-white hover:bg-white/10 hover:text-white"><Link to={item.secondaryCta?.to || '/#pricing'}>{item.secondaryCta?.label || 'View pricing'}</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {item.stats && (
        <section className="border-y border-white/10 bg-[#0f0a1e]">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-5 py-12 lg:grid-cols-4 lg:px-8">
            {item.stats.map((s) => (
              <div key={s.label} className="px-4 text-center">
                <div className="font-heading text-3xl font-extrabold text-pink-400">{s.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic content sections */}
      <ContentSectionsRenderer />

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <h2 className="text-2xl font-bold text-white">What you get</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {item.features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/15 text-pink-400">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      {item.steps && (
        <section className="bg-[#0f0a1e]">
          <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
            <h2 className="text-2xl font-bold text-white">How it works</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {item.steps.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FaqSection pagePath={location.pathname} fallbackFaqs={item.faq} />

      {/* Prev / next */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <div className="grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
          {prev ? (
            <button onClick={() => navigate(`/${category}/${prev.slug}`)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-pink-400/40 hover:bg-white/[0.07]">
              <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-pink-400" />
              <span><span className="block text-xs text-slate-500">Previous</span><span className="block text-sm font-semibold text-white">{prev.title}</span></span>
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => navigate(`/${category}/${next.slug}`)} className="group flex items-center justify-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-right transition-colors hover:border-pink-400/40 hover:bg-white/[0.07]">
              <span><span className="block text-xs text-slate-500">Next</span><span className="block text-sm font-semibold text-white">{next.title}</span></span>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-pink-400" />
            </button>
          ) : <div />}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}