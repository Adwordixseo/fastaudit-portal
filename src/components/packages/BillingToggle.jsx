import React from 'react';
import { cn } from '@/lib/utils';

const cycles = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly', badge: 'Save 10%' },
  { id: 'yearly', label: 'Yearly', badge: 'Save 20%' },
];

export default function BillingToggle({ value, onChange, dark = false }) {
  return (
    <div className={cn('inline-flex rounded-full border p-1', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100')}>
      {cycles.map((c) => (
        <button key={c.id} type="button" onClick={() => onChange(c.id)}
          className={cn('relative rounded-full px-4 py-2 text-sm font-medium transition-all', value === c.id ? 'bg-white text-slate-900 shadow-sm' : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
          {c.label}
          {c.badge && <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">{c.badge}</span>}
        </button>
      ))}
    </div>
  );
}