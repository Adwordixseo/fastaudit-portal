import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { fmtDate } from '@/lib/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS = {
  done: { icon: CheckCircle2, label: 'Done', iconClass: 'text-emerald-500', chip: 'border-emerald-100 bg-emerald-50 text-emerald-700' },
  in_progress: { icon: Clock, label: 'In progress', iconClass: 'text-indigo-500', chip: 'border-indigo-100 bg-indigo-50 text-indigo-700' },
  pending: { icon: Circle, label: 'Pending', iconClass: 'text-slate-300', chip: 'border-slate-200 bg-slate-50 text-slate-600' },
};

const statusOf = (m) => STATUS[m.status] || STATUS.pending;

export default function MilestoneList({ milestones, onStatusChange }) {
  if (!milestones.length) return <p className="text-sm text-slate-500">No milestones added yet.</p>;
  return (
    <ul className="space-y-2">
      {milestones.map((m) => {
        const s = statusOf(m);
        const Icon = s.icon;
        return (
          <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
            <Icon className={`h-5 w-5 shrink-0 ${s.iconClass}`} />
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-medium ${m.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.title}</div>
              {m.due_date && <div className="text-xs text-slate-400">Due {fmtDate(m.due_date)}</div>}
            </div>
            {onStatusChange ? (
              <Select value={m.status || 'pending'} onValueChange={(v) => onStatusChange(m, v)}>
                <SelectTrigger className="h-8 w-[132px] rounded-lg border-slate-200 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${s.chip}`}>{s.label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}