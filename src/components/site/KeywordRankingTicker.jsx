import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Search } from 'lucide-react';

const seedKeywords = [
  { kw: 'seo audit tool', pos: 3, prev: 5 },
  { kw: 'local seo services', pos: 7, prev: 9 },
  { kw: 'keyword rank tracker', pos: 12, prev: 11 },
  { kw: 'technical seo audit', pos: 4, prev: 4 },
  { kw: 'google my business seo', pos: 2, prev: 6 },
  { kw: 'ai search optimization', pos: 9, prev: 14 },
  { kw: 'website speed test', pos: 18, prev: 16 },
  { kw: 'on-page seo checker', pos: 5, prev: 8 },
];

function movement(pos, prev) {
  const diff = prev - pos; // positive = improved (up)
  if (diff > 0) return { dir: 'up', diff, Icon: ArrowUp, tone: 'text-emerald-400' };
  if (diff < 0) return { dir: 'down', diff: Math.abs(diff), Icon: ArrowDown, tone: 'text-rose-400' };
  return { dir: 'same', diff: 0, Icon: Minus, tone: 'text-slate-400' };
}

export default function KeywordRankingTicker() {
  const [keywords, setKeywords] = useState(seedKeywords);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywords((prev) =>
        prev.map((k) => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
          const newPos = Math.max(1, Math.min(50, k.pos + delta));
          return { ...k, prev: k.pos, pos: newPos };
        })
      );
      setTick((t) => t + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glow-card rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
            <Search className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Live Keyword Rankings</div>
            <div className="text-xs text-slate-400">Tracking 248 keywords</div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {keywords.map((k) => {
            const m = movement(k.pos, k.prev);
            return (
              <motion.div
                key={k.kw}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-slate-300">
                    {k.pos}
                  </span>
                  <span className="truncate text-sm text-slate-200">{k.kw}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${k.kw}-${tick}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-0.5 text-xs font-semibold ${m.tone}`}
                    >
                      <m.Icon className="h-3 w-3" />
                      {m.diff > 0 ? m.diff : m.dir === 'same' ? '—' : m.diff}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
        <div>
          <div className="text-xs text-slate-400">Top 3</div>
          <div className="text-sm font-bold text-emerald-400">42</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Top 10</div>
          <div className="text-sm font-bold text-white">118</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Improved</div>
          <div className="text-sm font-bold text-indigo-400">+26 this week</div>
        </div>
      </div>
    </div>
  );
}