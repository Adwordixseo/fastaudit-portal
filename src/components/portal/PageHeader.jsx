import React from 'react';

export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</span>}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}