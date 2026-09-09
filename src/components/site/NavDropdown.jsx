import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function NavDropdown({ label, items, basePath }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-3">
          <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5">
            {items.map((it) => (
              <Link
                key={it.slug}
                to={`${basePath}/${it.slug}`}
                className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-indigo-50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <it.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{it.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500">{it.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}