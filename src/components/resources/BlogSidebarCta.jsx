import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = ['Instant 0\u2013100 score', 'Prioritised fix list', 'AI-readiness check'];

export default function BlogSidebarCta() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-pink-600/15 to-fuchsia-600/[0.04] p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/30">
        <Search className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-heading text-base font-bold text-white">Free website audit</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
        Score your SEO, performance, content and AI-readiness in under a minute.
      </p>
      <ul className="mt-4 space-y-1.5">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Button asChild size="sm" className="mt-5 w-full rounded-full border-none bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-400 hover:to-fuchsia-400">
        <Link to="/app/audit">Run a free audit <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
      </Button>
      <Link to="/pricing" className="mt-3 block text-center text-xs font-medium text-pink-400 hover:text-pink-300">
        View SEO packages
      </Link>
    </div>
  );
}