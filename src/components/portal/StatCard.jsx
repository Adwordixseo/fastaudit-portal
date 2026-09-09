import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, hint, tone = 'indigo' }) {
  const tones = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'group-hover:ring-indigo-200', bar: 'from-indigo-500 to-violet-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'group-hover:ring-emerald-200', bar: 'from-emerald-500 to-teal-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'group-hover:ring-amber-200', bar: 'from-amber-500 to-orange-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'group-hover:ring-rose-200', bar: 'from-rose-500 to-pink-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'group-hover:ring-violet-200', bar: 'from-violet-500 to-fuchsia-500' },
  };
  const t = tones[tone] || tones.indigo;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100', t.bar)} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && (
          <span className={cn('grid h-9 w-9 place-items-center rounded-xl ring-2 ring-transparent transition-all duration-300', t.bg, t.text, t.ring)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 font-heading text-3xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </motion.div>
  );
}