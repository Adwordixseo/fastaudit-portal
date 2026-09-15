import React from 'react';

export default function TechnologyList({ technology }) {
  if (!technology?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900">Technology Detected</h3>
      <p className="mt-1 text-sm text-slate-500">Software and libraries identified on your page.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {technology.map((t) => (
          <span key={t} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">{t}</span>
        ))}
      </div>
    </div>
  );
}