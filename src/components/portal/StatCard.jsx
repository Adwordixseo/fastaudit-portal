import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, hint, tone = 'indigo' }) {
  const tones = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600', violet: 'bg-violet-50 text-violet-600' };
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && <span className={cn('grid h-9 w-9 place-items-center rounded-xl', tones[tone])}><Icon className="h-4 w-4" /></span>}
      </div>
      <div className="mt-3 font-heading text-3xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}