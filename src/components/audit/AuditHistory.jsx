import React from 'react';
import { cn } from '@/lib/utils';
import { fmtDate, scoreColor } from '@/lib/format';

export default function AuditHistory({ audits, selectedId, onSelect }) {
  if (!audits.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900">Audit history</h3>
      <ul className="mt-4 divide-y divide-slate-100">
        {audits.map((a) => (
          <li key={a.id}>
            <button onClick={() => onSelect(a)} className={cn('flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-indigo-600', selectedId === a.id && 'text-indigo-600')}>
              <div className="min-w-0"><div className="truncate text-sm font-medium">{a.url}</div><div className="text-xs text-slate-400">{fmtDate(a.created_date)}</div></div>
              <span className={cn('font-heading text-xl font-bold', scoreColor(a.overall_score))}>{a.overall_score}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}