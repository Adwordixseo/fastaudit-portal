import React, { useState } from 'react';
import { Globe, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function validateAuditUrl(input) {
  const v = input.trim();
  if (!v) return 'Please enter a website URL';
  let withProto = v;
  if (!/^https?:\/\//i.test(withProto)) withProto = 'https://' + withProto;
  let u;
  try { u = new URL(withProto); } catch { return 'Enter a valid URL (e.g. example.com or example.com/about)'; }
  if (!u.hostname || !u.hostname.includes('.') || u.hostname.length < 4) return 'Enter a valid domain (e.g. example.com)';
  return '';
}

export default function AuditForm({ initialUrl = '', onRun, running }) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const err = validateAuditUrl(url);
    if (err) { setError(err); return; }
    setError('');
    onRun(url.trim());
  };

  return (
    <form onSubmit={submit}
      className="relative overflow-hidden rounded-3xl bg-[#0B1020] p-6 text-white sm:p-8">
      <div className="grid-fade absolute inset-0" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"><Sparkles className="h-3.5 w-3.5" /> Free website audit</span>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Which website should we analyse?</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4">
            <Globe className="h-4 w-4 text-slate-400" />
            <input value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} placeholder="example.com or example.com/about" disabled={running} className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
          </div>
          <Button type="submit" disabled={running || !url.trim()} className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-semibold hover:from-indigo-400 hover:to-violet-400">
            {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : 'Run audit'}
          </Button>
        </div>
        {error && <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-400"><AlertCircle className="h-3.5 w-3.5" /> {error}</p>}
        {running ? <p className="mt-3 text-xs text-slate-400">Fetching your page, checking 20+ signals and writing your report. This takes 20–40 seconds.</p> : !error && <p className="mt-3 text-xs text-slate-400">Enter a specific page URL to audit that page, or just a domain to audit the homepage.</p>}
      </div>
    </form>
  );
}