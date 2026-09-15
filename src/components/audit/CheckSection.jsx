import React from 'react';
import CheckItem from '@/components/audit/CheckItem';

export default function CheckSection({ title, checks }) {
  if (!checks?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {checks.map((c, idx) => <CheckItem key={idx} check={c} />)}
      </div>
    </div>
  );
}