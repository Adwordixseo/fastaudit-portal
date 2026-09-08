import React from 'react';
import { cn } from '@/lib/utils';
import { statusTone, humanize } from '@/lib/format';

export default function StatusBadge({ status, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', statusTone[status] || 'bg-slate-100 text-slate-600 border-slate-200', className)}>
      {humanize(status)}
    </span>
  );
}