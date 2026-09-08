import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { money, cyclePrice, cycleLabel } from '@/lib/format';

export default function PackageCard({ pkg, cycle, onSelect, ctaLabel = 'Get started' }) {
  const price = cyclePrice(pkg, cycle);
  return (
    <div className={cn('relative flex flex-col rounded-3xl border p-7 transition-all hover:-translate-y-1',
      pkg.highlight ? 'border-transparent bg-gradient-to-b from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/30' : 'border-slate-200 bg-white text-slate-900 hover:shadow-xl hover:shadow-indigo-500/10')}>
      {pkg.highlight && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900"><Star className="h-3 w-3 fill-current" /> Most popular</span>
      )}
      <h3 className="text-xl font-semibold">{pkg.name}</h3>
      <p className={cn('mt-1 text-sm', pkg.highlight ? 'text-indigo-100' : 'text-slate-500')}>{pkg.tagline}</p>
      <div className="mt-6 flex items-end gap-1">
        <span className="font-heading text-5xl font-extrabold tracking-tight">{money(price)}</span>
        <span className={cn('mb-2 text-sm', pkg.highlight ? 'text-indigo-200' : 'text-slate-500')}>{cycleLabel[cycle]}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {(pkg.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check className={cn('mt-0.5 h-4 w-4 shrink-0', pkg.highlight ? 'text-emerald-300' : 'text-indigo-600')} /> <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button onClick={() => onSelect?.(pkg)} size="lg" className={cn('mt-8 w-full rounded-xl font-semibold', pkg.highlight ? 'bg-white text-indigo-700 hover:bg-indigo-50' : '')}>
        {ctaLabel}
      </Button>
    </div>
  );
}