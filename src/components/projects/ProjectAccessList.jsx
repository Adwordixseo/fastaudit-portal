import React from 'react';
import { Trash2, Users } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProjectAccessList({ access = [], onRevoke }) {
  if (access.length === 0) {
    return <p className="text-sm text-slate-500">Only you can see this project. Share it to let a team member in.</p>;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {access.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600"><Users className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{a.name || a.email}</p>
              <p className="truncate text-xs text-slate-400">{a.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={a.status || 'invited'} />
            <button onClick={() => onRevoke(a)} title="Revoke access" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}