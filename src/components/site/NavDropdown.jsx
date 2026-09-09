import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function NavDropdown({ label, items, basePath, overview }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => { setOpen(false); setActive(0); }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-1/2 top-full z-50 w-[40rem] -translate-x-1/2 pt-3"
          >
            <div className="grid grid-cols-[1.4fr_1fr] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              {/* Items column */}
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
                {items.map((it, i) => (
                  <Link
                    key={it.slug}
                    to={`${basePath}/${it.slug}`}
                    onMouseEnter={() => setActive(i)}
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

              {/* Featured panel */}
              <div className="relative flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">{label}</div>
                  <div className="mt-3 h-px w-10 bg-white/30" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4"
                    >
                      <div className="flex items-center gap-2">
                        {(() => { const Ic = items[active].icon; return <Ic className="h-5 w-5 text-indigo-200" />; })()}
                        <span className="text-sm font-bold">{items[active].title}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-indigo-100">{items[active].tagline}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <Link
                  to={`${basePath}/${items[active].slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-indigo-200"
                >
                  Explore {label.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}