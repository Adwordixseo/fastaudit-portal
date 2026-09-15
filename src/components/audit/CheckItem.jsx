import React from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

const ICONS = {
  pass: <Check className="h-4 w-4 text-emerald-600" />,
  fail: <X className="h-4 w-4 text-rose-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-slate-400" />
};

export default function CheckItem({ check }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{check.title}</span>
        {ICONS[check.status] || ICONS.info}
      </div>
      {check.value && <p className="mt-1 text-xs font-medium text-slate-400">{check.value}</p>}
      {check.detail && <p className="mt-1.5 text-sm text-slate-500">{check.detail}</p>}
    </div>
  );
}