import React from 'react';
import { Download, Lock, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScoreRing from '@/components/audit/ScoreRing';
import StatusBadge from '@/components/ui/StatusBadge';
import { fmtDateTime } from '@/lib/format';

export default function AuditResult({ audit, canDownload, onDownload }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <ScoreRing value={audit.overall_score} size={132} stroke={10} />
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Overall score</span>
              <h2 className="mt-1 break-all text-xl font-bold text-slate-900">{audit.url}</h2>
              <p className="mt-1 text-xs text-slate-400">Audited {fmtDateTime(audit.created_date)}</p>
            </div>
          </div>
          <Button onClick={onDownload} size="lg" className="rounded-xl font-semibold">
            {canDownload ? <Download className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />} Download PDF report
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 sm:grid-cols-5">
          {Object.entries(audit.scores || {}).map(([k, v]) => <ScoreRing key={k} value={v} size={84} stroke={7} label={k} />)}
        </div>
        <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">{audit.summary}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900"><AlertTriangle className="h-4 w-4 text-rose-500" /> Issues found ({audit.issues?.length || 0})</h3>
          <ul className="mt-4 space-y-4">
            {(audit.issues || []).map((i, idx) => (
              <li key={idx} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-slate-900">{i.title}</span><StatusBadge status={i.severity} /></div>
                <p className="mt-1.5 text-sm text-slate-500">{i.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /> Recommendations</h3>
          <ol className="mt-4 space-y-3">
            {(audit.recommendations || []).map((r, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">{idx + 1}</span><span>{r}</span></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}