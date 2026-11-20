import React from 'react';
import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import StatusBadge from '@/components/ui/StatusBadge';
import { projectProgress } from '@/lib/format';

export default function ProjectProgressOverview({ projects = [], milestones = [] }) {
  if (projects.length === 0) return <p className="text-sm text-slate-500">No projects yet.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => {
        const { pct, done, total } = projectProgress(p, milestones.filter((m) => m.project_id === p.id));
        return (
          <div key={p.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">{p.name}</h3>
                {p.website && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><Globe className="h-3 w-3 shrink-0" /> {p.website}</p>}
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={pct} className="h-2 flex-1" />
              <span className="text-xs font-semibold text-slate-700">{pct}%</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{done} of {total} milestones completed</p>
          </div>
        );
      })}
    </div>
  );
}