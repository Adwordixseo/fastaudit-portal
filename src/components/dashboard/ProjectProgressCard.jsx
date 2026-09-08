import React from 'react';
import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProjectProgressCard({ project, milestones = [], onClick }) {
  const done = milestones.filter((m) => m.status === 'done').length;
  return (
    <button onClick={onClick} className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{project.name}</h3>
          {project.website && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><Globe className="h-3 w-3" /> {project.website}</p>}
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>Progress</span><span className="font-semibold text-slate-900">{project.progress || 0}%</span>
      </div>
      <Progress value={project.progress || 0} className="mt-2 h-2" />
      <p className="mt-3 text-xs text-slate-500">{done} of {milestones.length} milestones completed</p>
    </button>
  );
}