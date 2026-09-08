import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { fmtDate } from '@/lib/format';

const icon = { done: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, in_progress: <Clock className="h-5 w-5 text-indigo-500" />, pending: <Circle className="h-5 w-5 text-slate-300" /> };

export default function MilestoneList({ milestones, onToggle }) {
  if (!milestones.length) return <p className="text-sm text-slate-500">No milestones added yet.</p>;
  return (
    <ul className="space-y-2">
      {milestones.map((m) => (
        <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
          {onToggle ? <button onClick={() => onToggle(m)} title="Cycle status">{icon[m.status]}</button> : icon[m.status]}
          <div className="min-w-0 flex-1">
            <div className={`text-sm font-medium ${m.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.title}</div>
            {m.due_date && <div className="text-xs text-slate-400">Due {fmtDate(m.due_date)}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}