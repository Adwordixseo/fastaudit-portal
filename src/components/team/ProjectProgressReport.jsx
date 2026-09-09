import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle, Loader2, FileBarChart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EmptyState from '@/components/portal/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { fmtDate } from '@/lib/format';

export default function ProjectProgressReport({ projects = [] }) {
  const { data: milestones = [], isLoading } = useQuery({ queryKey: ['milestones', 'all'], queryFn: () => base44.entities.Milestone.list('-due_date') });

  const byProject = (pid) => milestones.filter((m) => m.project_id === pid);
  const completedAll = milestones.filter((m) => m.status === 'done');

  if (projects.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileBarChart className="h-5 w-5" /></span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Progress report</h2>
          <p className="text-sm text-slate-500">Latest project progress and completed milestones.</p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Active projects</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{projects.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Avg. progress</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{projects.length ? Math.round(projects.reduce((a, p) => a + (p.progress || 0), 0) / projects.length) : 0}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Milestones done</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{completedAll.length}<span className="ml-1 text-sm font-medium text-slate-400">/ {milestones.length}</span></p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const ms = byProject(p.id);
            const done = ms.filter((m) => m.status === 'done');
            return (
              <div key={p.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{p.name}</h3>
                    <p className="truncate text-xs text-slate-400">{p.client_email}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={p.progress || 0} className="h-2 flex-1" />
                  <span className="text-xs font-semibold text-slate-700">{p.progress || 0}%</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">Completed milestones · {done.length}/{ms.length}</p>
                  {done.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">No milestones completed yet.</p>
                  ) : (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {done.map((m) => (
                        <li key={m.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> {m.title}{m.due_date && <span className="text-emerald-500/70"> · {fmtDate(m.due_date)}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}