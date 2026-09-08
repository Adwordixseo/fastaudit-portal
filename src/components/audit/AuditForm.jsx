import React, { useState } from 'react';
import { Globe, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuditForm({ initialUrl = '', onRun, running }) {
  const [url, setUrl] = useState(initialUrl);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (url.trim()) onRun(url.trim()); }}
      className="relative overflow-hidden rounded-3xl bg-[#0B1020] p-6 text-white sm:p-8">
      <div className="grid-fade absolute inset-0" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"><Sparkles className="h-3.5 w-3.5" /> Free website audit</span>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Which website should we analyse?</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4">
            <Globe className="h-4 w-4 text-slate-400" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourwebsite.com" disabled={running} className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
          </div>
          <Button type="submit" disabled={running || !url.trim()} className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-semibold hover:from-indigo-400 hover:to-violet-400">
            {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : 'Run audit'}
          </Button>
        </div>
        {running && <p className="mt-3 text-xs text-slate-400">Fetching your page, checking 20+ signals and writing your report. This takes 20–40 seconds.</p>}
      </div>
    </form>
  );
}