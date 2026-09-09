import React from 'react';
import { Clock, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/portal/EmptyState';
import { fmtDate, fileTypeFromName } from '@/lib/format';

export default function PendingApprovalsPanel({ docs = [], projects = [] }) {
  const projectName = (id) => projects.find((p) => p.id === id)?.name || 'Project';
  const pending = docs
    .filter((d) => d.status === 'awaiting_approval' || d.status === 'changes_requested')
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600"><Clock className="h-4 w-4" /></span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pending client approval</h2>
          <p className="text-xs text-slate-500">Deliverables shared with clients awaiting their decision.</p>
        </div>
      </div>
      {pending.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nothing pending" text="No deliverables are waiting on client approval right now." />
      ) : (
        <div className="space-y-2.5">
          {pending.map((d) => {
            const approval = (d.history || []).find((h) => h.action === 'approved');
            const change = (d.history || []).find((h) => h.action === 'changes_requested');
            return (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{d.title}</p>
                  <p className="text-xs text-slate-500">{projectName(d.project_id)} · {fileTypeFromName(d.file_url || d.title)} · {fmtDate(d.created_date)}</p>
                  {d.status === 'changes_requested' && change && <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-rose-600"><MessageSquare className="h-3 w-3" /> Changes requested{change.by ? ` by ${change.by}` : ''}{change.note ? `: "${change.note}"` : ''}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-300" />
                  <StatusBadge status={d.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}